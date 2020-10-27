
const winston = require('../../winston');

const notifyManager = require('../notification/noti-manager');
const EncUtil = require('../utils/utils-crypto');
const BufUtil = require('../utils/utils-buffer');

const ResData = require('../ResData');
const CmdCodes = require('./command-code');
const CmdConst = require('./command-const');

const { callCallback } = require('./command-utils');
const { getMultiple4DiffSize, getMultiple4Size } = require('../utils/utils-buffer');

/**
 * 수신한 Command를 처리합니다. 
 * @param {CommandHeader} recvCmd 
 */
function receiveCmdProc(recvCmd) {

  winston.info('NS receiveCmdProc -- %s', recvCmd.cmdCode);

  // 보낸 Command가 없다면 알림으로 받은 Command이다.
  if (!recvCmd.sendCmd) {
    return notifyCmdProc(recvCmd);
  }

  // 요청한 Command로 찾는다.
  switch(recvCmd.sendCmd.cmdCode) {
    case CmdCodes.NS_CONNECT:

      switch (recvCmd.cmdCode) {
        case CmdCodes.NS_CONNECT:
          // 접속 성공
          callCallback(recvCmd.sendCmd, new ResData(true));
          break;

        case NS_USER_DISCONNECT:
        case NS_SERVER_BUSY:
        case NS_SERVER_CLOSE:
        default :
        {
          let rcvBuf = Buffer.from(recvCmd.data);
          let dataStr = rcvBuf.toString(global.ENC, 0);
          winston.warn('Response Command Receive Fail! : %s Data: %s', recvCmd.cmdCode, dataStr);
          callCallback(recvCmd.sendCmd, new ResData(false, 'Response Command Receive Fail! : ' + recvCmd.cmdCode));
          return false;
        }
      }
     
      break;

    case CmdCodes.NS_CHAT_LINEKEY:
      switch (recvCmd.cmdCode) {
        case CmdCodes.NS_CHAT_LINEKEY:
          let roomKey = BufUtil.getStringWithoutEndOfString(recvCmd.data, 0, CmdConst.BUF_LEN_CHAT_ROOM_KEY);
          let lineKey = BufUtil.getStringWithoutEndOfString(recvCmd.data, CmdConst.BUF_LEN_CHAT_ROOM_KEY);
          callCallback(recvCmd.sendCmd, new ResData(true, {roomKey:roomKey, lineKey,lineKey}));

          break;
        default :
        {
          let rcvBuf = Buffer.from(recvCmd.data);
          let dataStr = rcvBuf.toString(global.ENC, 0);
          callCallback(recvCmd.sendCmd, new ResData(false, 'Response Command Receive Fail! : ' + recvCmd.cmdCode));
          return false;
        }
      }
      break;
    
    case CmdCodes.NS_CHANGE_ALIAS :
      if (recvCmd.data) {
        let userId = BufUtil.getStringWithoutEndOfString(recvCmd.data, 0, CmdConst.BUF_LEN_USERID);        // 별칭 유저 아이디
        let alias = BufUtil.getStringWithoutEndOfString(recvCmd.data, getMultiple4Size(CmdConst.BUF_LEN_USERID));            // 별칭

        callCallback(recvCmd.sendCmd, new ResData(true, {userId:userId, alias:alias}));
      } else {
        let rcvBuf = Buffer.from(recvCmd.data);
        let dataStr = rcvBuf.toString(global.ENC, 0);
        winston.warn('My Alias Change Fail! ', dataStr);
        callCallback(recvCmd.sendCmd, new ResData(false, 'Response Command Receive Fail! : ' + recvCmd.cmdCode));
      }
      break;

    default :
    {
      let rcvBuf = Buffer.from(recvCmd.data);
      let dataStr = rcvBuf.toString(global.ENC, 0);
      callCallback(recvCmd.sendCmd, new ResData(false, 'Unknown Send Command Receive!!! SendCmd: ' + recvCmd.sendCmd.cmdCode +  ' RecvCmd:' + recvCmd.cmdCode + ' Data:' + dataStr));
      return false;
    }
  }

  return true;
}

/**
 * 알림으로 수신된 Command를 처리합니다.
 * @param {Command} recvCmd 
 */
