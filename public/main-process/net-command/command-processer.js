<<<<<<< HEAD
const { writeMainProcLog, loginResponse } = require('../communication/sync-msg');

var CommandCodes = require('./command-code');
var CmdConst = require('./command-const')
=======

const { writeMainProcLog } = require('../communication/sync-msg');
var CommandCodes = require('./command-code');
>>>>>>> e632b9d8df3b57e67c76f8c0851c41ad6432daa0

/**
 * 수신한 Command를 처리합니다. 
 * @param {CommandHeader} command 
 */
function receive_command(command) {
    writeMainProcLog('Command Processer -  CMD: ' + command.cmd);
    console.log(command);

    switch( command.cmd ) {
<<<<<<< HEAD
      case CommandCodes.DS_SUCCESS :
        {
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
        }

        loginResponse({isSucess:true, loginId:userId})
        break

      case CommandCodes.DS_UPGRADE_CHANGE :
        if (command.data) {
          const rcvBuf = Buffer.from(command.data);
          var serverInfoXml = rcvBuf.toString('utf-8', 4);
          writeMainProcLog('ServerInfo: ' + serverInfoXml);

          var xml2js = require('xml2js');
          var parser = new xml2js.Parser();
          parser.parseString(serverInfoXml, function(err, result) {

              //console.log(result);
              //console.log(JSON.stringify(result));

              let check_version = result.server_upgrade_info.current[0].$.ver;

              if (global.SITE_CONFIG.client_version == check_version) {
                    // login 가능

                    global.SERVER_INFO.DS = result.server_upgrade_info.DS[0].$;
                    global.SERVER_INFO.PS = result.server_upgrade_info.PS[0].$;
                    global.SERVER_INFO.FS = result.server_upgrade_info.FS[0].$;

                    //writeMainProcLog("Server INFO : " + JSON.stringify(global.SERVER_INFO));

              } else {
                  writeMainProcLog("CLIENT UPDTE REQUIRED!! CHECK VERSION:" + check_version);
                  // TODO 
                  // goto update
              }
            });
        }

      break;
    
      case CommandCodes.DS_UPGRADE_CHECK:
        break;

      case CommandCodes.DS_GET_SERVER_INFO:
        
        
        break;
    
      default :
        {
        const rcvBuf = Buffer.from(command.data);
        var dataStr = rcvBuf.toString('utf-8', 0);
          
        writeMainProcLog('Unknown Command Receive: ' + command.cmd + ' Data:' + dataStr);
        }
        break;
    }

    if (command.callback) {
      command.callback(command)
    }
=======

        case CommandCodes.DS_UPGRADE_CHANGE :
            if (command.data) {
                const rcvBuf = Buffer.from(command.data);
                var serverInfoXml = rcvBuf.toString('utf-8', 4);
                writeMainProcLog('ServerInfo: ' + serverInfoXml);

                var xml2js = require('xml2js');
                var parser = new xml2js.Parser();
                parser.parseString(serverInfoXml, function(err, result) {

                    //console.log(result);
                    //console.log(JSON.stringify(result));

                    let check_version = result.server_upgrade_info.current[0].$.ver;

                    if (global.SITE_CONFIG.client_version == check_version) {
                         // login 가능

                         global.SERVER_INFO.DS = result.server_upgrade_info.DS[0].$;
                         global.SERVER_INFO.PS = result.server_upgrade_info.PS[0].$;
                         global.SERVER_INFO.FS = result.server_upgrade_info.FS[0].$;

                         writeMainProcLog("Server INFO : " + JSON.stringify(global.SERVER_INFO));

                    } else {
                        writeMainProcLog("CLIENT UPDTE REQUIRED!! CHECK VERSION:" + check_version);
                        // TODO 
                        // goto update
                    }
                  });
            }

          break;
      
        case CommandCodes.DS_UPGRADE_CHECK:
          break;
      
        default :
            const rcvBuf = Buffer.from(command.data);
            var dataStr = rcvBuf.toString('utf-8', 0);
            writeMainProcLog('Unknown Command Receive: ' + command.cmd + ' Data:' + dataStr);
          break;
      }
>>>>>>> e632b9d8df3b57e67c76f8c0851c41ad6432daa0
}

module.exports = {
    receive_command: receive_command
<<<<<<< HEAD
}
=======
}
>>>>>>> e632b9d8df3b57e67c76f8c0851c41ad6432daa0
