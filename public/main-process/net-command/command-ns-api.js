const { sendLog } = require('../ipc/ipc-cmd-sender');

const CommandHeader = require('./command-header');
const CmdCodes = require('./command-code');
const CmdConst = require('./command-const');
const OsUtil = require('../utils/utils-os');
const CryptoUtil = require('../utils/utils-crypto');
const nsCore = require('../net-core/network-ns-core');
const { adjustBufferMultiple4, getMultiple4Size } = require('../utils/utils-buffer');

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


        keyBuf.write(OsUtil.getUUID(), global.ENC);
        gubunBuf.write(CmdConst.MSG_COMMON_DATA, global.ENC);
        subjectBuf.write(subject, global.ENC);
        sendIdBuf.write(global.USER.userId, global.ENC);
        sendNameBuf.write(global.USER.userName, global.ENC);
        sendDateBuf.write(OsUtil.getDateString(CmdConst.DATE_FORMAT_YYYYMMDDHHmmssSSS), global.ENC)  //yyyymmddhhnnsszzz
        resGubunBuf.writeInt32LE(CmdConst.MSG_ALERT);
        destNameSizeBuf.writeInt32LE(destNamesBuf.length)
        destIdSizeBuf.writeInt32LE(destIdsBuf.length);

        // Message Data
        let cipherData = CryptoUtil.encryptMessage(message);
        cipherContentBuf = Buffer.from(cipherData.cipherContent, global.ENC);
        cipherContentSizeBuf.writeInt32LE(cipherContentBuf.length);
        encryptKeyBuf.write(cipherData.encKey, global.ENC);

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

        var data = userIds.join(CmdConst.SEP_PIPE);
        var dataBuf = Buffer.from(data, global.ENC);

        console.log('[NOTIFY_USERS] ', data)

        nsCore.writeCommandNS(new CommandHeader(CmdCodes.NS_NOTIFY_FRIENDS, 0), dataBuf);
    });
}

/**
 * 즐겨찾기 목록을 저장합니다.
 * @param  {buddyData}} buddyData 
 */
function reqSaveBuddyData(buddyData) {
    return new Promise(async function(resolve, reject) {

        if (!global.SERVER_INFO.NS.isConnected) {
            reject(new Error('NS IS NOT CONNECTED!'));
            return;
        }

        if (!userIds) {
            reject(new Error('Empty Target!'));
            return;
        }

        console.log('[SAVE BUDDY] buddyData:', buddyData)

        let idBuf = Buffer.alloc(CmdConst.BUF_LEN_USERID);
        idBuf.write(global.USER.userId);

        let buddyBuf = Buffer.from(buddyData)

        let dataBuf = Buffer.concat([idBuf, buddyBuf]);
        // DS명령으로 보낸다, 
        nsCore.writeCommandNS(new CommandHeader(CmdCodes.DS_SAVE_BUDDY_DATA, 0), dataBuf);
    });
}


/**
 * 메세지에 대한 lineKey를 요청합니다.
 * @param {String} chatRoomKey 
 */
function reqChatLineKey(chatRoomKey) {
    return new Promise(async function(resolve, reject) {

        if (!global.SERVER_INFO.NS.isConnected) {
            reject(new Error('NS IS NOT CONNECTED!'));
            return;
        }

        let roomKeyBuf = Buffer.alloc(CmdConst.BUF_LEN_CHAT_ROOM_KEY);
        roomKeyBuf.write(chatRoomKey, global.ENC);

        let lineKeyBuf = Buffer.alloc(CmdConst.BUF_LEN_CHAT_ROOM_KEY)

        var dataBuf = Buffer.concat([roomKeyBuf, lineKeyBuf]);
        nsCore.writeCommandNS(new CommandHeader(CmdCodes.NS_CHAT_LINEKEY, 0, function(resData){
            resolve(resData);
        }), dataBuf);
    });
}


