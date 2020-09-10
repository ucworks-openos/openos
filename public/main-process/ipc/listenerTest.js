
const { ipcMain, BrowserWindow } = require('electron');

const { reqConnectDS, reqUpgradeCheckDS, } = require('../net-command/command-ds-api');
const { reqGetCondition } = require('../net-command/command-ps-api');
const FetchAPI = require('../net-command/command-fetch-api');

const { sendLog } = require('./ipc-cmd-sender');
const ResData = require('../ResData');
const CryptoUtil = require('../utils/utils-crypto');
const OsUtil = require('../utils/utils-os');

const notifier = require('node-notifier');

const nsAPI = require('../net-command/command-ns-api');

// testAction
ipcMain.on('testAction', async (event, ...args) => {
  var resData = new ResData(true, '');


  FetchAPI.reqMessageHistory('MSG_RECV')

  return;

  let top = new BrowserWindow()
  top = new BrowserWindow({
    width: 800,
    height: 750,
    webPreferences: { nodeIntegration: true },
    //icon: require("path").join(__dirname, 'icon.ico'),
   });

   top.loadURL("http://localhost:3000/funcTest2");
  return;

  sendLog('DATE>>', OsUtil.getDateString('YYYYMMDDHHmmssSSS'));

  //nsAPI.reqGetStatus(1, 'bslee');
  //return;

  let options = {
    title: 'My awesome title',
    message: 'Hello from node, Mr. User!',
    sound: true, // Only Notification Center or Windows Toasters
    wait: true // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
  }


  new notifier.NotificationCenter().notify(options); // Win X
  // new notifier.NotifySend().notify(options); // Win X
  // new notifier.WindowsToaster(options).notify(options);  // WIN O
  // new notifier.WindowsBalloon(options).notify(options);   // WIN O
  new notifier.Growl(options).notify(options); // Win X


  return;
  notifier.notify(
    {
      title: 'My awesome title',
      message: 'Hello from node, Mr. User!',
      sound: true, // Only Notification Center or Windows Toasters
      wait: true // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
    },
    function (err, response) {
      // Response is response from notification
    }
  );








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

  reqConnectDS().then(function (resData) {
    console.log('DS CONNECTIN SUCCESS! res:', resData)
    event.reply('res-connectDS', resData);
  }).catch(function (err) {
    console.log('DS CONNECTIN FAIL!', err)
    event.reply('res-connectDS', new ResData(false, err));
  });

});

// upgradeCheck
ipcMain.on('upgradeCheck', async (event, ...args) => {

  reqUpgradeCheckDS(function (resData) {
    console.log('upgradeCheck res:', resData)
    event.reply('res-upgradeCheck', resData);
  });

});

ipcMain.handle('invokeTest', async (event, ...args) => {

  return global.SITE_CONFIG;
})