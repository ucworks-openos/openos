const { sendLog } = require('../ipc/ipc-cmd-sender');

const CommandHeader = require('./command-header');
const CmdCodes = require('./command-code');
const CmdConst = require('./command-const');
const OsUtil = require('../utils/utils-os');
const CryptoUtil = require('../utils/utils-crypto');
const nsCore = require('../net-core/network-ns-core');

/**
 * 연결을 종료합니다.
 */
function close() {
    nsCore.close();
}

/**
 * 서버로 접속요청 합니다.
 */
function reqconnectNS () {
    return new Promise(async function(resolve, reject) {
        nsCore.connectNS().then(function() {
            sendLog('NS Connect Success!');

            reqSignInNS().then(function(resData){
                resolve(resData);
            }).catch(function(err) {
                reject(err);
            })

        }).catch(function(err){
            sendLog('NS Connect fale!' + JSON.stringify(err));
            reject(err);
        })
    });
}

/**
 * NS 서버 접속시 통과인증 요청을 합니다.
 */
function reqSignInNS() {
    return new Promise(async function(resolve, reject) {
        if (!global.SERVER_INFO.NS.isConnected) {
            reject(new Error('NS IS NOT CONNECTED!'));
            return;
        }

        var stateBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);
        stateBuf.writeInt32LE(CmdConst.STATE_ONLINE);

        var connectTypeBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);
        connectTypeBuf.writeInt32LE(CmdConst.CONNECT_TYPE_APP);

        var userIdBuf = Buffer.alloc(CmdConst.BUF_LEN_USERID);
        userIdBuf.write(global.USER.userId, global.ENC);

        var groupCodeBuf = Buffer.alloc(CmdConst.BUF_LEN_GROUP_CODE);
        groupCodeBuf.write(global.ORG.groupCode, global.ENC);

        var orgGroupCode1Buf = Buffer.alloc(CmdConst.BUF_LEN_ORG_GROUP_CODE);
        groupCodeBuf.write(global.ORG.orgGroupCode, global.ENC);
        
        var orgGroupCode2Buf = Buffer.alloc(CmdConst.BUF_LEN_ORG_GROUP_CODE);
        groupCodeBuf.write(global.ORG.orgGroupCode, global.ENC);

        var orgGroupCode3Buf = Buffer.alloc(CmdConst.BUF_LEN_ORG_GROUP_CODE);
        groupCodeBuf.write(global.ORG.orgGroupCode, global.ENC);

        var connectIpBuf = Buffer.alloc(CmdConst.BUF_LEN_IP);
        connectIpBuf.write(OsUtil.getIpAddress(), global.ENC);

        var connectTimeBuf = Buffer.alloc(CmdConst.BUF_LEN_TIME);

        let userOsInfo = CmdConst.SEP + CmdConst.SEP 
                        + OsUtil.getOsHostName() + '_' + global.USER.userName 
                        + CmdConst.SEP + CmdConst.SEP 
                        + OsUtil.getIpAddress() + CmdConst.SEP + OsUtil.getMacAddress()
                        + CmdConst.SEP + CmdConst.SEP 
                        + global.SITE_CONFIG.client_version + CmdConst.SEP + OsUtil.getOsInfo;

        //console.log('NS CONNECTION SIGN-IN :', userOsInfo)    
        var userOsInfoBuf = Buffer.from(userOsInfo, global.ENC);



        // Data Add
        let dataBuf = Buffer.concat([
            stateBuf
            , connectTypeBuf
            , userIdBuf
            , groupCodeBuf
            , orgGroupCode1Buf
            , orgGroupCode2Buf
            , orgGroupCode3Buf
            , connectIpBuf
            , connectTimeBuf
            , userOsInfoBuf
        ]);

        nsCore.writeCommandNS(new CommandHeader(CmdCodes.NS_CONNECT, 0, function(resData){
            if (resData.resCode) resolve(resData);
            else reject(new Error('NS SIGN_IN Fail! ' + JSON.stringify(resData)));
        }), dataBuf);
    });
}

/**
 * 쪽지를 보냅니다.
 * @param {String} userPass 
 */
