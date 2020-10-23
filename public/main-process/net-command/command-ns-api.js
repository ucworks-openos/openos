const winston = require('../../winston')

const CommandHeader = require('./command-header');
const CmdCodes = require('./command-code');
const CmdConst = require('./command-const');
const OsUtil = require('../utils/utils-os');
const BufferUtil = require('../utils/utils-buffer');
const CryptoUtil = require('../utils/utils-crypto');
const nsCore = require('../net-core/network-ns-core');
const { adjustBufferMultiple4, getMultiple4Size } = require('../utils/utils-buffer');
const { MSG_TYPE, MSG_DATA_TYPE, CHAT_ROOM_TYPE, DATE_FORMAT } = require('../common/common-const');
const ResData = require('../ResData');
const { logout } = require('../main-handler');

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
            winston.info('NS Connect Success!');

            reqSignInNS().then(function(resData){
                resolve(resData);
            }).catch(function(err) {
                reject(err);
            })

        }).catch(function(err){
            winston.err('NS Connect fale!', err);
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

        //winston.debug('NS CONNECTION SIGN-IN :', userOsInfo)    
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
function reqSendMessage(recvIds, recvNames, subject, message, attFileInfo) {
    return new Promise(async function(resolve, reject) {

        if (!global.SERVER_INFO.NS.isConnected) {
            reject(new Error('NS IS NOT CONNECTED!'));
            return;
        }

        let destNamesBuf = Buffer.from(recvNames, global.ENC)
        let destIdsBuf = Buffer.from(recvIds, global.ENC)

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
        gubunBuf.write(MSG_DATA_TYPE.COMMON, global.ENC);
        subjectBuf.write(subject, global.ENC);
        sendIdBuf.write(global.USER.userId, global.ENC);
        sendNameBuf.write(global.USER.userName, global.ENC);
        sendDateBuf.write(OsUtil.getDateString(DATE_FORMAT.YYYYMMDDHHmmssSSS), global.ENC)  //yyyymmddhhnnsszzz
        resGubunBuf.writeInt32LE(CmdConst.MSG_ALERT);
        destNameSizeBuf.writeInt32LE(destNamesBuf.length)
        destIdSizeBuf.writeInt32LE(destIdsBuf.length);

        // Message Data
        let cipherData = CryptoUtil.encryptMessage(message);
        let cipherContentBuf = Buffer.from(cipherData.cipherContent, global.ENC);
        cipherContentSizeBuf.writeInt32LE(cipherContentBuf.length);
        encryptKeyBuf.write(cipherData.encKey, global.ENC);

        // Attachmenet File
        let attFileInfoBuf = Buffer.from(attFileInfo);
        fileSizeBuf.writeInt32LE(attFileInfoBuf.length);

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


        winston.info('[SEND MESSAGE] -------  encryptKey,  cipherContent', cipherData);
        nsCore.writeCommandNS(new CommandHeader(CmdCodes.NS_SEND_MSG, 0), dataBuf);
    });
}

/**
 * 쪽지 삭제 요청
 * @param {MSG_TYPE} msgGubun 
 * @param {Array} msgKeys 
 */
function reqDeleteMessage(msgGubun, msgKeys) {
    return new Promise(async function(resolve, reject) {
        winston.info('----------- msgKeys', msgKeys)

        if (!global.SERVER_INFO.NS.isConnected) {
            reject(new Error('NS IS NOT CONNECTED!'));
            return;
        }

        var userIdBuf = Buffer.alloc(CmdConst.BUF_LEN_USERID);
        userIdBuf.write(global.USER.userId, global.ENC);

        var gubunBuf = Buffer.alloc(CmdConst.BUF_LEN_GUBUN);
        gubunBuf.write(msgGubun);

        var skipBuf = Buffer.alloc(BufferUtil.getMultiple4DiffSize(CmdConst.BUF_LEN_USERID + CmdConst.BUF_LEN_GUBUN))

        var periodBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);
        periodBuf.writeInt32LE(0); // default : 0, 전체삭제 : -1 , not used 나중에 씀. ~일 지난거 삭제 추가할때 씀.

        var keyBuf = Buffer.from(msgKeys.join(CmdConst.SEP_PIPE), global.ENC)      

        var keySizeBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);
        keySizeBuf.writeInt32LE(keyBuf.length);

        let dataBuf = Buffer.concat([
            userIdBuf
            , gubunBuf
            , skipBuf
            , periodBuf
            , keySizeBuf
            , keyBuf
        ]);

        nsCore.writeCommandNS(new CommandHeader(CmdCodes.NS_DELETE_MESSAGE, 0), dataBuf);

        resolve(new ResData(true));
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

        winston.info('[CHANGE_STATUS] ', status, global.USER.userId)

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

        winston.info('[NOTIFY_USERS] userIds:', userIds)

        var data = userIds.join(CmdConst.SEP_PIPE);
        var dataBuf = Buffer.from(data, global.ENC);

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

        if (!buddyData) {
            reject(new Error('Empty Target!'));
            return;
        }

        winston.info('[SAVE BUDDY] buddyData:', buddyData)

        let idBuf = Buffer.alloc(CmdConst.BUF_LEN_USERID);
        idBuf.write(global.USER.userId);

        let buddyBuf = Buffer.from(buddyData, global.ENC)
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
        
        // 빈 LineKey
        let lineKeyBuf = Buffer.alloc(CmdConst.BUF_LEN_CHAT_ROOM_KEY)

        var dataBuf = Buffer.concat([roomKeyBuf, lineKeyBuf]);
        dataBuf = adjustBufferMultiple4(dataBuf);

        nsCore.writeCommandNS(new CommandHeader(CmdCodes.NS_CHAT_LINEKEY, 0, function(resData){
            resolve(resData);
        }), dataBuf);
    });
}

