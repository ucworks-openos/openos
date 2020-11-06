
const { ipcMain } = require('electron');
const { reqIpPhone } = require('../net-command/command-ns-api');
const ResData = require('../ResData');
const util = require('util');
const logger = require('../../logger');


/** makeCall */
ipcMain.on('makeCall', (event, dest) => {

  let makeCallXmlFormat = "<?xml version='1.0' encoding='utf-8'?>" + 
  "<CallControlReq>" + 
  "  <trs id='1234' />" + 
  "  <user uid='%s' type='MessengerServer' />" + 
  "  <make destnum='%s' />" + 
  "</CallControlReq>" 
  
  let makeCallXml = util.format(makeCallXmlFormat, global.USER.userId, dest);

  logger.debug('makeCall-', makeCallXml)
  reqIpPhone(makeCallXml).then(function(resData)
  {
    logger.info('makeCall res:', resData)
    event.reply('res-makeCall', resData);
  }).catch(function(err) {
    event.reply('res-makeCall', new ResData(false, err));
  });
});


/** answerCall */
ipcMain.on('answerCall', (event, callid) => {

  let answerCallXmlFormat = "<?xml version='1.0' encoding='utf-8'?>" + 
  "<CallControlReq>" + 
  "  <trs id='1234' />" + 
  "  <user uid='%s' type='MessengerServer' />" + 
  "  <answer callid='%s' />" + 
  "</CallControlReq>" 
  
  let answerCallXml = util.format(answerCallXmlFormat, global.USER.userId, callid);

  logger.debug('answerCall-', answerCallXml)
  reqIpPhone(answerCallXml).then(function(resData)
  {
    logger.info('answerCall res:', resData)
    event.reply('res-answerCall', resData);
  }).catch(function(err) {
    event.reply('res-answerCall', new ResData(false, err));
  });
});


/** clearCall */
ipcMain.on('clearCall', (event, callid) => {

  let clearCallXmlFormat = "<?xml version='1.0' encoding='utf-8'?>" + 
  "<CallControlReq>" + 
  "  <trs id='1234' />" + 
  "  <user uid='%s' type='MessengerServer' />" + 
  "  <clear callid='%s' />" + 
  "</CallControlReq>" 
  
  let clearCallXml = util.format(clearCallXmlFormat, global.USER.userId, callid);

  logger.debug('clearCall-', clearCallXml)
  reqIpPhone(clearCallXml).then(function(resData)
  {
    logger.info('clearCall res:', resData)
    event.reply('res-clearCall', resData);
  }).catch(function(err) {
    event.reply('res-clearCall', new ResData(false, err));
  });
});


/** transferCall */
ipcMain.on('transferCall', (event, heldcallid, actcallid) => {

  let transferCallXmlFormat = "<?xml version='1.0' encoding='utf-8'?>" + 
  "<CallControlReq>" + 
  "  <trs id='1234' />" + 
  "  <user uid='%s' type='MessengerServer' />" + 
  "  <trf heldcallid='%s' actcallid='%s' />" + 
  "</CallControlReq>" 
  
  let transferCallXml = util.format(transferCallXmlFormat, global.USER.userId, heldcallid, actcallid);

  logger.debug('transferCall-', transferCallXml)
  reqIpPhone(transferCallXml).then(function(resData)
  {
    logger.info('transferCall res:', resData)
    event.reply('res-transferCall', resData);
  }).catch(function(err) {
    event.reply('res-transferCall', new ResData(false, err));
  });
});


/** pickupCall */
ipcMain.on('pickupCall', (event, pucallid) => {

  let pickupCallXmlFormat = "<?xml version='1.0' encoding='utf-8'?>" + 
  "<CallControlReq>" + 
  "  <trs id='1235' />" + 
  "  <user uid='%s' type='MessengerServer' />" + 
  "  <pu pucallid='%s' />" + 
  "</CallControlReq>" 
  
  let pickupCallXml = util.format(pickupCallXmlFormat, global.USER.userId, pucallid);

  logger.debug('pickupCall-', pickupCallXml)
  reqIpPhone(pickupCallXml).then(function(resData)
  {
    logger.info('pickupCall res:', resData)
    event.reply('res-pickupCall', resData);
  }).catch(function(err) {
    event.reply('res-pickupCall', new ResData(false, err));
  });
});


/** forwardCall */
ipcMain.on('forwardCall', (event, act, fwdnum) => {

  let forwardCallXmlFormat = "<?xml version='1.0' encoding='utf-8'?>" + 
  "<ServiceControlReq>" + 
  "  <trs id='1234' />" + 
  "  <user uid='%s' type='MessengerServer' />" + 
  "  <svc>" + 
  "    <fwd act='%s' type='all' fwdnum='%s' />" +
  "  </svc>" + 
  "</ServiceControlReq>";
  
  let forwardCallXml = util.format(forwardCallXmlFormat, global.USER.userId, act?'true':'false', fwdnum);

  logger.debug('forwardCall-', forwardCallXml)
  reqIpPhone(forwardCallXml).then(function(resData)
  {
    logger.info('forwardCall res:', resData)``
    event.reply('res-forwardCall', resData);
  }).catch(function(err) {
    event.reply('res-forwardCall', new ResData(false, err));
  });
});
