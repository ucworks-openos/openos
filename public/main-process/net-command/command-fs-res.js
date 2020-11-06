const logger = require('../../logger')

const ResData = require('../ResData');

var CmdCodes = require('./command-code');
var CmdConst = require('./command-const');
const { callCallback } = require('./command-utils');
const { getStringWithoutEndOfString } = require('../utils/utils-buffer');


/**
 * 수신한 Command를 처리합니다. 
 * @param {CommandHeader} resCmd 
 */
function receiveCmdProc(resCmd) {
  if (!resCmd.sendCmd) {
    logger.warn('FS Request Command Empty! -  CMD: %s', resCmd);
    return;
  }

  logger.info('FS Command Proc -  RES_CMD: %s', resCmd.cmdCode);

  // 요청커맨드로 처리되는 방식과 받은 Command로 처리되는 방식으로 나눈다.
  
  switch(resCmd.sendCmd.cmdCode) {
    case CmdCodes.FS_LOGINREADY:
      // FS_LOGINREADY
      switch(resCmd.cmdCode) {
        case CmdCodes.FS_LOGINREADY:
          callCallback(resCmd.sendCmd, new ResData(true));
          break;
        default:
          logger.warn('FS_LOGINREADY  Response Fail! - %s ', resCmd.cmdCode);
          callCallback(resCmd.sendCmd, new ResData(false, 'FS_LOGINREADY  Response Fail!'));
          break;
      }
      break;

    //#region UPLOAD ...
    case CmdCodes.FS_UPLOADFILE:
    case CmdCodes.FS_BIGUPLOADFILE:
      // FS_UPLOADFILE or FS_BIGUPLOADFILE
      switch(resCmd.cmdCode) {
        case CmdCodes.FS_UPLOADREADY:
          callCallback(resCmd.sendCmd, new ResData(true));
          break;
        default:
          logger.warn('FS_UPLOADFILE  Response Fail! -  %s', resCmd.cmdCode);
          callCallback(resCmd.sendCmd, new ResData(false, 'FS_UPLOADFILE  Response Fail!'));
          break;
      }
      break;

    case CmdCodes.FS_UPLOADEND:
      // FS_UPLOADFILE or FS_BIGUPLOADFILE
      switch(resCmd.cmdCode) {
        case CmdCodes.FS_UPLOADEND:
          let gubun = resCmd.data.readInt32LE(0);
          let dataStr = getStringWithoutEndOfString(resCmd.data, 4)
          callCallback(resCmd.sendCmd, new ResData(true, dataStr));
          break;
        default:
          logger.warn('FS_UPLOADEND  Response Fail! -  %s', resCmd.cmdCode);
          callCallback(resCmd.sendCmd, new ResData(false, 'FS_UPLOADEND  Response Fail!'));
          break;
      }
      break;
    //#endregion UPLOAD ...


    //#region DOWNLOAD ...
    case CmdCodes.FS_DOWNLOADFILE:

      switch(resCmd.cmdCode) {
        case CmdCodes.FS_DOWNLOADREADY:
          
          let gubun = resCmd.data.readInt32LE(0);
          let sizeStr = getStringWithoutEndOfString(resCmd.data, 4);

          callCallback(resCmd.sendCmd, new ResData(true, Number(sizeStr)));
          break;
        default:
          logger.warn('FS_DOWNLOADFILE  Response Fail! -  %s', resCmd.cmdCode);
          callCallback(resCmd.sendCmd, new ResData(false, 'FS_DOWNLOADFILE  Response Fail!'));
          break;
      }
      break;

    case CmdCodes.FS_DOWNLOADSEND:

    
      break;

    //#endregion DOWNLOAD ...

    default :
    {
      let rcvBuf = Buffer.from(resCmd.data);
      let dataStr = rcvBuf.toString('utf-8', 0);
      
      logger.warn('Unknown Response Command Receive: %s', resCmd.cmdCode); // + ' Data:' + dataStr);
    }
      return false;
    }

    return true;
}

module.exports = {
  receiveCmdProc: receiveCmdProc
}