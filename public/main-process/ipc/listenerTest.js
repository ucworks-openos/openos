
const {ipcMain} = require('electron');

const {reqConnectDS, reqUpgradeCheckDS,} = require('../net-command/command-ds-api');
const {reqGetCondition} = require('../net-command/command-ps-api');
const { sendLog } = require('./ipc-cmd-sender');
const ResData = require('../ResData');
const CryptoUtil =  require('../utils/utils-crypto');
const OsUtil =  require('../utils/utils-os');

// testAction
ipcMain.on('testAction', async (event, ...args) => {
  var resData = new ResData(true, '');

  sendLog('DATE>>', OsUtil.getDateString('YYYYMMDDHHmmssSSS'));
  
  
  ////////////////////////////////////
  //reqGetCondition('bslee');
  

  //////////////////////////
  //return OsUtil.getUUID();

  ///////////////////////////
  

  // let pwd4 = CryptoUtil.randomPassword(4);
  // sendLog('Random Pwd 4', pwd4.length, pwd4);

  // let pwd32 = CryptoUtil.randomPassword(32);
  // sendLog('Random Pwd 32', pwd32.length, pwd32);

  /////////////////////////////
  // RC4
  /*
  let key = 'abcd1234'
  let txt = '김영대1234567890'

  let encTxt = CryptoUtil.encryptRC4(key, txt)
  sendLog('ENC: ' + encTxt);

  let decTxt = CryptoUtil.decryptRC4(key, encTxt);
  sendLog('DES: ' + decTxt);

  resolve(new ResData(true, decTxt));
  

  // AES256
  let key = '783-+ucware_)*!#1234567890123456'
  let txt = 'This is just an example 홍길동 12345'

  let encTxt = CryptoUtil.encryptAES256(key, txt)
  sendLog('ENC: ' + encTxt);

  let decTxt = CryptoUtil.decryptAES256(key, encTxt);
  sendLog('DES: ' + decTxt);

  resolve(new ResData(true, 'Call Success!'));
  */

  
    console.log('testFunction res:', resData)
    event.reply('res-testAction', resData);
});

// connectDS
ipcMain.on('connectDS', async (event, ...args) => {

  reqConnectDS().then(function(resData) {
    console.log('DS CONNECTIN SUCCESS! res:', resData)
    event.reply('res-connectDS', resData);
  }).catch(function(err) {
    console.log('DS CONNECTIN FAIL!', err)
    event.reply('res-connectDS', new ResData(false, err));
  });

});

// upgradeCheck
ipcMain.on('upgradeCheck', async (event, ...args) => {
  
  reqUpgradeCheckDS(function(resData)
  {
    console.log('upgradeCheck res:', resData)
    event.reply('res-upgradeCheck', resData);
  });

});

ipcMain.handle('invokeTest', async (event, ...args) => {
  
  return global.SITE_CONFIG;
})