/**
 * 대화메세지를 보냅니다.
 * @param {String} roomKey 
 * @param {String} lineKey 
 * @param {String} userIds 
 * @param {String} message 
 */
function reqSendChatMessage(roomKey, lineKey, userIds, message, roomTitle) {
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
        winston.info('Chat Enc Data', encData);

        /*********************** */

        // roomKey
        let roomKeyBuf = Buffer.alloc(CmdConst.BUF_LEN_CHAT_ROOM_KEY);
        roomKeyBuf.write(roomKey, global.ENC);
        roomKeyBuf = adjustBufferMultiple4(roomKeyBuf);
        winston.info('roomKey', roomKey , roomKeyBuf.length);

        // roomType
        let roomTypeBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);
        roomTypeBuf.writeInt32LE(userIds.length>1?CHAT_ROOM_TYPE.MULTI:CHAT_ROOM_TYPE.SINGLE);

        let lineKeyBuf = Buffer.alloc(CmdConst.BUF_LEN_CHAT_ROOM_KEY);
        lineKeyBuf.write(lineKey, global.ENC);
        lineKeyBuf = adjustBufferMultiple4(lineKeyBuf);
        winston.info('lineKey', lineKey, lineKeyBuf.length)

        let lineNumberBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);
        lineNumberBuf.writeInt32LE(1);

        let unreadCountBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);
        unreadCountBuf.writeInt32LE(1);

        let sendDate = OsUtil.getDateString(DATE_FORMAT.YYYYMMDDHHmmssSSS);
        let sendDateBuf = Buffer.alloc(CmdConst.BUF_LEN_DATE);
        sendDateBuf.write(sendDate, global.ENC);
        let ipBuf = Buffer.alloc(CmdConst.BUF_LEN_IP);

        // Multiple4Size
        let multiple4Length = getMultiple4Size(CmdConst.BUF_LEN_DATE + CmdConst.BUF_LEN_IP);
        let bufLen = CmdConst.BUF_LEN_DATE + CmdConst.BUF_LEN_IP;
        ipBuf = Buffer.concat([ipBuf, Buffer.alloc(multiple4Length - bufLen)])
        winston.info('sendDate + IP', sendDate, ipBuf.length-CmdConst.BUF_LEN_IP)

        let portBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);

        //font_info
        let fontSizeBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);       // fontsize
        let fontStyleBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);      // TFontStyles; ??
        let fontColorBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);      // TColor; ??

        let fontName = '맑은고딕';
        let fontNameBuf = Buffer.alloc(CmdConst.BUF_LEN_FONTNAME); //fontName
        fontNameBuf.write(fontName, global.ENC);
        fontNameBuf = adjustBufferMultiple4(fontNameBuf)
        winston.info('fontName', fontName, fontNameBuf.length)


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

        let chatDataSizeBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);   // chatdata_size
        let chatDataBuf = Buffer.from(encData.cipherContent);
        chatDataSizeBuf.writeInt32LE(chatDataBuf.length);

        let destIdSizeBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);     // destid_size
        let destIdBuf = Buffer.from(idDatas + CmdConst.SEP_CR + roomTitle);
        destIdSizeBuf.writeInt32LE(destIdBuf.length);

        var dataBuf = Buffer.concat([roomKeyBuf,roomTypeBuf,lineKeyBuf,lineNumberBuf,lineNumberBuf,sendDateBuf,ipBuf,portBuf,
                    fontSizeBuf,fontStyleBuf,fontColorBuf,fontNameBuf,
                    tmpBuf1, //sendIdBuf,sendNameBuf,encryptKeyBuf,
                    chatCmdBuf, chatKeySizeBuf,chatDataSizeBuf,destIdSizeBuf, 
                    chatKeyBuf,chatDataBuf,destIdBuf]);

        nsCore.writeCommandNS(new CommandHeader(CmdCodes.SB_CHAT_DATA, 0), dataBuf);
    });
}