function notifyCmdProc(recvCmd) {
  switch(recvCmd.cmdCode) {
    case CmdCodes.NS_SEND_MSG: // noti
      if (recvCmd.data) {
        let sInx = 0;

        //let encryptKey = recvCmd.data.toString(global.ENC, sInx, CmdConst.BUF_LEN_ENCRYPT).trim();
        // 끝문자열 바이트 처리
        // let tempBuf = recvCmd.data.slice(sInx, sInx + CmdConst.BUF_LEN_ENCRYPT);
        // let endOfStrInx = tempBuf.indexOf(0x00);  
        // tempBuf = tempBuf.slice(0, endOfStrInx);

        //let encryptKey = tempBuf.toString(global.ENC);
        let encryptKey = BufUtil.getStringWithoutEndOfString(recvCmd.data, sInx, CmdConst.BUF_LEN_ENCRYPT);
        sInx += CmdConst.BUF_LEN_ENCRYPT;

        let key = BufUtil.getStringWithoutEndOfString(recvCmd.data, sInx, CmdConst.BUF_LEN_KEY);               // 메세지 키 (전송시 키를 발생하여 수신시 해당 키로 데이터베이스에 저장한다.)
        sInx += CmdConst.BUF_LEN_KEY;

        let gubun = BufUtil.getStringWithoutEndOfString(recvCmd.data, sInx, CmdConst.BUF_LEN_GUBUN);             // 메시지 구분 >> 일반(COMMON), 수신확인(CONFIRM))
        sInx += CmdConst.BUF_LEN_GUBUN;

        let subject = BufUtil.getStringWithoutEndOfString(recvCmd.data, sInx, CmdConst.BUF_LEN_SUBJECT);           // 제목
        sInx += CmdConst.BUF_LEN_SUBJECT;

        //let sendId = recvCmd.data.toString(global.ENC, sInx, sInx + CmdConst.BUF_LEN_USERID).trim();            // 보낸사람 ID
        let sendId = BufUtil.getStringWithoutEndOfString(recvCmd.data,  sInx, CmdConst.BUF_LEN_USERID);            // 보낸사람 ID
        sInx += CmdConst.BUF_LEN_USERID;

        let sendName = BufUtil.getStringWithoutEndOfString(recvCmd.data, sInx, CmdConst.BUF_LEN_USERNAME);          // 보낸사람 이름
        sInx += CmdConst.BUF_LEN_USERNAME;

        let sendDate = BufUtil.getStringWithoutEndOfString(recvCmd.data, sInx, CmdConst.BUF_LEN_SEND_DATE);          // 보낸일자/시간
        sInx += CmdConst.BUF_LEN_SEND_DATE;

        let resDate = BufUtil.getStringWithoutEndOfString(recvCmd.data, sInx, CmdConst.BUF_LEN_RES_DATE);           // 예비용
        sInx += CmdConst.BUF_LEN_RES_DATE;

        let resGubun = recvCmd.data.readInt32LE(sInx);          //?
        sInx += CmdConst.BUF_LEN_INT;

        let resSize = recvCmd.data.readInt32LE(sInx);           // 쪽지 백그라운드 이미지 사이즈
        sInx += CmdConst.BUF_LEN_INT;

        let cipherContentSize = recvCmd.data.readInt32LE(sInx);    // 쪽지 데이터 사이즈
        sInx += CmdConst.BUF_LEN_INT;

        let fileSize = recvCmd.data.readInt32LE(sInx);             // 첨부 파일정보 사이즈
        sInx += CmdConst.BUF_LEN_INT;

        let destNameSize = recvCmd.data.readInt32LE(sInx);         // 수신자명 사이즈
        sInx += CmdConst.BUF_LEN_INT;

        let allDestIdSize = recvCmd.data.readInt32LE(sInx);        // 전체 답장 및 수신 사용자정보용 수신자ID 사이즈
        sInx += CmdConst.BUF_LEN_INT;

        let destIdSize = recvCmd.data.readInt32LE(sInx);           // 수신자 ID 사이즈
        sInx += CmdConst.BUF_LEN_INT;

        //
        // 추가 데이터 수신
        let resData = '';
        if (resSize > 0) {
          resData = BufUtil.getStringWithoutEndOfString(recvCmd.data, sInx, resSize);
          sInx += resSize;
        }

        let message = '';
        if (cipherContentSize > 0) {
          let cipherContents = BufUtil.getStringWithoutEndOfString(recvCmd.data, sInx, cipherContentSize);
          message = EncUtil.decryptMessage(encryptKey, cipherContents)
          sInx += cipherContentSize;
        }

        let fileData = '';
        if (fileSize > 0) {
          fileData = BufUtil.getStringWithoutEndOfString(recvCmd.data, sInx, fileSize);
          sInx += fileSize;
        }

        let destName = '';
        if (destNameSize > 0) {
          destName = BufUtil.getStringWithoutEndOfString(recvCmd.data, sInx, destNameSize);
          sInx += destNameSize;
        }

        let allDestId = '';
        if (allDestIdSize > 0) {
          allDestId = BufUtil.getStringWithoutEndOfString(recvCmd.data, sInx, allDestIdSize);
          sInx += allDestIdSize;
        }

        let destIds = '';
        if (destIdSize > 0) {
          destIds = BufUtil.getStringWithoutEndOfString(recvCmd.data, sInx, destIdSize);
          sInx += destIdSize;
        }
        

        notifyManager.messageReceived({
          encryptKey: encryptKey,
          key: key,
          gubun: gubun,
          subject: subject,
          sendId: sendId,
          sendName: sendName,
          sendDate: sendDate,
          resDate: resDate,
          resGubun: resGubun,
          resData: resData,
          message: message,
          fileData: fileData,
          destName: destName,
          allDestId: allDestId,
          destIds: destIds
        })

      } else {
        let rcvBuf = Buffer.from(recvCmd.data);
        let dataStr = rcvBuf.toString(global.ENC, 0);
        winston.warn('Message Recive Fail!! Data:%s', dataStr);
      }
     
      break;
    
    case CmdCodes.NS_UNREADALL_COUNT:
      if (recvCmd.data) {
        let sInx = 0;

        let userId = BufUtil.getStringWithoutEndOfString(recvCmd.data, sInx, CmdConst.BUF_LEN_USERID);
        sInx += CmdConst.BUF_LEN_USERID;

        let msgCnt = recvCmd.data.readInt32LE(sInx);
        sInx += CmdConst.BUF_LEN_INT;

        let chatCnt = recvCmd.data.readInt32LE(sInx);
        sInx += CmdConst.BUF_LEN_INT;

        let alertCnt = recvCmd.data.readInt32LE(sInx);
        sInx += CmdConst.BUF_LEN_INT;

        let etc1Cnt = recvCmd.data.readInt32LE(sInx);
        sInx += CmdConst.BUF_LEN_INT;

        let etc2Cnt = recvCmd.data.readInt32LE(sInx);
        sInx += CmdConst.BUF_LEN_INT;

        let etc3Cnt = recvCmd.data.readInt32LE(sInx);
        sInx += CmdConst.BUF_LEN_INT;

        let etc4Cnt = recvCmd.data.readInt32LE(sInx);
        sInx += CmdConst.BUF_LEN_INT;

        let etc5Cnt = recvCmd.data.readInt32LE(sInx);
        sInx += CmdConst.BUF_LEN_INT;


        notifyManager.unreadCountReceived({
          userId: userId,
          msgCnt: msgCnt,
          chatCnt: chatCnt,
          alertCnt: alertCnt,
          etc1Cnt: etc1Cnt,
          etc2Cnt: etc2Cnt,
          etc3Cnt: etc3Cnt,
          etc4Cnt: etc4Cnt,
          etc5Cnt: etc5Cnt
        })

      } else {
        let rcvBuf = Buffer.from(recvCmd.data);
        let dataStr = rcvBuf.toString(global.ENC, 0);
        winston.warn('Message Recive Fail!! Data:%s', dataStr);
      }
      break;
     
    case CmdCodes.NS_CHECK_SEND :
      // 그대로 서버로??

      break;
    
    case CmdCodes.NS_STATE_LIST :
      if (recvCmd.data) {
        let sInx = 0;

        let statusListStr = recvCmd.data.toString(global.ENC).trim();
        let statusList = statusListStr.split(CmdConst.SEP_CR);

        statusList.forEach(status => {
          statusInfos = status.split(CmdConst.SEP_PT);
          notifyManager.userStatusChanged(statusInfos[0],statusInfos[1], statusInfos[2])
        });
      } else {
        let rcvBuf = Buffer.from(recvCmd.data);
        let dataStr = rcvBuf.toString(global.ENC, 0);
        winston.warn('NS_STATE_LIST Fail!! Data:%s', dataStr);
      }
      break;
    
    case CmdCodes.SB_CHAT_DATA :
      let sInx = 0;

      let roomKey = BufUtil.getStringWithoutEndOfString(recvCmd.data, sInx, CmdConst.BUF_LEN_CHAT_ROOM_KEY);
      sInx += CmdConst.BUF_LEN_CHAT_ROOM_KEY;
      sInx += getMultiple4DiffSize(sInx);

      let roomType = recvCmd.data.readInt32LE(sInx);
      sInx += CmdConst.BUF_LEN_INT;

      let lineKey = BufUtil.getStringWithoutEndOfString(recvCmd.data, sInx, CmdConst.BUF_LEN_CHAT_ROOM_KEY);
      sInx += CmdConst.BUF_LEN_CHAT_ROOM_KEY;
      sInx += getMultiple4DiffSize(CmdConst.BUF_LEN_CHAT_ROOM_KEY);

      let lineNumber = recvCmd.data.readInt32LE(sInx);
      sInx += CmdConst.BUF_LEN_INT;

      let unreadCount = recvCmd.data.readInt32LE(sInx);
      sInx += CmdConst.BUF_LEN_INT;
      
      let sendDate = BufUtil.getStringWithoutEndOfString(recvCmd.data, sInx, CmdConst.BUF_LEN_DATE);
      sInx += CmdConst.BUF_LEN_DATE;

      let ip = BufUtil.getStringWithoutEndOfString(recvCmd.data, sInx, CmdConst.BUF_LEN_IP);
      sInx += CmdConst.BUF_LEN_IP;
      sInx += getMultiple4DiffSize(CmdConst.BUF_LEN_DATE + CmdConst.BUF_LEN_IP);

      let port = recvCmd.data.readInt32LE(sInx);
      sInx += CmdConst.BUF_LEN_INT;


      // font
      let fontSize = recvCmd.data.readInt32LE(sInx);
      sInx += CmdConst.BUF_LEN_INT;       // fontsize
      let fontStyle = recvCmd.data.readInt32LE(sInx);
      sInx += CmdConst.BUF_LEN_INT;      // TFontStyles; ??
      let fontColor = recvCmd.data.readInt32LE(sInx);
      sInx += CmdConst.BUF_LEN_INT;      // TColor; ??

      let fontName = BufUtil.getStringWithoutEndOfString(recvCmd.data, sInx, CmdConst.BUF_LEN_FONTNAME);
      sInx += CmdConst.BUF_LEN_FONTNAME;
      sInx += getMultiple4DiffSize(CmdConst.BUF_LEN_FONTNAME);


      let sendId = BufUtil.getStringWithoutEndOfString(recvCmd.data, sInx, CmdConst.BUF_LEN_USERID);
      sInx += CmdConst.BUF_LEN_USERID;
      let sendName = BufUtil.getStringWithoutEndOfString(recvCmd.data, sInx, CmdConst.BUF_LEN_USERNAME);
      sInx += CmdConst.BUF_LEN_USERNAME;
      let encryptKey = BufUtil.getStringWithoutEndOfString(recvCmd.data, sInx, CmdConst.BUF_LEN_ENCRYPT);
      sInx += CmdConst.BUF_LEN_ENCRYPT;
      sInx += getMultiple4DiffSize(CmdConst.BUF_LEN_USERID + CmdConst.BUF_LEN_USERNAME + CmdConst.BUF_LEN_ENCRYPT);

      let chatCmd = recvCmd.data.readInt32LE(sInx);
      sInx += CmdConst.BUF_LEN_INT;

      let chatKeySize = recvCmd.data.readInt32LE(sInx);
      sInx += CmdConst.BUF_LEN_INT;

      let chatDataSize = recvCmd.data.readInt32LE(sInx);
      sInx += CmdConst.BUF_LEN_INT;

      let destIdSize = recvCmd.data.readInt32LE(sInx);
      sInx += CmdConst.BUF_LEN_INT;

      let chatKey = BufUtil.getStringWithoutEndOfString(recvCmd.data, sInx, chatKeySize);
      sInx += chatKeySize;

      let chatData = BufUtil.getStringWithoutEndOfString(recvCmd.data, sInx, chatDataSize);
      chatData = EncUtil.decryptMessage(encryptKey, chatData);
      sInx += chatDataSize;

      let destId = BufUtil.getStringWithoutEndOfString(recvCmd.data, sInx);
      sInx += destIdSize;

      winston.debug('roomKey:' + roomKey
            + ', roomType:' + roomType
            + ', lineKey:' + lineKey
            + ', lineNumber:' + lineNumber
            + ', unreadCount:' + unreadCount
            + ', sendDate:' + sendDate
            + ', ip:' + ip
            + ', port:' + port
            + ', fontSize:' + fontSize
            + ', fontStyle:' + fontStyle
            + ', fontColor:' + fontColor
            + ', fontName:' + fontName
            + ', sendId:' + sendId
            + ', sendName:' + sendName
            + ', encryptKey:' + encryptKey
            + ', chatCmd:' + chatCmd
            + ', chatKeySize:' + chatKeySize
            + ', chatDataSize:' + chatDataSize
            + ', destIdSize:' + destIdSize
            + ', chatKey:' + chatKey
            + ', chatData:' + chatData
            + ', destId:' + destId)

      notifyManager.chatReceived({
        roomKey:roomKey,
        roomType:roomType,
        lineKey:lineKey,
        lineNumber:lineNumber,
        unreadCount:unreadCount,
        sendDate:sendDate,
        fontSize:fontSize,
        fontStyle:fontStyle,
        fontColor:fontColor,
        fontName:fontName,
        sendId:sendId,
        sendName:sendName,
        chatCmd:chatCmd,
        chatKey:chatKey,
        chatData:chatData,
        destId:destId
      })

      break;

    case CmdCodes.NS_CHATROOM_UNREAD_CNT :
    {
      let rcvBuf = Buffer.from(recvCmd.data);
      let roomKey = BufUtil.getStringWithoutEndOfString(rcvBuf, 0, CmdConst.BUF_LEN_CHAT_ROOM_KEY);
      let cntInx = BufUtil.getMultiple4Size(CmdConst.BUF_LEN_CHAT_ROOM_KEY);

      let unreadCnt = rcvBuf.readInt32LE(cntInx);

      notifyManager.chatRoomUnreadCount(roomKey, unreadCnt);
      break;
    }
    case CmdCodes.NS_CHATLINE_UNREAD_CNT :
    {
      let rcvBuf = Buffer.from(recvCmd.data);
      let roomKey = BufUtil.getStringWithoutEndOfString(rcvBuf, 0, CmdConst.BUF_LEN_CHAT_ROOM_KEY);
      let cntInx = BufUtil.getMultiple4Size(CmdConst.BUF_LEN_CHAT_ROOM_KEY);

      let cntSize = rcvBuf.readInt32LE(cntInx);
      let cntInfo = BufUtil.getStringWithoutEndOfString(rcvBuf, cntInx + 4);

      notifyManager.chatLineUnreadCount(roomKey, cntInfo);
      winston.info('NS_CHATLINE_UNREAD_CNT Receive : %s', dataStr);
    
      break;
    }
    case CmdCodes.NS_CHANGE_ALIAS :
      if (recvCmd.data) {
        let userId = BufUtil.getStringWithoutEndOfString(recvCmd.data, 0, CmdConst.BUF_LEN_USERID);        // 별칭 유저 아이디
        let alias = BufUtil.getStringWithoutEndOfString(recvCmd.data, getMultiple4Size(CmdConst.BUF_LEN_USERID));            // 별칭
        notifyManager.userAliasChanged({
          userId: userId,
          alias: alias
        })
      } else {
        let rcvBuf = Buffer.from(recvCmd.data);
        let dataStr = rcvBuf.toString(global.ENC, 0);
        callCallback(recvCmd.sendCmd, new ResData(false, 'NS_CHANGE_ALIAS Receive Fail! : ' + recvCmd.cmdCode));
      }
      break;
    default :
    {
      let rcvBuf = Buffer.from(recvCmd.data);
      let dataStr = rcvBuf.toString(global.ENC, 0);
      winston.info('Unknown Noti Command Receive!!! : %s   Data:%s', recvCmd.cmdCode, dataStr);
      return false;
    }
  }

  return true;
}

module.exports = {
  receiveCmdProc: receiveCmdProc
}