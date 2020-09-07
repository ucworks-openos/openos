const { sendLog } = require('../ipc/ipc-cmd-sender');
const { callCallback } = require('./command-utils');
const { parseXmlToJSON } = require('../utils/utils-xmlParser')

const ResData = require('../ResData');

var CmdCodes = require('./command-code');
var CmdConst = require('./command-const');



/**
 * 수신한 Command를 처리합니다. 
 * @param {CommandHeader} command 
 */
function responseCmdProc(command) {
  if (!command.sendCmd) {
    sendLog('PS Request Command Empty! -  CMD: ' + command.cmdCode);
    return;
  }

  sendLog('PS Response -  RES_CMD: ' + command.cmdCode);

  // 요청커맨드로 처리되는 방식과 받은 Command로 처리되는 방식으로 나눈다.
  
  switch(command.sendCmd.cmdCode) {
    case CmdCodes.PS_GET_BASE_CLASS:
      if (command.cmdCode == CmdCodes.PS_GET_BASE_CLASS) {

        let xmlData = command.data.toString('utf-8', 0);
        sendLog('PS_GET_BASE_CLASS  xml:', xmlData);

        parseXmlToJSON(xmlData).then(function(jsonData) {
          callCallback(command.sendCmd, new ResData(true, jsonData));
        }).catch(function(err) {
          console.log('PS_GET_BASE_CLASS  xml parse Error! str:', xmlData, err)
          callCallback(command.sendCmd, new ResData(false, 'PS_GET_BASE_CLASS xml parse Error! ex:' + JSON.stringify(err)));
        });

      } else {
        callCallback(command.sendCmd, new ResData(false, 'PS_GET_BASE_CLASS  Response Fail!'));
      }
      break;

    case CmdCodes.PS_GET_CHILD_CLASS:
      if (command.cmdCode == CmdCodes.PS_GET_CHILD_CLASS) {

        let xmlData = command.data.toString('utf-8', 0);
        sendLog('PS_GET_CHILD_CLASS  xml:', xmlData);

        parseXmlToJSON(xmlData).then(function(jsonData) {
          callCallback(command.sendCmd, new ResData(true, jsonData));
        }).catch(function(err) {
          console.log('PS_GET_CHILD_CLASS  xml parse Error! str:', xmlData, err)
          callCallback(command.sendCmd, new ResData(false, 'PS_GET_CHILD_CLASS  xml parse Error! ex:' + JSON.stringify(err)));
        });

      } else {
        callCallback(command.sendCmd, new ResData(false, 'PS_GET_CHILD_CLASS  Response Fail!'));
      }
      break;

    case CmdCodes.PS_GET_CONDICTION:
      if (command.cmdCode == CmdCodes.PS_GET_CONDICTION) {

        let xmlData = command.data.toString('utf-8', 0);
        sendLog('PS_GET_CONDICTION  xml:', xmlData);

        parseXmlToJSON(xmlData).then(function(jsonData) {
          global.USER.userName = jsonData.root_node.node_item.user_name.value;
          global.ORG.orgGroupCode = jsonData.root_node.node_item.org_code.value;
          global.ORG.groupCode = jsonData.root_node.node_item.user_group_code.value;

          callCallback(command.sendCmd, new ResData(true, jsonData));
          
        }).catch(function(err) {
          console.log('PS_GET_CONDICTION  xml parse Error! ', err)
          callCallback(command.sendCmd, new ResData(false, 'PS_GET_CONDICTION  xml parse Error! ex:' + JSON.stringify(err)));
        });
      } else {
        let rcvBuf = Buffer.from(command.data);
        let dataStr = rcvBuf.toString('utf-8', 0);
        
        sendLog('PS_GET_CONDICTION - Unknown Response Command Receive!!! : ' + command.cmdCode + ' Data:' + dataStr);  
      }
      break;
    
    case CmdCodes.PS_GET_USERS_INFO:
      if (command.cmdCode == CmdCodes.PS_GET_CONDICTION) { // ???  응답코드 무엇!!

        let xmlData = command.data.toString('utf-8', 0);
        sendLog('PS_GET_USERS_INFO  xml:', xmlData);

        parseXmlToJSON(xmlData).then(function(jsonData) {
          callCallback(command.sendCmd, new ResData(true, jsonData));
          
        }).catch(function(err) {
          console.log('PS_GET_USERS_INFO  xml parse Error! ', err)
          callCallback(command.sendCmd, new ResData(false, 'PS_GET_USERS_INFO  xml parse Error! ex:' + JSON.stringify(err)));
        });
      } else {
        let rcvBuf = Buffer.from(command.data);
        let dataStr = rcvBuf.toString('utf-8', 0);
        
        sendLog('PS_GET_CONDICTION - Unknown Response Command Receive!!! : ' + command.cmdCode + ' Data:' + dataStr);  
      }
      break;
    default :
    {
      let rcvBuf = Buffer.from(command.data);
      let dataStr = rcvBuf.toString('utf-8', 0);
      
      sendLog('Unknown Response Command Receive!!! : ' + command.cmdCode + ' Data:' + dataStr);
    }
    return false;
  }

  return true;
}

module.exports = {
  psResProc: responseCmdProc
}