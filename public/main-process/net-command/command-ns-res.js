
const { sendLog } = require('../ipc/ipc-cmd-sender');
const { callCallback } = require('./command-utils');
const { messageReceived, unreadCountReceived } = require('../notification/messageNoti');

const ResData = require('../ResData');
const CmdCodes = require('./command-code');
const CmdConst = require('./command-const');

/**
 * 수신한 Command를 처리합니다. 
 * @param {CommandHeader} recvCmd 
 */
function receiveCmdProc(recvCmd) {

  sendLog('NS receiveCmdProc -- ' + recvCmd.cmdCode);
  console.log('NS receiveCmdProc  -- ', recvCmd);
  console.log('NS receiveCmdProc DataLen -- ', recvCmd.data.length);

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
          sendLog('Response Command Receive Fail! : ' + recvCmd.cmdCode + ' Data:' + dataStr);
          callCallback(recvCmd.sendCmd, new ResData(false, 'Response Command Receive Fail! : ' + recvCmd.cmdCode));
          return false;
        }
      }
     
      break;
    default :
    {
      let rcvBuf = Buffer.from(recvCmd.data);
      let dataStr = rcvBuf.toString(global.ENC, 0);
      sendLog('Unknown Send Command Receive!!! : ' + recvCmd.cmdCode + ' Data:' + dataStr);
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

        let encryptKey = recvCmd.data.toString(global.ENC, sInx, CmdConst.BUF_LEN_ENCRYPT);
        sInx += CmdConst.BUF_LEN_ENCRYPT;

        let key = recvCmd.data.toString(global.ENC, sInx, CmdConst.BUF_LEN_KEY);               // 메세지 키 (전송시 키를 발생하여 수신시 해당 키로 데이터베이스에 저장한다.)
        sInx += CmdConst.BUF_LEN_KEY;

        let gubun = recvCmd.data.toString(global.ENC, sInx, CmdConst.BUF_LEN_GUBUN);             // 메시지 구분 >> 일반(COMMON), 수신확인(CONFIRM))
        sInx += CmdConst.BUF_LEN_GUBUN;

        let subject = recvCmd.data.toString(global.ENC, sInx, CmdConst.BUF_LEN_SUBJECT);           // 제목
        sInx += CmdConst.BUF_LEN_SUBJECT;

        let sendId = recvCmd.data.toString(global.ENC, sInx, CmdConst.BUF_LEN_USERID);            // 보낸사람 ID
        sInx += CmdConst.BUF_LEN_USERID;

        let sendName = recvCmd.data.toString(global.ENC, sInx, CmdConst.BUF_LEN_USERNAME);          // 보낸사람 이름
        sInx += CmdConst.BUF_LEN_USERNAME;

        let sendDate = recvCmd.data.toString(global.ENC, sInx, CmdConst.BUF_LEN_SEND_DATE);          // 보낸일자/시간
        sInx += CmdConst.BUF_LEN_SEND_DATE;

        let resDate = recvCmd.data.toString(global.ENC, sInx, CmdConst.BUF_LEN_RES_DATE);           // 예비용
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
          resData = recvCmd.data.toString(global.ENC, sInx, resSize);
          sInx += resSize;
        }

        let cipherContents = '';
        if (cipherContentSize > 0) {
          cipherContents = recvCmd.data.toString(global.ENC, sInx, cipherContentSize);
          sInx += cipherContentSize;
        }

        let fileData = '';
        if (fileSize > 0) {
          fileData = recvCmd.data.toString(global.ENC, sInx, fileSize);
          sInx += fileSize;
        }

        let destName = '';
        if (destNameSize > 0) {
          destName = recvCmd.data.toString(global.ENC, sInx, destNameSize);
          sInx += destNameSize;
        }

        let allDestId = '';
        if (allDestIdSize > 0) {
          allDestId = recvCmd.data.toString(global.ENC, sInx, allDestIdSize);
          sInx += allDestIdSize;
        }

        let destIds = '';
        if (destIdSize > 0) {
          destIds = recvCmd.data.toString(global.ENC, sInx, destIdSize);
          sInx += destIdSize;
        }

        messageReceived({
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
          cipherContents: cipherContents,
          fileData: fileData,
          destName: destName,
          allDestId: allDestId,
          destIds: destIds
        })

      } else {
        let rcvBuf = Buffer.from(recvCmd.data);
        let dataStr = rcvBuf.toString(global.ENC, 0);
        sendLog('Message Recive Fail!! Data:' + dataStr);
      }
     
      break;
    
    case CmdCodes.NS_UNREADALL_COUNT:
      if (recvCmd.data) {
        let sInx = 0;

        let userId = recvCmd.data.toString(global.ENC, sInx, CmdConst.BUF_LEN_USERID);
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


        unreadCountReceived({
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
        sendLog('Message Recive Fail!! Data:' + dataStr);
      }
      break;
     default :
    {
      let rcvBuf = Buffer.from(recvCmd.data);
      let dataStr = rcvBuf.toString(global.ENC, 0);
      sendLog('Unknown Noti Command Receive!!! : ' + recvCmd.cmdCode + ' Data:' + dataStr);
      return false;
    }
  }

  return true;
}

module.exports = {
  receiveCmdProc: receiveCmdProc
}