const logger = require('../../logger')

const { callCallback } = require('./command-utils');
const { parseXmlToJSON } = require('../utils/utils-xmlParser')

const ResData = require('../ResData');

var CmdCodes = require('./command-code');
var CmdConst = require('./command-const');



/**
 * 수신한 Command를 처리합니다. 
 * @param {CommandHeader} resCmd 
 */
function responseCmdProc(resCmd, debugLog = false) {
  if (!resCmd.sendCmd) {
    logger.warn('PS Request Command Empty! -  CMD: ', resCmd);
    return;
  }

  
  if (debugLog) logger.debug('PS Response -  RES_CMD: ', resCmd);
  else logger.info('PS Response -  RES_CMD: ', resCmd.cmdCode);

  // 요청커맨드로 처리되는 방식과 받은 Command로 처리되는 방식으로 나눈다.
  
  switch(resCmd.sendCmd.cmdCode) {
    case CmdCodes.PS_GET_BASE_CLASS:
      if (resCmd.cmdCode == CmdCodes.PS_GET_BASE_CLASS) {

        let xmlData = resCmd.data.toString('utf-8', 0);
        if (debugLog) logger.debug('PS_GET_BASE_CLASS  xml:', xmlData);

        parseXmlToJSON(xmlData).then(function(jsonData) {
          callCallback(resCmd.sendCmd, new ResData(true, jsonData));
        }).catch(function(err) {
          logger.err('PS_GET_BASE_CLASS  xml parse Error! str:', xmlData, err)
          callCallback(resCmd.sendCmd, new ResData(false, 'PS_GET_BASE_CLASS xml parse Error! ex:' + JSON.stringify(err)));
        });

      } else {
        callCallback(resCmd.sendCmd, new ResData(false, 'PS_GET_BASE_CLASS  Response Fail!'));
      }
      break;

    case CmdCodes.PS_GET_CHILD_CLASS:
      if (resCmd.cmdCode == CmdCodes.PS_GET_CHILD_CLASS) {

        let xmlData = resCmd.data.toString('utf-8', 0);
        if (debugLog) logger.debug('PS_GET_CHILD_CLASS  xml:', xmlData);

        parseXmlToJSON(xmlData).then(function(jsonData) {
          callCallback(resCmd.sendCmd, new ResData(true, jsonData));
        }).catch(function(err) {
          logger.err('PS_GET_CHILD_CLASS  xml parse Error! str:', xmlData, err)
          callCallback(resCmd.sendCmd, new ResData(false, 'PS_GET_CHILD_CLASS  xml parse Error! ex:' + JSON.stringify(err)));
        });

      } else {
        callCallback(resCmd.sendCmd, new ResData(false, 'PS_GET_CHILD_CLASS  Response Fail!'));
      }
      break;

    case CmdCodes.PS_GET_CONDICTION:
      if (resCmd.cmdCode == CmdCodes.PS_GET_CONDICTION) {

        let xmlData = resCmd.data.toString('utf-8', 0);
        if (debugLog) logger.debug('PS_GET_CONDICTION  xml:', xmlData);

        parseXmlToJSON(xmlData).then(function(jsonData) {
          callCallback(resCmd.sendCmd, new ResData(true, jsonData));
          
        }).catch(function(err) {
          logger.err('PS_GET_CONDICTION  xml parse Error! ', err)
          callCallback(resCmd.sendCmd, new ResData(false, 'PS_GET_CONDICTION  xml parse Error! ex:' + JSON.stringify(err)));
        });
      } else {
        let rcvBuf = Buffer.from(resCmd.data);
        let dataStr = rcvBuf.toString('utf-8', 0);
        
        logger.warn('PS_GET_CONDICTION - Unknown Response Command Receive!!! : ' + resCmd.cmdCode + ' Data:' + dataStr);  
      }
      break;
    
    case CmdCodes.PS_GET_USERS_INFO:
      if (resCmd.cmdCode == CmdCodes.PS_GET_CONDICTION) { // ???  응답코드 무엇!!

        let xmlData = resCmd.data.toString('utf-8', 0);
        if (debugLog) logger.debug('PS_GET_USERS_INFO  xml:', xmlData);

        xmlData = "<items>" + xmlData + "</items>";
        parseXmlToJSON(xmlData).then(function(jsonData) {
          callCallback(resCmd.sendCmd, new ResData(true, jsonData));
        }).catch(function(err) {
          logger.err('PS_GET_USERS_INFO  xml parse Error! ', err)
          logger.err('PS_GET_USERS_INFO Err  recvLen:%s  Command:%s ', resCmd.data?.length, resCmd)
          callCallback(resCmd.sendCmd, new ResData(false, 'PS_GET_USERS_INFO  xml parse Error! ex:' + JSON.stringify(err)));
        });
      } else {
        let rcvBuf = Buffer.from(resCmd.data);
        let dataStr = rcvBuf.toString('utf-8', 0);
        
        logger.warn('PS_GET_CONDICTION - Unknown Response Command Receive!!! : ' + resCmd.cmdCode + ' Data:' + dataStr);  
      }
      break;
    
    case CmdCodes.PS_GET_CLASS_USER: // 조직도 검색
      if (resCmd.cmdCode == CmdCodes.PS_GET_CLASS_USER) { 

        let xmlData = resCmd.data.toString('utf-8', 0); 
        if (debugLog) logger.debug('PS_GET_CLASS_USER  xml:', xmlData);

        parseXmlToJSON(xmlData).then(function(jsonData) {
          callCallback(resCmd.sendCmd, new ResData(true, jsonData));
        }).catch(function(err) {
          logger.err('PS_GET_CLASS_USER  xml parse Error! ', err)
          callCallback(resCmd.sendCmd, new ResData(false, 'PS_GET_CLASS_USER  xml parse Error! ex:' + JSON.stringify(err)));
        });
      } else {
        let rcvBuf = Buffer.from(resCmd.data);
        let dataStr = rcvBuf.toString('utf-8', 0);
        
        logger.warn('PS_GET_CLASS_USER - Unknown Response Command Receive!!! : ' + resCmd.cmdCode + ' Data:' + dataStr);  
      }
      break;
    
    default :
    {
      let rcvBuf = Buffer.from(resCmd.data);
      let dataStr = rcvBuf.toString('utf-8', 0);
      
      logger.warn('Unknown Response Command Receive!!! : ' + resCmd.cmdCode + ' Data:' + dataStr);
    }
    return false;
  }

  return true;
}

module.exports = {
  responseCmdProc: responseCmdProc
}