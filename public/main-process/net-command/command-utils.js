const winston = require('../../winston');

function callCallback (sendCmd, resData) {
    // Callback
    if (sendCmd && sendCmd.callback) {
        //winston.info('CallBack -- CMD:', command);  //JSON.stringify(command));
        sendCmd.callback(resData);
        winston.info('callback success! cmd:', sendCmd);
    } else {
        winston.warn('callback fail! cmd:', sendCmd);
    }
}

module.exports = {
    callCallback: callCallback
}