
const { writeMainProcLog } = require('../communication/sync-msg');
var CommandCodes = require('./command-code');

/**
 * 수신한 Command를 처리합니다. 
 * @param {CommandHeader} command 
 */
function receive_command(command) {
    writeMainProcLog('Command Processer -  CMD: ' + command.cmd);
    console.log(command);

    if (command.callback) {
      rcvCommand.callback(command)
    }

    switch( command.cmd ) {

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

        case CommandCodes.DS_GET_SERVER_INFO:
          
         
          break;
      
        default :
            const rcvBuf = Buffer.from(command.data);
            var dataStr = rcvBuf.toString('utf-8', 0);
            writeMainProcLog('Unknown Command Receive: ' + command.cmd + ' Data:' + dataStr);
          break;
      }
}

module.exports = {
    receive_command: receive_command
}