
const { ipcMain, BrowserWindow, dialog, screen, app } = require('electron');

const { reqConnectDS, reqUpgradeCheckDS, } = require('../net-command/command-ds-api');
const { reqGetCondition } = require('../net-command/command-ps-api');
const FetchAPI = require('../net-command/command-fetch-api');

const ResData = require('../ResData');
const CryptoUtil = require('../utils/utils-crypto');
const OsUtil = require('../utils/utils-os');

const notifier = require('node-notifier');

const nsAPI = require('../net-command/command-ns-api');
const commandConst = require('../net-command/command-const');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
const { DATE_FORMAT } = require('../common/common-const');
const CommandHeader = require('../net-command/command-header');
const {funcTest} = require('./funcTest');

const winston = require('../../winston')

// testAction
ipcMain.on('testAction', async (event, ...args) => {
  var resData = new ResData(true, '');
  winston.info('testAction', args);

  let t1 = new funcTest('1', '1-1');
  let t2 = new funcTest('2', '2-2');

  funcTest('3', '3-3');
  funcTest('4', '4-4');

  let tmp = 'aaaaaz';

  
  let fuc = function (Hello) {
    winston.info(Hello, tmp);
  };
  
  fuc('Hello')
  fuc('Hello')

  winston.info('fff--- %s', fuc)
  return;

  let cmd = new CommandHeader(7000, 40, null);
  cmd.setName('Hello');

  winston.info('--------------------------------', JSON.stringify(cmd));

  return;


  let testBuf = Buffer.from('안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요', 'utf8');

  let encKey = CryptoUtil.randomPassword(4);
  winston.info('BUF_ENC', testBuf)
  let encBuf = CryptoUtil.encryptBufferRC4(encKey, testBuf);
  winston.info('BUF_ENC ENCRYPTO', encBuf)
  let decBuf = CryptoUtil.decryptBufferRC4(encKey, encBuf);
  winston.info('BUF_ENC DECRYPTO', decBuf)
  winston.info('BUF_ENC', decBuf.toString('utf8'));




  return;

  /*
  const choice = dialog.showMessageBoxSync(global.MAIN_WINDOW, {
    type: 'question',
    buttons: ['Leave', 'Stay', 'IdontKnow'],
    title: 'Do you want to leave this site?',
    message: 'Changes you made may not be saved.',
    defaultId: 0,
    cancelId: 1
  })
  winston.info('question', choice)
  */

  await app.whenReady();
  let displays = screen.getAllDisplays()

  let x = 0;
  let y = 0;
  displays.forEach((disp) => {
    if (disp.bounds.x === 0 && disp.bounds.y === 0) {
      // main disp
      x += disp.bounds.width;
      y += disp.bounds.height;
    } else {
      // external disp
      if (disp.bounds.x > 0) {
        x += disp.bounds.width;
      }
      if (disp.bounds.y > 0) {
        y += disp.bounds.height;
      }
    }

    winston.info('disp', disp)
    winston.info('x y ++', x, y)
  })

  winston.info('x y', x, y)

  let win = new BrowserWindow({
    //title: '알림테스트',
    x: x - 500, y: y - 300,
    width: 500, height: 300,
    //backgroundColor: '#2e2029',
    modal: true,
    resizable: true,
    focusable: false, // 포커스를 가져가 버리는데..  
    fullscreenable: false,
    frame: false,     // 프레임 없어짐, 타이틀바 포함  titleBarStyle: hidden
    thickFrame: true, // 그림자와 창 애니메이션
    webPreferences: {
      nodeIntegration: true, // is default value after Electron v5
    }
  })
  win.webContents.openDevTools();

  let notifyFile = `file://${__dirname}/notify.html`;
  winston.info(`>>>>>>>>>>>  `, notifyFile);
  win.webContents.on('did-finish-load', () => {
    
    winston.info(`>>>>>>>>>>>   LOAD COMPLETED!`);
    win.webContents.executeJavaScript(`
        document.getElementById("title").innerHTML += 'HELLO'
        document.getElementById("msg").innerHTML += 'FIGHTING!'
    `);
  });
  win.loadURL(notifyFile)

  // setTimeout(()=> {
  //   winston.info('>>>>>  notify')
  // win.webContents.send('notify', "Hello w");
  // }, 1000);
  
  

  
  
  
  
  return;

  winston.info('DATE>>', OsUtil.getDateString(DATE_FORMAT.YYYYMMDDHHmmssSSS));

  //nsAPI.reqGetStatus(1, 'kitt1');
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
  //reqGetCondition('kitt1');


  //////////////////////////
  //return OsUtil.getUUID();

  ///////////////////////////


  // let pwd4 = CryptoUtil.randomPassword(4);
  // winston.info('Random Pwd 4', pwd4.length, pwd4);

  // let pwd32 = CryptoUtil.randomPassword(32);
  // winston.info('Random Pwd 32', pwd32.length, pwd32);

  /////////////////////////////
  // RC4
  /*
  let key = 'abcd1234'
  let txt = '김영대1234567890'

  let encTxt = CryptoUtil.encryptRC4(key, txt)
  winston.info('ENC: ' + encTxt);

  let decTxt = CryptoUtil.decryptRC4(key, encTxt);
  winston.info('DES: ' + decTxt);

  resolve(new ResData(true, decTxt));
  

  // AES256
  let key = '783-+ucware_)*!#1234567890123456'
  let txt = 'This is just an example 홍길동 12345'

  let encTxt = CryptoUtil.encryptAES256(key, txt)
  winston.info('ENC: ' + encTxt);

  let decTxt = CryptoUtil.decryptAES256(key, encTxt);
  winston.info('DES: ' + decTxt);

  resolve(new ResData(true, 'Call Success!'));
  */


  winston.info('testFunction res:', resData)
  event.reply('res-testAction', resData);
});

// connectDS
ipcMain.on('connectDS', async (event, ...args) => {

  reqConnectDS().then(function (resData) {
    winston.info('DS CONNECTIN SUCCESS! res:', resData)
    event.reply('res-connectDS', resData);
  }).catch(function (err) {
    winston.info('DS CONNECTIN FAIL!', err)
    event.reply('res-connectDS', new ResData(false, err));
  });

});

// upgradeCheck
ipcMain.on('upgradeCheck', async (event, ...args) => {

  reqUpgradeCheckDS(function (resData) {
    winston.info('upgradeCheck res:', resData)
    event.reply('res-upgradeCheck', resData);
  });

});

ipcMain.handle('invokeTest', async (event, ...args) => {

  return global.SITE_CONFIG;
})