function reqSendMessage(recvIds, recvNames, subject, message) {
    return new Promise(async function(resolve, reject) {

        if (!global.SERVER_INFO.NS.isConnected) {
            reject(new Error('NS IS NOT CONNECTED!'));
            return;
        }

        // 순서 지키기
        var encryptKeyBuf = Buffer.alloc(CmdConst.BUF_LEN_ENCRYPT);
        var keyBuf = Buffer.alloc(CmdConst.BUF_LEN_KEY);                  // 메세지 키 (전송시 키를 발생하여 수신시 해당 키로 데이터베이스에 저장한다.)
        var gubunBuf = Buffer.alloc(CmdConst.BUF_LEN_GUBUN);              // 메시지 구분 >> 일반(COMMON), 수신확인(CONFIRM))
        var subjectBuf = Buffer.alloc(CmdConst.BUF_LEN_SUBJECT);          // 제목
        var sendIdBuf = Buffer.alloc(CmdConst.BUF_LEN_USERID);            // 보낸사람 ID
        var sendNameBuf = Buffer.alloc(CmdConst.BUF_LEN_USERNAME);        // 보낸사람 이름
        var sendDateBuf = Buffer.alloc(CmdConst.BUF_LEN_SEND_DATE);       // 보낸일자/시간
        var resDateBuf = Buffer.alloc(CmdConst.BUF_LEN_RES_DATE);         // 예비용
        var resGubunBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);             //?
        var resSizeBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);              // 쪽지 백그라운드 이미지 사이즈
        var cipherContentSizeBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);    // 쪽지 데이터 사이즈
        var fileSizeBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);             // 첨부 파일정보 사이즈
        var destNameSizeBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);         // 수신자명 사이즈
        var allDestIdSizeBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);        // 전체 답장 및 수신 사용자정보용 수신자ID 사이즈
        var destIdSizeBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);           // 수신자 ID 사이즈

        let tmpPwd = '';
        let cipherPwd = '';
        let cipherContent = '';
        let cipherContentBuf = Buffer.alloc(0);
        let encKey = '';

        switch(global.ENCRYPT.msgAlgorithm) {
            case CmdConst.ENCODE_TYPE_OTS:
                tmpPwd = CryptoUtil.randomPassword(4);
                cipherPwd = CryptoUtil.encryptRC4(CmdConst.SESSION_KEY, tmpPwd);
                
                // Message Content
                cipherContent = CryptoUtil.encryptRC4(tmpPwd, message);
                cipherContentBuf = Buffer.from(cipherContent, global.ENC);
                cipherContentSizeBuf.writeInt32LE(cipherContentBuf.length);

                // Message Enctypt Info
                encKey = CmdConst.ENCODE_TYPE_OTS + CmdConst.PIPE_SEP + cipherPwd
                encryptKeyBuf.write(encKey, global.ENC);
                break;

            case CmdConst.ENCODE_TYPE_OTS_AES256:
                
                tmpPwd = CryptoUtil.randomPassword(32);
                cipherPwd = CryptoUtil.encryptAES256(CmdConst.SESSION_KEY_AES256, tmpPwd);
               
                // Message Content
                cipherContent = CryptoUtil.encryptAES256(tmpPwd, message)
                cipherContentBuf = Buffer.from(cipherContent, global.ENC);
                cipherContentSizeBuf.writeInt32LE(cipherContentBuf.length);

                // Message Enctypt Info
                encKey = CmdConst.ENCODE_TYPE_OTS_AES256 + CmdConst.PIPE_SEP + cipherPwd
                encryptKeyBuf.write(encKey, global.ENC);
                break;

            case CmdConst.ENCODE_TYPE_NO:
            default:
                cipherContent = message;
                cipherContentBuf = Buffer.from(message, global.ENC);
                cipherContentSizeBuf.writeInt32LE(cipherContentBuf.length);

                // Message Enctypt Info
                encKey = CmdConst.ENCODE_TYPE_NO + CmdConst.PIPE_SEP;
                break;
        }

        let destIdsBuf = Buffer.from(recvIds, global.ENC);
        let destNamesBuf = Buffer.from(recvNames, global.ENC);

        // 순서 지키기
        encryptKeyBuf.write(encKey, global.ENC);
        keyBuf.write(OsUtil.getUUID(), global.ENC);
        gubunBuf.write(CmdConst.MSG_COMMON_DATA, global.ENC);
        subjectBuf.write(subject, global.ENC);
        sendIdBuf.write(global.USER.userId, global.ENC);
        sendNameBuf.write(global.USER.userName, global.ENC);
        sendDateBuf.write(OsUtil.getDateString('YYYYMMDDHHmmssSSS'), global.ENC)  //yyyymmddhhnnsszzz
        resGubunBuf.writeInt32LE(CmdConst.MSG_ALERT);
        destNameSizeBuf.writeInt32LE(destNamesBuf.length)
        destIdSizeBuf.writeInt32LE(destIdsBuf.length);


        // default Header
        let dataBuf = Buffer.concat([
            encryptKeyBuf
            , keyBuf
            , gubunBuf
            , subjectBuf
            , sendIdBuf
            , sendNameBuf
            , sendDateBuf
            , resDateBuf
            , resGubunBuf
            , resSizeBuf
            , cipherContentSizeBuf
            , fileSizeBuf
            , destNameSizeBuf
            , allDestIdSizeBuf
            , destIdSizeBuf]);

        // Data Add
        dataBuf = Buffer.concat([dataBuf
            , cipherContentBuf
            , destNamesBuf
            , destIdsBuf]);


        console.log('[SEND MESSAGE] -------  encryptKey,  cipherContent', encKey, cipherContent);
        nsCore.writeCommandNS(new CommandHeader(CmdCodes.NS_SEND_MSG, 0), dataBuf);
    });
}