/**
 * 대화방 나가기
 * @param {String} roomKey 
 * @param {CHAT_ROOM_TYPE} roomType 
 */
function reqExitChatRoom(roomKey, userIds) {
    return new Promise(async function(resolve, reject) {

        if (!global.SERVER_INFO.NS.isConnected) {
            reject(new Error('NS IS NOT CONNECTED!'));
            return;
        }

        /*********************** */

        let idDatas = userIds.join(CmdConst.SEP_PIPE);

        // roomKey
        let roomKeyBuf = Buffer.alloc(CmdConst.BUF_LEN_CHAT_ROOM_KEY);
        roomKeyBuf.write(roomKey, global.ENC);
        roomKeyBuf = adjustBufferMultiple4(roomKeyBuf);
        winston.info('roomKey', roomKey , roomKeyBuf.length);

        // roomType
        let roomTypeBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);
        roomTypeBuf.writeInt32LE(userIds.length>1?CHAT_ROOM_TYPE.MULTI:CHAT_ROOM_TYPE.SINGLE);

        let lineKeyBuf = Buffer.alloc(CmdConst.BUF_LEN_CHAT_ROOM_KEY);
        //lineKeyBuf.write(lineKey, global.ENC);
        lineKeyBuf = adjustBufferMultiple4(lineKeyBuf);

        let lineNumberBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);
        lineNumberBuf.writeInt32LE(0);

        let unreadCountBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);
        unreadCountBuf.writeInt32LE(0);

        let sendDate = OsUtil.getDateString(DATE_FORMAT.YYYYMMDDHHmmssSSS);
        let sendDateBuf = Buffer.alloc(CmdConst.BUF_LEN_DATE);
        //sendDateBuf.write(sendDate, global.ENC);
        let ipBuf = Buffer.alloc(CmdConst.BUF_LEN_IP);

        // Multiple4Size
        let multiple4Length = getMultiple4Size(CmdConst.BUF_LEN_DATE + CmdConst.BUF_LEN_IP);
        let bufLen = CmdConst.BUF_LEN_DATE + CmdConst.BUF_LEN_IP;
        ipBuf = Buffer.concat([ipBuf, Buffer.alloc(multiple4Length - bufLen)])
        winston.info('sendDate + IP', sendDate, ipBuf.length-CmdConst.BUF_LEN_IP)

        let portBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);

        //font_info
        let fontSizeBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);       // fontsize
        let fontStyleBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);      // TFontStyles; ??
        let fontColorBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);      // TColor; ??

        let fontName = '맑은고딕';
        let fontNameBuf = Buffer.alloc(CmdConst.BUF_LEN_FONTNAME); //fontName
        fontNameBuf.write(fontName, global.ENC);
        fontNameBuf = adjustBufferMultiple4(fontNameBuf)
        winston.info('fontName', fontName, fontNameBuf.length)


        let sendIdBuf = Buffer.alloc(CmdConst.BUF_LEN_USERID);
        sendIdBuf.write(global.USER.userId, global.ENC);

        let sendNameBuf = Buffer.alloc(CmdConst.BUF_LEN_USERNAME);
        sendNameBuf.write(global.USER.userName, global.ENC);

        let encryptKeyBuf = Buffer.alloc(CmdConst.BUF_LEN_ENCRYPT);
        //encryptKeyBuf.write(encData.encKey, global.ENC);
        
        let concatBuf = Buffer.concat([sendIdBuf, sendNameBuf, encryptKeyBuf])
        let tmpBuf1 = adjustBufferMultiple4(concatBuf);

        let chatCmdBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);        // chat_cmd
        chatCmdBuf.writeInt32LE(CmdCodes.CHAT_DEL_USER)

        let chatKeySizeBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);    // chatkey_size
        let chatKeyBuf = Buffer.from(roomKey + CmdConst.SEP_PIPE + idDatas);
        chatKeySizeBuf.writeInt32LE(chatKeyBuf.length);

        let chatDataSizeBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);   // chatdata_size
        let chatDataBuf = Buffer.from('');
        chatDataSizeBuf.writeInt32LE(chatDataBuf.length);

        let destIdSizeBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);     // destid_size
        let destIdBuf = Buffer.from(idDatas + CmdConst.SEP_CR);
        destIdSizeBuf.writeInt32LE(destIdBuf.length);

        var dataBuf = Buffer.concat([roomKeyBuf,roomTypeBuf,lineKeyBuf,lineNumberBuf,lineNumberBuf,sendDateBuf,ipBuf,portBuf,
                    fontSizeBuf,fontStyleBuf,fontColorBuf,fontNameBuf,
                    tmpBuf1, //sendIdBuf,sendNameBuf,encryptKeyBuf,
                    chatCmdBuf, chatKeySizeBuf,chatDataSizeBuf,destIdSizeBuf, 
                    chatKeyBuf,chatDataBuf,destIdBuf]);

        nsCore.writeCommandNS(new CommandHeader(CmdCodes.SB_CHAT_USER_CHANGE, 0), dataBuf);
    });
}

