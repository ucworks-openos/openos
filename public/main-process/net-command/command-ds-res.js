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
    writeMainProcLog('Reqeust Command Empty! -  CMD: ' + command.cmdCode);
    return;
  }

  writeMainProcLog('DS Response -  RES_CMD: ' + command.cmdCode);

  // 요청커맨드로 처리되는 방식과 받은 Command로 처리되는 방식으로 나눈다.
  
  switch(command.sendCmd.cmdCode) {
    case CmdCodes.DS_GET_SERVER_INFO:

      if (command.cmdCode == CmdCodes.DS_SUCCESS) {
        var serverInfoXml = command.data.toString(global.ENC, 4);
        console.log('ServerInfo: ', serverInfoXml);

        var xml2js = require('xml2js');
        var parser = new xml2js.Parser();
        parser.parseString(serverInfoXml, function(err, result) {
            if (err) {
              writeMainProcLog.log('ServerInfo parse error!  Ex: ' + err);
              return;
            }

            global.SERVER_INFO.DS = result.server_info.DS[0].$;
            global.SERVER_INFO.CS = result.server_info.CS[0].$;
            global.SERVER_INFO.NS = result.server_info.NS[0].$;
            global.SERVER_INFO.PS = result.server_info.PS[0].$;
            global.SERVER_INFO.FS = result.server_info.FS[0].$;
            global.SERVER_INFO.SMS = result.server_info.SMS[0].$;

            global.USER.authMethod = result.server_info.UserAuth[0].$.method;
          });

        writeMainProcLog('ServerInfo: ' + JSON.stringify(global.SERVER_INFO));
        writeMainProcLog('authMethod: ' + global.USER.authMethod);
      } else {
        writeMainProcLog('DS_GET_SERVER_INFO  Response Fail! -  ', command.cmdCode);
      }

      break;

    case CmdCodes.DS_GET_RULES:
      if (command.cmdCode == CmdCodes.DS_SUCCESS) {
          const rcvBuf = Buffer.from(command.data);
  
          var userId = rcvBuf.toString(global.ENC, 0, CmdConst.BUF_LEN_USERID);
          let userPwd = rcvBuf.toString(global.ENC, CmdConst.BUF_LEN_USERID, CmdConst.BUF_LEN_USERPWD);
          let connIp = rcvBuf.toString(global.ENC, CmdConst.BUF_LEN_USERID + CmdConst.BUF_LEN_USERPWD, CmdConst.BUF_LEN_USERID + CmdConst.BUF_LEN_USERPWD + CmdConst.BUF_LEN_IP);
          let svrSize = rcvBuf.readInt32LE(CmdConst.BUF_LEN_USERID + CmdConst.BUF_LEN_USERPWD + CmdConst.BUF_LEN_IP);
          let ruleSize = rcvBuf.readInt32LE(CmdConst.BUF_LEN_USERID + CmdConst.BUF_LEN_USERPWD + CmdConst.BUF_LEN_IP + CmdConst.BUF_LEN_INT);
  
          let ruleStartInx = CmdConst.BUF_LEN_USERID + CmdConst.BUF_LEN_USERPWD + CmdConst.BUF_LEN_IP + (CmdConst.BUF_LEN_INT*2);
          let ruleEndInx = ruleStartInx + ruleSize;
          let rule = rcvBuf.toString(global.ENC, ruleStartInx).trim();

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

          var xml2js = require('xml2js');
          var parser = new xml2js.Parser();
          parser.parseString(rule, function(err, result) {
            if (err) {
              writeMainProcLog('RULE parse error!  Ex: ' + err + ' \r\nResult:' + result + '\r\nrule:' + rule);
              return ;
            }

            try {
              if (result.server_rule_info.function) {
                result.server_rule_info.function.forEach(element => {

                  //console.log('RULE ELEMENT:', element);

                  switch(element.$.func_code) {
                    case 'FUNC_ENCRYPT_3': // Enc Algorithm
                      global.ENCRYPT.pwdAlgorithm = element.$.func_value1;
                      console.log('SET FUNC_ENCRYPT_3 :', element.$.func_value1)
                      break;

                    case 'FUNC_ENCRYPT_4': // Enc Key
                      global.ENCRYPT.pwdCryptKey = element.$.func_value1;
                      console.log('SET FUNC_ENCRYPT_4 :', element.$.func_value1)
                      break;
                  }
                });
              }
            } catch (exception) {
              console.log('RULE PARSE ERR!!', exception)
              //writeMainProcLog("RULE PARSE ERR!! " + JSON.stringify(exception) + ' \r\n rule:' + JSON.stringify(result));
            }

            console.log('RULE:', global.ENCRYPT.pwd_cryptKey)
          });

          writeMainProcLog('LOGIN SUCESS!!  \r\n'
            + 'userId:' + userId
            + ' userPwd:' + userPwd
            + ' connIp:' + connIp
            + ' svrSize:' + svrSize
            + ' ruleSize:' + ruleSize);
      } else {
        writeMainProcLog('DS_GET_RULES  Response Fail! -  ', command.cmdCode);
      }
      break;
  
    case CmdCodes.DS_UPGRADE_CHECK:
      if (command.cmdCode == CmdCodes.DS_UPGRADE_CHANGE) {
        if (command.data) {
          const rcvBuf = Buffer.from(command.data);
          var serverInfoXml = rcvBuf.toString('utf-8', 4);
          writeMainProcLog('ServerInfo: ' + serverInfoXml);

          var xml2js = require('xml2js');
          var parser = new xml2js.Parser();
          parser.parseString(serverInfoXml, function(err, result) {

              let check_version = result.server_upgrade_info.current[0].$.ver;

              // 버전이 동일하다면 로그인시 서버정보를 다시 받아오기 때문에 의미없고
              // 업그레이드시 대상 서버를 확인하기 위해 정보를 적용한다.
              if (global.SITE_CONFIG.client_version != check_version) {
                  writeMainProcLog("CLIENT UPDTE REQUIRED!! CHECK VERSION:" + check_version);
                    // login 가능
                    global.SERVER_INFO.DS = result.server_upgrade_info.DS[0].$;
                    global.SERVER_INFO.PS = result.server_upgrade_info.PS[0].$;
                    global.SERVER_INFO.FS = result.server_upgrade_info.FS[0].$;

                  //writeMainProcLog("Server Upgrade Info : " + JSON.stringify(global.SERVER_INFO));
                  
                  // TODO 
                  // goto update
              }
            });
        }
      } else {
        writeMainProcLog('DS_UPGRADE_CHECK  Response Fail! -  ', command.cmdCode);
      }
      break;

    case CmdCodes.DS_HANDSHAKE :
      console.log('DS_HANDSHAKE data :', command.data)
      if (command.data) {

        global.USER.userId = command.data.toString(global.ENC, 0, CmdConst.BUF_LEN_USERID).trim(),
        writeMainProcLog('DS_HANDSHAKE USERID :' + global.USER.userId); 
        global.CERT = {
          pukCertKey: command.data.toString(global.ENC, CmdConst.BUF_LEN_USERID, CmdConst.BUF_LEN_PUKCERTKEY).trim(),
          challenge: command.data.toString(global.ENC, CmdConst.BUF_LEN_USERID + CmdConst.BUF_LEN_PUKCERTKEY, CmdConst.BUF_LEN_CHALLENGE).trim(),
          session: command.data.toString(global.ENC, CmdConst.BUF_LEN_USERID + CmdConst.BUF_LEN_PUKCERTKEY + CmdConst.BUF_LEN_CHALLENGE, CmdConst.BUF_LEN_SESSION).trim()
        }

        //console.log('DS_HANDSHAKE :', handShakeRes)
        writeMainProcLog('DS_HANDSHAKE CERT :' + JSON.stringify(global.CERT)); 
      }
      break;

    case CmdCodes.DS_GET_BUDDY_DATA:
      switch(command.cmdCode){
        case CmdCodes.DS_GET_BUDDY_DATA_OK:
          // ?? 그냥 끝낸다.
          writeMainProcLog('DS_GET_BUDDY_DATA_OK!!');
          break;

        case CmdCodes.DS_GET_BUDDY_MEMORY:
        case CmdCodes.DS_GET_BUDDY_MEMORY_LZ:

          let rcvBuf = Buffer.from(command.data);
          let contactData = rcvBuf.toString(global.ENC, CmdConst.BUF_LEN_USERID);
          var xml2js = require('xml2js');
          var parser = new xml2js.Parser();
          parser.parseString(contactData, function(err, result) {
              if (err) {
                writeMainProcLog.log('Contact parse error!  Ex: ' + err);
                return;
              }

              console.log('Contact Data Parse Success!:', result);

            });
          
          writeMainProcLog('Contact Data Receive:' + contactData);
          break;
      }
    
      break;
    default :
      {
      let rcvBuf = Buffer.from(command.data);
      let dataStr = rcvBuf.toString(global.ENC, 0);
      
      writeMainProcLog('Unknown Response Command Receive: ' + command.cmdCode); // + ' Data:' + dataStr);
      }
      return false;
      break;
    }

    return true;
}

module.exports = {
  dsResProc: responseCmdProc
}