const winston = require('../../winston');
const BufUtil = require('../utils/utils-buffer')

const ResData = require('../ResData');

var CmdCodes = require('./command-code');
var CmdConst = require('./command-const');

const { callCallback } = require('./command-utils');
const { parseXmlToJSON } = require('../utils/utils-xmlParser')

/**
 * 수신한 Command를 처리합니다. 
 * @param {CommandHeader} recvCmd 
 */
function responseCmdProc(recvCmd) {
  if (!recvCmd.sendCmd) {
    winston.warn('FETCH Request Command Empty! -  CMD: ' + recvCmd.cmdCode);
    return;
  }

  winston.info('FETCH Response -  RES_CMD: ' + recvCmd.cmdCode);
  winston.debug('RESCMD-', recvCmd)

  // 요청커맨드로 처리되는 방식과 받은 Command로 처리되는 방식으로 나눈다.
  
  switch(recvCmd.sendCmd.cmdCode) {
    case CmdCodes.FETCH_SQL_REQUEST:
      if (recvCmd.cmdCode == CmdCodes.FETCH_SELECT_SUCCESS) {

        let sInx = 0;
        let userId = BufUtil.getStringWithoutEndOfString(recvCmd.data, sInx, CmdConst.BUF_LEN_USERID);
        sInx += CmdConst.BUF_LEN_USERID;

        let key = BufUtil.getStringWithoutEndOfString(recvCmd.data, sInx, CmdConst.BUF_LEN_SQL_KEY);
        sInx += CmdConst.BUF_LEN_SQL_KEY;

        let dbKind = recvCmd.data.readInt32LE(sInx);
        sInx += CmdConst.BUF_LEN_INT;

        let dml = recvCmd.data.readInt32LE(sInx);
        sInx += CmdConst.BUF_LEN_INT;

        let rowOrPage = recvCmd.data.readInt32LE(sInx);
        sInx += CmdConst.BUF_LEN_INT;

        let rowCount = recvCmd.data.readInt32LE(sInx);
        sInx += CmdConst.BUF_LEN_INT;

        let resultSize = recvCmd.data.readInt32LE(sInx);
        sInx += CmdConst.BUF_LEN_INT;

        //let result = BufUtil.getStringWithoutEndOfString(recvCmd.data, sInx, resultSize); // 남은 데이터와 사이즈가 맞지 않는 경우 있음
        let result = BufUtil.getStringWithoutEndOfString(recvCmd.data, sInx); // 그냥 남은거 다 받는다.
        sInx += resultSize;

        winston.debug('FETCH_SQL_REQUEST  xml ', result)
        parseXmlToJSON(result).then(function(jsonData) {
          callCallback(recvCmd.sendCmd, new ResData(true, jsonData));
        }).catch(function(err) {
          winston.error('FETCH_SQL_REQUEST  xml parse Error! str:', result, err)
          callCallback(recvCmd.sendCmd, new ResData(false, 'FETCH_SQL_REQUEST xml parse Error! ex:' + JSON.stringify(err)));
        });

      } else {
        callCallback(recvCmd.sendCmd, new ResData(false, 'FETCH_SQL_REQUEST  Response Fail!'));
      }
      break;

    default :
    {
      let rcvBuf = Buffer.from(recvCmd.data);
      let dataStr = rcvBuf.toString('utf-8', 0);
      
      winston.error('Unknown Response Command Receive!!! : ' + recvCmd.cmdCode + ' Data:' + dataStr);
    }
    return false;
  }

  return true;
}

module.exports = {
  fetchResProc: responseCmdProc
}