/**
 * 상태 정보 변경 요청
 * @param {Number} status 
 * @param {Boolean} force 
 */
function reqChangeStatus(status, force = false) {
    return new Promise(async function(resolve, reject) {

        if (!global.SERVER_INFO.NS.isConnected) {
            reject(new Error('NS IS NOT CONNECTED!'));
            return;
        }

        var svrSeqBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);
        if (force) svrSeqBuf.writeInt32LE(-99);
        else svrSeqBuf.writeInt32LE(0);

        var stateBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);
        stateBuf.writeInt32LE( Number(status) + 1);

        var connectTypeBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);
        connectTypeBuf.writeInt32LE(CmdConst.CONNECT_TYPE_APP);

        var userIdBuf = Buffer.alloc(CmdConst.BUF_LEN_USERID);
        userIdBuf.write(global.USER.userId, global.ENC);

        var senderIdBuf = Buffer.alloc(CmdConst.BUF_LEN_USERID);
        senderIdBuf.write(global.USER.userId, global.ENC);

        // Data Add
        let dataBuf = Buffer.concat([
            svrSeqBuf
            , stateBuf
            , connectTypeBuf
            , userIdBuf
            , senderIdBuf
        ]);

        console.log('[CHANGE_STATUS] ', status, global.USER.userId)

        nsCore.writeCommandNS(new CommandHeader(CmdCodes.NS_CHANGE_STATE, 0), dataBuf);
    });
}

/**
 * 상태정보를 요청합니다.
 * @param {Number} status 
 * @param {String} userId 
 */
function reqGetStatus(status, userId) {
    return new Promise(async function(resolve, reject) {

        if (!global.SERVER_INFO.NS.isConnected) {
            reject(new Error('NS IS NOT CONNECTED!'));
            return;
        }

        var svrSeqBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);
        svrSeqBuf.writeInt32LE(0);

        var stateBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);
        stateBuf.writeInt32LE(Number(status) + 1);

        var connectTypeBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);
        connectTypeBuf.writeInt32LE(CmdConst.CONNECT_TYPE_APP);

        var userIdBuf = Buffer.alloc(CmdConst.BUF_LEN_USERID);
        userIdBuf.write(userId, global.ENC);

        var senderIdBuf = Buffer.alloc(CmdConst.BUF_LEN_USERID);
        senderIdBuf.write(global.USER.userId, global.ENC);

        // Data Add
        let dataBuf = Buffer.concat([
            svrSeqBuf
            , stateBuf
            , connectTypeBuf
            , userIdBuf
            , senderIdBuf
        ]);

        console.log('[CHANGE_STATUS] ', status, global.USER.userId)

        nsCore.writeCommandNS(new CommandHeader(CmdCodes.NS_GET_STATE, 0), dataBuf);
    });
}

/**
 * 상태 알림을 받을 대상을 등록합니다.
 * @param  {Array} userIds 
 */
function reqSetStatusMonitor(userIds) {
    return new Promise(async function(resolve, reject) {

        if (!global.SERVER_INFO.NS.isConnected) {
            reject(new Error('NS IS NOT CONNECTED!'));
            return;
        }

        if (!userIds) {
            reject(new Error('Empty Target!'));
            return;
        }

        console.log('[NOTIFY_USERS] userIds:', userIds)

        var data = userIds.join(CmdConst.PIPE_SEP);
        var dataBuf = Buffer.from(data, global.ENC);

        console.log('[NOTIFY_USERS] ', data)

        nsCore.writeCommandNS(new CommandHeader(CmdCodes.NS_NOTIFY_FRIENDS, 0), dataBuf);
    });
}

module.exports = {
    reqconnectNS: reqconnectNS,
    reqSendMessage: reqSendMessage,
    reqChangeStatus: reqChangeStatus,
    reqGetStatus: reqGetStatus,
    reqSetStatusMonitor: reqSetStatusMonitor,
    close: close
}
