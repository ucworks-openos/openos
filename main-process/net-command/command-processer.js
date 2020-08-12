
const { writeMainProcLog } = require('../communication/sync-msg');
var CommandCodes = require('./command-code');

/**
 * 수신한 Command를 처리합니다. 
 * @param {CommandHeader} command 
 */
function receive_command(command) {
    writeMainProcLog('Command Processer -  CMD: ' + command.cmd);
    console.log(command);

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
                    writeMainProcLog("CLIENT CHECK VERSION:" + check_version);

                  });
            }

          break;
      
        case CommandCodes.DS_UPGRADE_CHECK:
          break;
      
        default :
            writeMainProcLog('Unknown Command Receive: ' + command.cmd);
          break;
      }
}

module.exports = {
    receive_command: receive_command
}