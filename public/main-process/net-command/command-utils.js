const logger = require('../../logger');

function callCallback (sendCmd, resData) {
    // Callback
    if (sendCmd && sendCmd.callback) {
        //logger.info('CallBack -- CMD:', command);  //JSON.stringify(command));
        sendCmd.callback(resData);
        logger.info('callback success! cmd:', sendCmd);
    } else {
        logger.warn('callback fail! cmd:', sendCmd);
    }
}

module.exports = {
    callCallback: callCallback
}