const { writeMainProcLog, loginResponse } = require('../communication/sync-msg');

var CommandCodes = require('./command-code');
var CmdConst = require('./command-const')

/**
 * 수신한 Command를 처리합니다. 
 * @param {CommandHeader} command 
 */
function responseCmdProc(command) {
  if (!command.sendCmd) {
    writeMainProcLog('Reqeust Command Empty! -  CMD: ' + command);
  }

  // 요청커맨드로 처리되는 방식과 받은 Command로 처리되는 방식으로 나눈다.
  
  switch(command.sendCmd.cmdCode) {
    case CommandCodes.DS_GET_SERVER_INFO:

      if (command.cmdCode == CommandCodes.DS_SUCCESS) {
        var serverInfoXml = command.data.toString('utf-8', 4);
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
            global.CERT.enc = result.server_info.UserAuth[0].$.method;
          });

        writeMainProcLog('ServerInfo: ' + serverInfoXml);
      } else {
        writeMainProcLog('DS_GET_SERVER_INFO  Response Fail! -  ', command.cmdCode);
      }

      break;

    case CommandCodes.DS_GET_RULES:
      if (command.cmdCode == CommandCodes.DS_SUCCESS) {
          const rcvBuf = Buffer.from(command.data);
  
          var userId = rcvBuf.toString(global.ENC, 0, CmdConst.BUF_LEN_USERID);
          let userPwd = rcvBuf.toString(global.ENC, CmdConst.BUF_LEN_USERID, CmdConst.BUF_LEN_USERPWD);
          let connIp = rcvBuf.toString(global.ENC, CmdConst.BUF_LEN_USERID + CmdConst.BUF_LEN_USERPWD, CmdConst.BUF_LEN_IP);
          let svrSize = rcvBuf.readInt32LE(CmdConst.BUF_LEN_USERID + CmdConst.BUF_LEN_USERPWD + CmdConst.BUF_LEN_IP)
          let ruleSize = rcvBuf.readInt32LE(CmdConst.BUF_LEN_USERID + CmdConst.BUF_LEN_USERPWD + CmdConst.BUF_LEN_IP + CmdConst.BUF_LEN_INT)
  
          let rule = rcvBuf.toString(global.ENC, CmdConst.BUF_LEN_USERID + CmdConst.BUF_LEN_USERPWD + CmdConst.BUF_LEN_IP + (CmdConst.BUF_LEN_INT*2))
  
          writeMainProcLog('LOGIN SUCESS!!  \r\n'
          + 'userId:' + userId
          + ' userPwd:' + userPwd
          + ' connIp:' + connIp
          + ' svrSize:' + svrSize
          + ' ruleSize:' + ruleSize
          + ' \r\nrule:' + rule)
      } else {
        writeMainProcLog('DS_GET_RULES  Response Fail! -  ', command.cmdCode);
      }
      break;
  
    case CommandCodes.DS_UPGRADE_CHECK:
      if (command.cmdCode == CommandCodes.DS_UPGRADE_CHANGE) {
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

    case CommandCodes.DS_HANDSHAKE :
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
    
      default :
      {
      let rcvBuf = Buffer.from(command.data);
      let dataStr = rcvBuf.toString('utf-8', 0);
      
      writeMainProcLog('Unknown Response Command Receive: ' + command.cmdCode); // + ' Data:' + dataStr);
      }
      return false;
      break;
    }

    return true;
}

module.exports = {
  responseCmdProc: responseCmdProc
}