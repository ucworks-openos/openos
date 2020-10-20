const winston = require('../../winston');

const ResData = require('../ResData');

const CmdCodes = require('./command-code');
const CmdConst = require('./command-const');

const { callCallback } = require('./command-utils');


/**
 * 수신한 Command를 처리합니다. 
 * @param {CommandHeader} command 
 */
function responseCmdProc(command) {
  if (!command.sendCmd) {
    winston.warn('CS Request Command Empty! -  CMD: ' + command.cmdCode);
    return;
  }

  winston.info('CS Response -  RES_CMD: ' + command.cmdCode);

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
          winston.warn('CS_CERTIFY  Response Fail! -  ', command.cmdCode);
          callCallback(command.sendCmd, new ResData(false, 'CS_CERTIFY  Response Fail!'));
          break;
      }

      {
        let rcvBuf = Buffer.from(command.data);
        let dataStr = rcvBuf.toString('utf-8', 0);
        winston.debug('CS_CERTIFY Response -- ', dataStr);
      }

      break;
      default :
      {
        let rcvBuf = Buffer.from(command.data);
        let dataStr = rcvBuf.toString('utf-8', 0);
        
        winston.warn('Unknown Response Command Receive: ' + command.cmdCode); // + ' Data:' + dataStr);
      }
      return false;
    }

    return true;
}

module.exports = {
  responseCmdProc: responseCmdProc
}