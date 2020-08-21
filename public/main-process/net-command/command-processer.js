
const { writeMainProcLog, loginResponse } = require('../communication/sync-msg');
const { responseCmdProc } = require('./command-response-processer');

var CommandCodes = require('./command-code');
var CmdConst = require('./command-const');
var ResponseProcesser = require('./command-response-processer');

/**
 * 수신한 Command를 처리합니다. 
 * @param {CommandHeader} command 
 */
function receive_command(command) {
    writeMainProcLog('Command Processer -  CMD: ' + command.cmdCode);
    console.log('Command Processer -  CMD:', command)

    // 요청커맨드로 처리되는 방식과 받은 Command로 처리되는 방식으로 나눈다.
    if (command.sendCmd) {
      responseCmdProc(command)

    } else {
      //
      // 요청없이 받은 데이터
      //#region 
      switch( command.sendCmd.cmdCode ) {
      
        default :
          {
          const rcvBuf = Buffer.from(command.data);
          var dataStr = rcvBuf.toString('utf-8', 0);
            
          writeMainProcLog('Unknown Command Receive: ' + command.cmdCode); // + ' Data:' + dataStr);

          return false;
          }
          break;
      }
      //#endregion
    }
    
    // Callback
    if (command.sendCmd && command.sendCmd.callback) {
      //console.log('CallBack -- CMD:', command);  //JSON.stringify(command));
      command.sendCmd.callback(command)
    }

    return true;
}

module.exports = {
    receive_command: receive_command
}