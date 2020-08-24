const { writeMainProcLog } = require('../communication/sync-msg');

var CmdCodes = require('./command-code');
var CmdConst = require('./command-const');
const { ListGroupItem } = require('react-bootstrap');

/**
 * 수신한 Command를 처리합니다. 
 * @param {CommandHeader} command 
 */
function responseCmdProc(command) {
  if (!command.sendCmd) {
    writeMainProcLog('CS Request Command Empty! -  CMD: ' + command.cmdCode);
    return;
  }

  writeMainProcLog('CS Response -  RES_CMD: ' + command.cmdCode);

  // 요청커맨드로 처리되는 방식과 받은 Command로 처리되는 방식으로 나눈다.
  
  switch(command.sendCmd.cmdCode) {
    case CmdCodes.CS_CERTIFY:

      // resCommand
      switch(command.cmdCode) {
        case CmdCodes.CS_SUCCESS:
          break;
        case CmdCodes.CS_WRONG_PASSWORD:
          break;
        case CmdCodes.CS_NO_USERID:
          break;

        default:
          writeMainProcLog('CS_CERTIFY  Response Fail! -  ', command.cmdCode);
          break;
      }

      break;
      default :
      {
        let rcvBuf = Buffer.from(command.data);
        let dataStr = rcvBuf.toString('utf-8', 0);
        
        writeMainProcLog('Unknown Response Command Receive: ' + command.cmdCode); // + ' Data:' + dataStr);
      }
      return false;
    }

    return true;
}

module.exports = {
  csResProc: responseCmdProc
}