/**
 * 대화방 이름 변경
 * @param {String} roomKey 
 * @param {String} roomName
 */
function reqChangeChatRoomName(roomKey, roomName, userIds) {
    return new Promise(async function(resolve, reject) {

        if (!global.SERVER_INFO.NS.isConnected) {
            reject(new Error('NS IS NOT CONNECTED!'));
            return;
        }

        /** REQ REAL DATA */
        let idDatas = userIds.join(CmdConst.SEP_PIPE);
        
        // chat_cmd
        let chatCmdBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);        
        chatCmdBuf.writeInt32LE(CmdCodes.CHAT_CHANGE_TITLE)

        // chatdata_size
        let chatDataSizeBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);   
        let chatDataBuf = Buffer.from(roomName);
        chatDataSizeBuf.writeInt32LE(chatDataBuf.length);


        /** REQ DEFAULT DATA */
        // roomKey
        let roomKeyBuf = Buffer.alloc(CmdConst.BUF_LEN_CHAT_ROOM_KEY);
        roomKeyBuf.write(roomKey, global.ENC);
        roomKeyBuf = adjustBufferMultiple4(roomKeyBuf);
        winston.info('roomKey', roomKey , roomKeyBuf.length);

        // roomType
        let roomTypeBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);
        roomTypeBuf.writeInt32LE(userIds.length>1?CHAT_ROOM_TYPE.MULTI:CHAT_ROOM_TYPE.SINGLE);

        let lineKeyBuf = Buffer.alloc(CmdConst.BUF_LEN_CHAT_ROOM_KEY);
        lineKeyBuf = adjustBufferMultiple4(lineKeyBuf);

        let lineNumberBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);
        lineNumberBuf.writeInt32LE(0);

        let unreadCountBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);
        unreadCountBuf.writeInt32LE(0);

        let sendDate = OsUtil.getDateString(DATE_FORMAT.YYYYMMDDHHmmssSSS);
        let sendDateBuf = Buffer.alloc(CmdConst.BUF_LEN_DATE);
        //sendDateBuf.write(sendDate, global.ENC);
        let ipBuf = Buffer.alloc(CmdConst.BUF_LEN_IP);

        // Multiple4Size
        let multiple4Length = getMultiple4Size(CmdConst.BUF_LEN_DATE + CmdConst.BUF_LEN_IP);
        let bufLen = CmdConst.BUF_LEN_DATE + CmdConst.BUF_LEN_IP;
        ipBuf = Buffer.concat([ipBuf, Buffer.alloc(multiple4Length - bufLen)])
        winston.info('sendDate + IP', sendDate, ipBuf.length-CmdConst.BUF_LEN_IP)

        let portBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);

        //font_info
        let fontSizeBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);       // fontsize
        let fontStyleBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);      // TFontStyles; ??
        let fontColorBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);      // TColor; ??

        let fontName = '맑은고딕';
        let fontNameBuf = Buffer.alloc(CmdConst.BUF_LEN_FONTNAME); //fontName
        fontNameBuf.write(fontName, global.ENC);
        fontNameBuf = adjustBufferMultiple4(fontNameBuf)
        winston.info('fontName', fontName, fontNameBuf.length)

        let sendIdBuf = Buffer.alloc(CmdConst.BUF_LEN_USERID);
        sendIdBuf.write(global.USER.userId, global.ENC);

        let sendNameBuf = Buffer.alloc(CmdConst.BUF_LEN_USERNAME);
        sendNameBuf.write(global.USER.userName, global.ENC);

        let encryptKeyBuf = Buffer.alloc(CmdConst.BUF_LEN_ENCRYPT);
        
        let concatBuf = Buffer.concat([sendIdBuf, sendNameBuf, encryptKeyBuf])
        let tmpBuf1 = adjustBufferMultiple4(concatBuf);

        let chatKeySizeBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);    // chatkey_size
        let chatKeyBuf = Buffer.from(roomKey + CmdConst.SEP_PIPE + idDatas);
        chatKeySizeBuf.writeInt32LE(chatKeyBuf.length);

        let destIdSizeBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);     // destid_size
        let destIdBuf = Buffer.from(idDatas + CmdConst.SEP_CR);
        destIdSizeBuf.writeInt32LE(destIdBuf.length);

        var dataBuf = Buffer.concat([roomKeyBuf,roomTypeBuf,lineKeyBuf,lineNumberBuf,lineNumberBuf,sendDateBuf,ipBuf,portBuf,
                    fontSizeBuf,fontStyleBuf,fontColorBuf,fontNameBuf,
                    tmpBuf1, //sendIdBuf,sendNameBuf,encryptKeyBuf,
                    chatCmdBuf, chatKeySizeBuf,chatDataSizeBuf,destIdSizeBuf, 
                    chatKeyBuf,chatDataBuf,destIdBuf]);

        nsCore.writeCommandNS(new CommandHeader(CmdCodes.SB_CHAT_USER_CHANGE, 0), dataBuf);
    });
}

