const { sendLog } = require('../ipc/ipc-cmd-sender');
const { callCallback } = require('./command-utils');
const ResData = require('../ResData');

var CmdCodes = require('./command-code');
var CmdConst = require('./command-const');



/**
 * 수신한 Command를 처리합니다. 
 * @param {CommandHeader} command 
 */
function responseCmdProc(command) {
  if (!command.sendCmd) {
    sendLog('CS Request Command Empty! -  CMD: ' + command.cmdCode);
    return;
  }

  sendLog('CS Response -  RES_CMD: ' + command.cmdCode);

  // 요청커맨드로 처리되는 방식과 받은 Command로 처리되는 방식으로 나눈다.
  
  switch(command.sendCmd.cmdCode) {
    case CmdCodes.CS_CERTIFY:

      // resCommand
      switch(command.cmdCode) {
        case CmdCodes.CS_SUCCESS:
          callCallback(command.sendCmd, new ResData(true));
          break;
        case CmdCodes.CS_WRONG_PASSWORD:
          callCallback(command.sendCmd, new ResData(false, 'CS_WRONG_PASSWORD'));
          break;
        case CmdCodes.CS_NO_USERID:
          callCallback(command.sendCmd, new ResData(false, 'CS_NO_USERID'));
          break;

        default:
          sendLog('CS_CERTIFY  Response Fail! -  ', command.cmdCode);
          callCallback(command.sendCmd, new ResData(false, 'CS_CERTIFY  Response Fail!'));
          break;
      }

      break;
      default :
      {
        let rcvBuf = Buffer.from(command.data);
        let dataStr = rcvBuf.toString('utf-8', 0);
        
        sendLog('Unknown Response Command Receive: ' + command.cmdCode); // + ' Data:' + dataStr);
      }
      return false;
    }

    return true;
}

module.exports = {
  csResProc: responseCmdProc
}