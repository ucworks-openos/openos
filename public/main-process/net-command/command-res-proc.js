
const { writeMainProcLog, loginResponse } = require('../communication/sync-msg');
const { dsResProc } = require('./command-ds-res');
const { csResProc } = require('./command-cs-res');

var CommandCodes = require('./command-code');
var CmdConst = require('./command-const');

/**
 * 수신한 Command를 처리합니다. 
 * @param {CommandHeader} command 
 */
function receive_command(command) {
    writeMainProcLog('Command Processer -  CMD: ' + command.cmdCode);
    console.log('Command Processer -  CMD:', command)

    // 요청커맨드로 처리되는 방식과 받은 Command로 처리되는 방식으로 나눈다.
    if (command.sendCmd) {

      console.log('IS DS_BASE:' , parseInt(command.cmdCode/CommandCodes.DS_BASE))

      // 그룹코드가 규칙성이 없어 그룹코드를 별도로 비교한다.
      if (parseInt(command.cmdCode/CommandCodes.DS_BASE) == 1) {
        // DS COMMAND
        dsResProc(command);
        
      } else if (parseInt(command.cmdCode/CommandCodes.CS_BASE) == 1) {
        // CS COMMAND
        csResProc(command);
      } else {
        writeMainProcLog('Can not find Command Group! -  CMD: ' + command.cmdCode);
      }
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
    } else {
      
    }

    return true;
}

module.exports = {
    receive_command: receive_command
}