/**
 * 대화상대 참여
 * @param {String} roomKey 
 * @param {String} newRoomName 
 * @param {Array} asIsUserIds 
 * @param {Array} newUserIds 
 */
function reqInviteChatUser(roomKey, newRoomName, asIsUserIds, newUserIds) {
    return new Promise(async function(resolve, reject) {

        if (!global.SERVER_INFO.NS.isConnected) {
            reject(new Error('NS IS NOT CONNECTED!'));
            return;
        }

        /** REQ REAL DATA */
        //전체 참여자ID + CR_SEP + 대화방 이름 + CR_SEP + 채팅방 추가 참여자ID를 넣는다.
        let userIds = Array.concat(asIsUserIds, newUserIds);
        let idDatas = userIds.join(CmdConst.SEP_PIPE);
        let inviteData = idDatas
            + CmdConst.SEP_CR + newRoomName 
            + CmdConst.SEP_CR + newUserIds.join(CmdConst.SEP_PIPE);

        // Chat Command
        let chatCmdBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);        // chat_cmd
        chatCmdBuf.writeInt32LE(CmdCodes.CHAT_ADD_USER)

        // Chat Data
        let chatDataSizeBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);   // chatdata_size
        let chatDataBuf = Buffer.from(inviteData);
        chatDataSizeBuf.writeInt32LE(chatDataBuf.length);


        /** REQ DEFAULT DATA */
        // roomKey
        let roomKeyBuf = Buffer.alloc(CmdConst.BUF_LEN_CHAT_ROOM_KEY);
        roomKeyBuf.write(roomKey, global.ENC);
        roomKeyBuf = adjustBufferMultiple4(roomKeyBuf);
        winston.info('roomKey', roomKey , roomKeyBuf.length);

        // roomType
        let roomTypeBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);
        roomTypeBuf.writeInt32LE(userIds.length>1?CHAT_ROOM_TYPE.MULTI:CHAT_ROOM_TYPE.SINGLE);

        let lineKeyBuf = Buffer.alloc(CmdConst.BUF_LEN_CHAT_ROOM_KEY);
        //lineKeyBuf.write(lineKey, global.ENC);
        lineKeyBuf = adjustBufferMultiple4(lineKeyBuf);

        let lineNumberBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);
        lineNumberBuf.writeInt32LE(0);

        let unreadCountBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);
        unreadCountBuf.writeInt32LE(0);

        let sendDate = OsUtil.getDateString(DATE_FORMAT.YYYYMMDDHHmmssSSS);
        let sendDateBuf = Buffer.alloc(CmdConst.BUF_LEN_DATE);
        //sendDateBuf.write(sendDate, global.ENC);
        let ipBuf = Buffer.alloc(CmdConst.BUF_LEN_IP);

        // Multiple4Size
        let multiple4Length = getMultiple4Size(CmdConst.BUF_LEN_DATE + CmdConst.BUF_LEN_IP);
        let bufLen = CmdConst.BUF_LEN_DATE + CmdConst.BUF_LEN_IP;
        ipBuf = Buffer.concat([ipBuf, Buffer.alloc(multiple4Length - bufLen)])
        winston.info('sendDate + IP', sendDate, ipBuf.length-CmdConst.BUF_LEN_IP)

        let portBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);

        //font_info
        let fontSizeBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);       // fontsize
        let fontStyleBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);      // TFontStyles; ??
        let fontColorBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);      // TColor; ??

        let fontName = '맑은고딕';
        let fontNameBuf = Buffer.alloc(CmdConst.BUF_LEN_FONTNAME); //fontName
        fontNameBuf.write(fontName, global.ENC);
        fontNameBuf = adjustBufferMultiple4(fontNameBuf)
        winston.info('fontName', fontName, fontNameBuf.length)

        let sendIdBuf = Buffer.alloc(CmdConst.BUF_LEN_USERID);
        sendIdBuf.write(global.USER.userId, global.ENC);

        let sendNameBuf = Buffer.alloc(CmdConst.BUF_LEN_USERNAME);
        sendNameBuf.write(global.USER.userName, global.ENC);

        let encryptKeyBuf = Buffer.alloc(CmdConst.BUF_LEN_ENCRYPT);
        
        let concatBuf = Buffer.concat([sendIdBuf, sendNameBuf, encryptKeyBuf])
        let tmpBuf1 = adjustBufferMultiple4(concatBuf);

        let chatKeySizeBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);    // chatkey_size
        let chatKeyBuf = Buffer.from(roomKey + CmdConst.SEP_PIPE + idDatas);
        chatKeySizeBuf.writeInt32LE(chatKeyBuf.length);

        let destIdSizeBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);     // destid_size
        let destIdBuf = Buffer.from(idDatas + CmdConst.SEP_CR);
        destIdSizeBuf.writeInt32LE(destIdBuf.length);

        var dataBuf = Buffer.concat([roomKeyBuf,roomTypeBuf,lineKeyBuf,lineNumberBuf,lineNumberBuf,sendDateBuf,ipBuf,portBuf,
                    fontSizeBuf,fontStyleBuf,fontColorBuf,fontNameBuf,
                    tmpBuf1, //sendIdBuf,sendNameBuf,encryptKeyBuf,
                    chatCmdBuf, chatKeySizeBuf,chatDataSizeBuf,destIdSizeBuf, 
                    chatKeyBuf,chatDataBuf,destIdBuf]);

        nsCore.writeCommandNS(new CommandHeader(CmdCodes.SB_CHAT_USER_CHANGE, 0), dataBuf);
    });
}

