function callCallback (sendCmd, resData) {
    // Callback
    if (sendCmd && sendCmd.callback) {
        //console.log('CallBack -- CMD:', command);  //JSON.stringify(command));
        sendCmd.callback(resData);
        console.log('callback success! cmd:', sendCmd);
    } else {
        console.log('callback fail! cmd:', sendCmd);
    }
}

module.exports = {
    callCallback: callCallback
}