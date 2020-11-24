const logger = require('../../logger')
const ResData = require('../ResData');

var CmdCodes = require('./command-code');
var CmdConst = require('./command-const');

const { callCallback } = require('./command-utils');
const { parseXmlToJSON } = require('../utils/utils-xmlParser')
const { getMultiple4Size } = require('../utils/utils-buffer');
const { parseRuleInfo } = require('../configuration/rule-parser');


/**
 * 수신한 Command를 처리합니다. 
 * @param {CommandHeader} resCmd 
 */
async function responseCmdProc(resCmd, debugLog = false) {
  if (!resCmd.sendCmd) {
    logger.warn('Reqeust Command Empty! -  CMD: ' + resCmd.cmdCode);
    return;
  }

  logger.info('DS Response -  RES_CMD: ' + resCmd.cmdCode);

  // 요청커맨드로 처리되는 방식과 받은 Command로 처리되는 방식으로 나눈다.

  switch (resCmd.sendCmd.cmdCode) {
    case CmdCodes.DS_GET_SERVER_INFO:

      if (resCmd.cmdCode == CmdCodes.DS_SUCCESS) {
        var serverInfoXml = resCmd.data.toString(global.ENC, 4);
        logger.debug('ServerInfo: ', serverInfoXml);

        parseXmlToJSON(serverInfoXml).then(function (result) {


          global.SERVER_INFO.DS = result.server_info.DS;
          global.SERVER_INFO.CS = result.server_info.CS;

          if (result.server_info.NS) global.SERVER_INFO.NS = result.server_info.NS;
          if (result.server_info.PS) global.SERVER_INFO.PS = result.server_info.PS;
          if (result.server_info.FS) global.SERVER_INFO.FS = result.server_info.FS;
          if (result.server_info.SMS) global.SERVER_INFO.SMS = result.server_info.SMS;
          if (result.server_info.FETCH) global.SERVER_INFO.FETCH = result.server_info.FETCH;

          global.USER.authMethod = result.server_info.UserAuth.method;

          callCallback(resCmd.sendCmd, new ResData(true));
        }).catch(function (err) {
          logger.error('ServerInfo parse error!  Ex: ' + err);
          callCallback(resCmd.sendCmd, new ResData(false, JSON.stringify(err)));
        });

        logger.info('ServerInfo: ' + JSON.stringify(global.SERVER_INFO));
        logger.info('authMethod: ' + global.USER.authMethod);
      } else {
        callCallback(resCmd.sendCmd, new ResData(false));
        logger.warn('DS_GET_SERVER_INFO  Response Fail! -  ', resCmd.cmdCode);
      }

      break;

    case CmdCodes.DS_GET_RULES:
      switch (resCmd.cmdCode) {
        case CmdCodes.DS_SUCCESS:
          const rcvBuf = Buffer.from(resCmd.data);

          let sInx = 0;
          let userId = rcvBuf.toString(global.ENC, sInx, CmdConst.BUF_LEN_USERID);
          sInx += CmdConst.BUF_LEN_USERID;
          
          let userPwd = rcvBuf.toString(global.ENC, sInx, CmdConst.BUF_LEN_USERPWD);
          sInx += CmdConst.BUF_LEN_USERPWD;

          let connIp = rcvBuf.toString(global.ENC, sInx, sInx + CmdConst.BUF_LEN_IP);
          sInx += CmdConst.BUF_LEN_IP;

          // 문자열 다음에는 4의 배수로 스킵한다.
          sInx = getMultiple4Size(sInx);

          let svrSize = rcvBuf.readInt32LE(sInx);
          sInx += CmdConst.BUF_LEN_INT;

          let ruleSize = rcvBuf.readInt32LE(CmdConst.BUF_LEN_USERID + CmdConst.BUF_LEN_USERPWD + CmdConst.BUF_LEN_IP + CmdConst.BUF_LEN_INT);
          sInx += CmdConst.BUF_LEN_INT;

          let ruleXml = rcvBuf.toString(global.ENC, sInx).trim();
          let resData = await parseRuleInfo(ruleXml);

          logger.info('get rule :', resData);

          callCallback(resCmd.sendCmd, resData);
          break;

        case CmdCodes.DS_NO_USERID:
          logger.warn('GET_RULE RES: DS_NO_USERID');
          callCallback(resCmd.sendCmd, new ResData(false, 'DS_NO_USERID'));
          break;
      }
      break;

    case CmdCodes.DS_UPGRADE_CHECK:
      if (resCmd.cmdCode == CmdCodes.DS_UPGRADE_CHANGE) {
        if (resCmd.data) {
          const rcvBuf = Buffer.from(resCmd.data);
          var serverInfoXml = rcvBuf.toString('utf-8', 4);
          logger.debug('ServerInfo: ' + serverInfoXml);

          parseXmlToJSON(serverInfoXml).then(function (result) {

            let check_version = result.server_upgrade_info.current.ver;

            // 버전이 동일하다면 로그인시 서버정보를 다시 받아오기 때문에 의미없고
            // 업그레이드시 대상 서버를 확인하기 위해 정보를 적용한다.
            if (global.SITE_CONFIG.client_version != check_version) {
              logger.info("CLIENT UPDTE REQUIRED!! CHECK VERSION:" + check_version);
            }

            callCallback(resCmd.sendCmd, new ResData(true, "CLIENT UPDTE REQUIRED!! CHECK VERSION:" + check_version));
          }).catch(function (err) {
            logger.error("CLIENT UPDTE REQUIRED!! ERROR", err);
            callCallback(resCmd.sendCmd, new ResData(false, JSON.stringify(err)));
          });
        }
      } else {
        logger.warn('DS_UPGRADE_CHECK  Response Fail! -  ', resCmd.cmdCode);
        callCallback(resCmd.sendCmd, new ResData(false, 'DS_UPGRADE_CHECK  Response Fail! :' + resCmd.cmdCode))
      }
      break;

    case CmdCodes.DS_HANDSHAKE:
      if (debugLog) logger.debug('DS_HANDSHAKE data :', resCmd.data)
      if (resCmd.data) {

        global.USER.userId = resCmd.data.toString(global.ENC, 0, CmdConst.BUF_LEN_USERID).trim(),
          logger.info('DS_HANDSHAKE USERID :' + global.USER.userId);
        global.CERT = {
          pukCertKey: resCmd.data.toString(global.ENC, CmdConst.BUF_LEN_USERID, CmdConst.BUF_LEN_PUKCERTKEY).trim(),
          challenge: resCmd.data.toString(global.ENC, CmdConst.BUF_LEN_USERID + CmdConst.BUF_LEN_PUKCERTKEY, CmdConst.BUF_LEN_CHALLENGE).trim(),
          session: resCmd.data.toString(global.ENC, CmdConst.BUF_LEN_USERID + CmdConst.BUF_LEN_PUKCERTKEY + CmdConst.BUF_LEN_CHALLENGE, CmdConst.BUF_LEN_SESSION).trim()
        }

        callCallback(resCmd.sendCmd, new ResData(true));
      } else {
        callCallback(resCmd.sendCmd, new ResData(false, 'Response Data Empty!'));
      }
      break;

    case CmdCodes.DS_GET_BUDDY_DATA:
      switch (resCmd.cmdCode) {
        case CmdCodes.DS_GET_BUDDY_DATA_OK:
          // ?? 그냥 끝낸다.
          logger.info('DS_GET_BUDDY_DATA_OK!!');
          callCallback(resCmd.sendCmd, new ResData(false, 'res:DS_GET_BUDDY_DATA_OK'));
          break;

        case CmdCodes.DS_GET_BUDDY_MEMORY:
        case CmdCodes.DS_GET_BUDDY_MEMORY_LZ:

          let rcvBuf = Buffer.from(resCmd.data);
          let userName = rcvBuf.toString(global.ENC, 0, CmdConst.BUF_LEN_USERID);
          let buddyDataXml = rcvBuf.toString(global.ENC, CmdConst.BUF_LEN_USERID);

          logger.debug('buddyDataXml', buddyDataXml)
          global.TEMP.buddyXml = buddyDataXml;

          parseXmlToJSON(buddyDataXml).then(function (result) {
            callCallback(resCmd.sendCmd, new ResData(true, result));
          }).catch(function (err) {
            logger.error('Buddy parse error!  Ex: ', err, buddyDataXml);
            callCallback(resCmd.sendCmd, new ResData(false, 'Buddy parse error!  Ex: ' + JSON.stringify(err)));
          });

          break;

        default:
          logger.warn('Unknown Response Code!  Cmd: ', resCmd);
          callCallback(resCmd.sendCmd, new ResData(false, 'Unknown Response Code!  Cmd: ' + resCmd.cmdCode));
          break;
      }

      break;
    default:
      {
        let rcvBuf = Buffer.from(resCmd.data);
        let dataStr = rcvBuf.toString(global.ENC, 0);

        logger.warn('Unknown Send Command Response Receive! ReqCmd: ' + resCmd.sendCmd.cmdCode + ' ResCmd:' + resCmd.cmdCode); // + ' Data:' + dataStr);
      }
      return false;
      break;
  }

  return true;
}


module.exports = {
  responseCmdProc: responseCmdProc
}