/**
 * 나의 대화명을 입력합니다.
 * @param {String} myAlias 
 */
function reqUpdateMyAlias(myAlias) {
    return new Promise(async function(resolve, reject) {

        if (!global.SERVER_INFO.NS.isConnected) {
            reject(new Error('NS IS NOT CONNECTED!'));
            return;
        }

        let sendIdBuf = Buffer.alloc(CmdConst.BUF_LEN_USERID);
        sendIdBuf.write(global.USER.userId, global.ENC);
        sendIdBuf = adjustBufferMultiple4(sendIdBuf);
        let myAliasBuf = Buffer.from(myAlias, global.ENC);

        console.log('req Alias -%s-', myAliasBuf.toString(global.ENC), myAliasBuf.length, myAliasBuf);

        var dataBuf = Buffer.concat([sendIdBuf, myAliasBuf]);
        nsCore.writeCommandNS(new CommandHeader(CmdCodes.NS_CHANGE_ALIAS, 0, function(resData){
            if (resData.resCode) resolve(resData);
            else reject(new Error('My Alias Change Fail! ' + JSON.stringify(resData)));
        }), dataBuf);
    });
}

/**
 * 나의 대화명을 입력합니다.
 * @param {String} myAlias 
 */
function reqIpPhone(reqXml) {
    return new Promise(async function(resolve, reject) {

        if (!global.SERVER_INFO.NS.isConnected) {
            reject(new Error('NS IS NOT CONNECTED!'));
            return;
        }

        let userIdBuf = Buffer.alloc(CmdConst.BUF_LEN_USERID);
        userIdBuf.write(global.USER.userId, global.ENC);
        userIdBuf = adjustBufferMultiple4(userIdBuf);

        let xmlBuf = Buffer.from(reqXml, global.ENC);

        let xmlSizeBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);
        xmlSizeBuf.writeInt32LE(xmlBuf.length);

        winston.debug('req IpPhone ', reqXml);

        var dataBuf = Buffer.concat([userIdBuf, xmlSizeBuf,xmlBuf]);
        nsCore.writeCommandNS(new CommandHeader(CmdCodes.NS_IPPHONE_DATA, 0, function(resData){
            if (resData.resCode) resolve(resData);
            else reject(new Error('reqIpPhone Res Fail! ' + JSON.stringify(resData)));
        }), dataBuf);
    });
}

module.exports = {
    reqconnectNS: reqconnectNS,
    reqSendMessage: reqSendMessage,
    reqDeleteMessage: reqDeleteMessage,
    reqChangeStatus: reqChangeStatus,
    reqGetStatus: reqGetStatus,
    reqSetStatusMonitor: reqSetStatusMonitor,
    reqSaveBuddyData: reqSaveBuddyData,
    reqChatLineKey: reqChatLineKey,
    reqSendChatMessage: reqSendChatMessage,
    reqExitChatRoom: reqExitChatRoom,
    reqChangeChatRoomName: reqChangeChatRoomName,
    reqUpdateMyAlias: reqUpdateMyAlias,
    reqInviteChatUser: reqInviteChatUser,
    reqIpPhone: reqIpPhone,
    close: close,
}
