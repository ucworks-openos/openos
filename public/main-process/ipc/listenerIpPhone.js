
const { ipcMain } = require('electron');
const { reqIpPhone } = require('../net-command/command-ns-api');
const ResData = require('../ResData');
const util = require('util')


// download file
ipcMain.on('makeCall', (event, dest) => {

  let makeCallXmlFormat = "<?xml version='1.0' encoding='utf-8'?>" + 
  "<CallControlReq>" + 
  "  <trs id='1234' />" + 
  "  <user uid='%s' type='MessengerServer' />" + 
  "  <make destnum='%s' />" + 
  "</CallControlReq>" 
  
  let makeCallXml = util.format(makeCallXmlFormat, global.USER.userId, dest);

  reqIpPhone(makeCallXml).then(function(resData)
  {
    winston.info('downloadFile res:', resData)
    event.reply('res-downloadFile', resData);
  }).catch(function(err) {
    event.reply('res-downloadFile', new ResData(false, err));
  });
});
