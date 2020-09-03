const { sendLog } = require('../ipc/ipc-cmd-sender');
const { callCallback } = require('./command-utils');
const { parseXmlToJSON } = require('../utils/utils-xmlParser')
const ResData = require('../ResData');

var CmdCodes = require('./command-code');
var CmdConst = require('./command-const');


/**
 * 수신한 Command를 처리합니다. 
 * @param {CommandHeader} resCmd 
 */
function responseCmdProc(resCmd) {
  if (!resCmd.sendCmd) {
    sendLog('Reqeust Command Empty! -  CMD: ' + resCmd.cmdCode);
    return;
  }

  sendLog('DS Response -  RES_CMD: ' + resCmd.cmdCode);

  // 요청커맨드로 처리되는 방식과 받은 Command로 처리되는 방식으로 나눈다.

  switch (resCmd.sendCmd.cmdCode) {
    case CmdCodes.DS_GET_SERVER_INFO:

      if (resCmd.cmdCode == CmdCodes.DS_SUCCESS) {
        var serverInfoXml = resCmd.data.toString(global.ENC, 4);
        console.log('ServerInfo: ', serverInfoXml);

        parseXmlToJSON(serverInfoXml).then(function (result) {


          global.SERVER_INFO.DS = result.server_info.DS;
          global.SERVER_INFO.CS = result.server_info.CS;

          if (result.server_info.NS) global.SERVER_INFO.NS = result.server_info.NS;
          if (result.server_info.PS) global.SERVER_INFO.PS = result.server_info.PS;
          if (result.server_info.FS) global.SERVER_INFO.FS = result.server_info.FS;
          if (result.server_info.SMS) global.SERVER_INFO.SMS = result.server_info.SMS;

          global.USER.authMethod = result.server_info.UserAuth.method;

          callCallback(resCmd.sendCmd, new ResData(true));
        }).catch(function (err) {
          sendLog.log('ServerInfo parse error!  Ex: ' + err);
          callCallback(resCmd.sendCmd, new ResData(false, JSON.stringify(err)));
        });

        sendLog('ServerInfo: ' + JSON.stringify(global.SERVER_INFO));
        sendLog('authMethod: ' + global.USER.authMethod);
      } else {
        callCallback(resCmd.sendCmd, new ResData(false));
        sendLog('DS_GET_SERVER_INFO  Response Fail! -  ', resCmd.cmdCode);
      }

      break;

    case CmdCodes.DS_GET_RULES:
      switch (resCmd.cmdCode) {
        case CmdCodes.DS_SUCCESS:
          const rcvBuf = Buffer.from(resCmd.data);

          var userId = rcvBuf.toString(global.ENC, 0, CmdConst.BUF_LEN_USERID);
          let userPwd = rcvBuf.toString(global.ENC, CmdConst.BUF_LEN_USERID, CmdConst.BUF_LEN_USERPWD);
          let connIp = rcvBuf.toString(global.ENC, CmdConst.BUF_LEN_USERID + CmdConst.BUF_LEN_USERPWD, CmdConst.BUF_LEN_USERID + CmdConst.BUF_LEN_USERPWD + CmdConst.BUF_LEN_IP);
          let svrSize = rcvBuf.readInt32LE(CmdConst.BUF_LEN_USERID + CmdConst.BUF_LEN_USERPWD + CmdConst.BUF_LEN_IP);
          let ruleSize = rcvBuf.readInt32LE(CmdConst.BUF_LEN_USERID + CmdConst.BUF_LEN_USERPWD + CmdConst.BUF_LEN_IP + CmdConst.BUF_LEN_INT);

          let ruleStartInx = CmdConst.BUF_LEN_USERID + CmdConst.BUF_LEN_USERPWD + CmdConst.BUF_LEN_IP + (CmdConst.BUF_LEN_INT * 2);
          let ruleEndInx = ruleStartInx + ruleSize;
          let ruleXml = rcvBuf.toString(global.ENC, ruleStartInx).trim();

          /*
          let rcvRuleBuf = Buffer.alloc(ruleSize);
          let rcvlastRuleBuf = Buffer.alloc(ruleSize);
          rcvBuf.copy(rcvRuleBuf, 0, ruleStartInx - 10, ruleEndInx);
          //rcvBuf.copy(rcvlastRuleBuf, 0, (ruleEndInx - 10), ruleEndInx);
          let sampleRuleBuf = Buffer.from('<server_rule_info>', global.ENC);
          //let samplelastRuleBuf = Buffer.from('</server_rule_info>', global.ENC);

          console.log('buf size:', rcvBuf.length);
          console.log('buf ruleStartInx:', ruleStartInx);
          console.log('buf ruleEndInx:', ruleEndInx);

          console.log('userId:', userId);
          console.log('userPwd:', userPwd);
          console.log('connIp:', connIp);
          console.log('svrSize:', svrSize );
          console.log('ruleSize:', ruleSize);

          console.log('-----------------------------------------------------');
          console.log('-----------------------------------------------------');
          console.log('-----------  RCVBUF:', rcvRuleBuf);
          //console.log('-----------  RCVLastBUF:', rcvlastRuleBuf);
          console.log('-----------  SMPBUF:', sampleRuleBuf);
          //console.log('-----------  SMPLastBUF:', samplelastRuleBuf);
          console.log('-----------------------------------------------------');
          console.log('-----------------------------------------------------');
          console.log('-----------------------------------------------------');
          */

          parseXmlToJSON(ruleXml).then(function (result) {
            try {
              if (result.server_rule_info.function) {
                result.server_rule_info.function.forEach(element => {
                  //console.log('RULE ELEMENT:', element);
                  switch (element.func_code) {
                    case 'FUNC_ENCRYPT_2': // Message/Chat Encrypt Algorithm
                      global.ENCRYPT.msgAlgorithm = element.func_value1;
                      console.log('SET FUNC_ENCRYPT_3 :', element.func_value1)
                      break;

                    case 'FUNC_ENCRYPT_3': // Password Encrypt Algorithm
                      global.ENCRYPT.pwdAlgorithm = element.func_value1;
                      console.log('SET FUNC_ENCRYPT_3 :', element.func_value1)
                      break;

                    case 'FUNC_ENCRYPT_4': // Password Encrypt Key
                      global.ENCRYPT.pwdCryptKey = element.func_value1;
                      console.log('SET FUNC_ENCRYPT_4 :', element.func_value1)
                      break;

                    case 'FUNC_ORG_1': // ROOT ORG CODE
                      global.ORG.org_1_root = element.func_value1;
                      console.log('SET FUNC_ORG_1 :', element.func_value1)
                      break;
                  }
                });

                console.log('RULE:', global.ENCRYPT)
                callCallback(resCmd.sendCmd, new ResData(true));
              }
            } catch (err) {
              callCallback(resCmd.sendCmd, new ResData(false, JSON.stringify(err)));
              console.log('RULE PARSE ERR!!', err)
            }
          }).catch(function (err) {
            sendLog('RULE parse error!  Ex: ' + err + ' \r\nResult:' + result + '\r\nrule:' + rule);
            callCallback(resCmd.sendCmd, new ResData(false, JSON.stringify(err)));
          });
          break;

        case CmdCodes.DS_NO_USERID:
          sendLog('GET_RULE RES: DS_NO_USERID');
          callCallback(resCmd.sendCmd, new ResData(false, 'DS_NO_USERID'));
          break;
      }
      break;

    case CmdCodes.DS_UPGRADE_CHECK:
      if (resCmd.cmdCode == CmdCodes.DS_UPGRADE_CHANGE) {
        if (resCmd.data) {
          const rcvBuf = Buffer.from(resCmd.data);
          var serverInfoXml = rcvBuf.toString('utf-8', 4);
          sendLog('ServerInfo: ' + serverInfoXml);

          parseXmlToJSON(serverInfoXml).then(function (result) {

            let check_version = result.server_upgrade_info.current.ver;

            // 버전이 동일하다면 로그인시 서버정보를 다시 받아오기 때문에 의미없고
            // 업그레이드시 대상 서버를 확인하기 위해 정보를 적용한다.
            if (global.SITE_CONFIG.client_version != check_version) {
              sendLog("CLIENT UPDTE REQUIRED!! CHECK VERSION:" + check_version);
            }

            callCallback(resCmd.sendCmd, new ResData(true, "CLIENT UPDTE REQUIRED!! CHECK VERSION:" + check_version));
          }).catch(function (err) {
            callCallback(resCmd.sendCmd, new ResData(false, JSON.stringify(err)));
          });
        }
      } else {
        sendLog('DS_UPGRADE_CHECK  Response Fail! -  ', resCmd.cmdCode);
        callCallback(resCmd.sendCmd, new ResData(false, 'DS_UPGRADE_CHECK  Response Fail! :' + resCmd.cmdCode))
      }
      break;

    case CmdCodes.DS_HANDSHAKE:
      console.log('DS_HANDSHAKE data :', resCmd.data)
      if (resCmd.data) {

        global.USER.userId = resCmd.data.toString(global.ENC, 0, CmdConst.BUF_LEN_USERID).trim(),
          sendLog('DS_HANDSHAKE USERID :' + global.USER.userId);
        global.CERT = {
          pukCertKey: resCmd.data.toString(global.ENC, CmdConst.BUF_LEN_USERID, CmdConst.BUF_LEN_PUKCERTKEY).trim(),
          challenge: resCmd.data.toString(global.ENC, CmdConst.BUF_LEN_USERID + CmdConst.BUF_LEN_PUKCERTKEY, CmdConst.BUF_LEN_CHALLENGE).trim(),
          session: resCmd.data.toString(global.ENC, CmdConst.BUF_LEN_USERID + CmdConst.BUF_LEN_PUKCERTKEY + CmdConst.BUF_LEN_CHALLENGE, CmdConst.BUF_LEN_SESSION).trim()
        }

        callCallback(resCmd.sendCmd, new ResData(true));
        //console.log('DS_HANDSHAKE :', handShakeRes)
        sendLog('DS_HANDSHAKE CERT :' + JSON.stringify(global.CERT));
      } else {
        callCallback(resCmd.sendCmd, new ResData(false, 'Response Data Empty!'));
      }
      break;

    case CmdCodes.DS_GET_BUDDY_DATA:
      switch (resCmd.cmdCode) {
        case CmdCodes.DS_GET_BUDDY_DATA_OK:
          // ?? 그냥 끝낸다.
          sendLog('DS_GET_BUDDY_DATA_OK!!');
          callCallback(resCmd.sendCmd, new ResData(false, 'res:DS_GET_BUDDY_DATA_OK'));
          break;

        case CmdCodes.DS_GET_BUDDY_MEMORY:
        case CmdCodes.DS_GET_BUDDY_MEMORY_LZ:

          let rcvBuf = Buffer.from(resCmd.data);
          let userName = rcvBuf.toString(global.ENC, 0, CmdConst.BUF_LEN_USERID);
          let contactDataXml = rcvBuf.toString(global.ENC, CmdConst.BUF_LEN_USERID);
          parseXmlToJSON(contactDataXml).then(function (result) {
            console.log('Contact Data Parse Success!:', result);
            sendLog('Contact Data Receive:' + result);
            callCallback(resCmd.sendCmd, new ResData(true, result));
          }).catch(function (err) {
            sendLog('Contact parse error!  Ex: ', err, contactDataXml);
            callCallback(resCmd.sendCmd, new ResData(false, 'Contact parse error!  Ex: ' + JSON.stringify(err)));
          });

          break;

        default:
          console.log('Unknown Response Code!  Cmd: ', resCmd);
          callCallback(resCmd.sendCmd, new ResData(false, 'Unknown Response Code!  Cmd: ' + resCmd.cmdCode));
          break;
      }

      break;
    default:
      {
        let rcvBuf = Buffer.from(resCmd.data);
        let dataStr = rcvBuf.toString(global.ENC, 0);

        sendLog('Unknown Send Command Response Receive! ReqCmd: ' + resCmd.sendCmd.cmdCode + ' ResCmd:' + resCmd.cmdCode); // + ' Data:' + dataStr);
      }
      return false;
      break;
  }

  return true;
}


module.exports = {
  dsResProc: responseCmdProc
}