function reqSendChatMessage(roomKey, lineKey, userIds, message) {
    return new Promise(async function(resolve, reject) {

        if (!global.SERVER_INFO.NS.isConnected) {
            reject(new Error('NS IS NOT CONNECTED!'));
            return;
        }

        // dest userInfos
        // let idDatas = '';
        // destIds.forEach(function(userId){
        //     idDatas += idDatas?CmdConst.SEP_CR+userId:userId;
        //   });
        let idDatas = userIds.join(CmdConst.SEP_PIPE);
        // encrypt Message
        let encData = CryptoUtil.encryptMessage(message);
        sendLog('Chat Enc Data', encData);

        /*********************** */

        // roomKey
        let roomKeyBuf = Buffer.alloc(CmdConst.BUF_LEN_CHAT_ROOM_KEY);
        roomKeyBuf.write(roomKey, global.ENC);
        roomKeyBuf = adjustBufferMultiple4(roomKeyBuf);
        sendLog('roomKey', roomKey , roomKeyBuf.length);

        // roomType
        let roomTypeBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);
        roomTypeBuf.writeInt32LE(userIds.length>1?2:1);

        let lineKeyBuf = Buffer.alloc(CmdConst.BUF_LEN_CHAT_ROOM_KEY);
        lineKeyBuf.write(lineKey, global.ENC);
        lineKeyBuf = adjustBufferMultiple4(lineKeyBuf);
        sendLog('lineKey', lineKey, lineKeyBuf.length)

        let lineNumberBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);
        lineNumberBuf.writeInt32LE(1);

        let unreadCountBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);
        unreadCountBuf.writeInt32LE(1);

        let sendDate = OsUtil.getDateString(CmdConst.DATE_FORMAT_YYYYMMDDHHmmssSSS);
        let sendDateBuf = Buffer.alloc(CmdConst.BUF_LEN_DATE);
        sendDateBuf.write(sendDate, global.ENC);
        let ipBuf = Buffer.alloc(CmdConst.BUF_LEN_IP);

        // Multiple4Size
        let multiple4Length = getMultiple4Size(CmdConst.BUF_LEN_DATE + CmdConst.BUF_LEN_IP);
        let bufLen = CmdConst.BUF_LEN_DATE + CmdConst.BUF_LEN_IP;
        ipBuf = Buffer.concat([ipBuf, Buffer.alloc(multiple4Length - bufLen)])
        sendLog('sendDate + IP', sendDate, ipBuf.length-CmdConst.BUF_LEN_IP)

        let portBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);

        //font_info
        let fontSizeBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);       // fontsize
        fontSizeBuf.writeInt32LE(Number(7));
        let fontStyleBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);      // TFontStyles; ??
        fontStyleBuf.writeInt32LE(Number(8));
        let fontColorBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);      // TColor; ??
        fontColorBuf.writeInt32LE(Number(9));

        let fontName = '맑은고딕';
        let fontNameBuf = Buffer.alloc(CmdConst.BUF_LEN_FONTNAME); //fontName
        fontNameBuf.write(fontName, global.ENC);
        fontNameBuf = adjustBufferMultiple4(fontNameBuf)
        sendLog('fontName', fontName, fontNameBuf.length)


        let sendIdBuf = Buffer.alloc(CmdConst.BUF_LEN_USERID);
        sendIdBuf.write(global.USER.userId, global.ENC);

        let sendNameBuf = Buffer.alloc(CmdConst.BUF_LEN_USERNAME);
        sendNameBuf.write(global.USER.userName, global.ENC);

        let encryptKeyBuf = Buffer.alloc(CmdConst.BUF_LEN_ENCRYPT);
        encryptKeyBuf.write(encData.encKey, global.ENC);
        
        let concatBuf = Buffer.concat([sendIdBuf, sendNameBuf, encryptKeyBuf])
        let tmpBuf1 = adjustBufferMultiple4(concatBuf);

        let chatCmdBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);        // chat_cmd
        chatCmdBuf.writeInt32LE(CmdCodes.CHAT_DATA_LINE)

        let chatKeySizeBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);    // chatkey_size
        let chatKeyBuf = Buffer.from(roomKey + CmdConst.SEP_PIPE + idDatas);
        chatKeySizeBuf.writeInt32LE(chatKeyBuf.length);
        console.log("chatKeyBuf.length", chatKeyBuf.length)

        let chatDataSizeBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);   // chatdata_size
        let chatDataBuf = Buffer.from(encData.cipherContent);
        chatDataSizeBuf.writeInt32LE(chatDataBuf.length);
        console.log("chatDataBuf.length", chatDataBuf.length)

        let destIdSizeBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);     // destid_size
        let destIdBuf = Buffer.from(idDatas + CmdConst.SEP_CR + 'ChattingRoom');
        destIdSizeBuf.writeInt32LE(destIdBuf.length);
        console.log("destIdBuf.length", destIdBuf.length)

        var dataBuf = Buffer.concat([roomKeyBuf,roomTypeBuf,lineKeyBuf,lineNumberBuf,lineNumberBuf,sendDateBuf,ipBuf,portBuf,
                    fontSizeBuf,fontStyleBuf,fontColorBuf,fontNameBuf,
                    tmpBuf1, //sendIdBuf,sendNameBuf,encryptKeyBuf,
                    chatCmdBuf, chatKeySizeBuf,chatDataSizeBuf,destIdSizeBuf, 
                    chatKeyBuf,chatDataBuf,destIdBuf]);

        nsCore.writeCommandNS(new CommandHeader(CmdCodes.SB_CHAT_DATA, 0), dataBuf);
    });
}


module.exports = {
    reqconnectNS: reqconnectNS,
    reqSendMessage: reqSendMessage,
    reqChangeStatus: reqChangeStatus,
    reqGetStatus: reqGetStatus,
    reqSetStatusMonitor: reqSetStatusMonitor,
    reqSaveBuddyData: reqSaveBuddyData,
    reqChatLineKey: reqChatLineKey,
    reqSendChatMessage: reqSendChatMessage,
    close: close,
}
