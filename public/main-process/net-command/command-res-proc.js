
const { sendLog } = require('../ipc/ipc-cmd-sender');
const { dsResProc } = require('./command-ds-res');
const { csResProc } = require('./command-cs-res');
const { psResProc } = require('./command-ps-res');
const { fetchResProc } = require('./command-fetch-res');

var CommandCodes = require('./command-code');
var CmdConst = require('./command-const');

/**
 * 수신한 Command를 처리합니다. 
 * @param {CommandHeader} command 
 */
function receive_command(command) {
  sendLog('Command Processer -  CMD: ' + command.cmdCode);
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
      } else if (parseInt(command.cmdCode/CommandCodes.PS_BASE) == 1) {
        // PS COMMAND
        psResProc(command);
      } else {
        sendLog('Can not find Command Group! -  CMD: ' + command.cmdCode);
      }
    } else {
      //
      // 요청없이 받은 데이터
      //#region 
      switch( command.cmdCode ) {
      
        default :
          {
          const rcvBuf = Buffer.from(command.data);
          var dataStr = rcvBuf.toString('utf-8', 0);
            
          sendLog('Unknown Command Receive: ' + command.cmdCode); // + ' Data:' + dataStr);

          return false;
          }
          break;
      }
      //#endregion
    }

    return true;
}

module.exports = {
    receive_command: receive_command
}