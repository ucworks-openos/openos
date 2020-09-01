const {ipcMain} = require('electron');
const { reqConnectDS, reqLogin, reqUpgradeCheckDS, testFunction } = require('../net-command/command-ds-api');
const { sendLog } = require('./ipc-cmd-sender');
const ResData = require('../ResData');

/** getConfig */
ipcMain.on('getConfig', (event, ...args) => {
  return event.returnValue = global.SITE_CONFIG;
});

/** login */ 
ipcMain.on('login', async (event, loginData) => {
  
  reqLogin(loginData, true).then(function(resData) {
    console.log('login success! res:', resData)
    event.reply('res-login', resData);
  }).catch(function(err){
    console.log('login fail! res:', err)
    event.reply('res-login', new ResData(false, err));
  });
});




/**
 * 로그인 요청을 처리합니다.
 */
ipcMain.on('common', (event, cmd) => {

  if (cmd) {
    sendLog('IPC Command Empty! : ' + event);
    return;
  }

  console.log('COMMON IPC RECEIVE:', event, cmd);

  switch(cmd.actionCode) {
    case 'login':
      reqLogin(arg);
      break;

    case 'getConfig':
      //sendResponse('common', )
      event.reply('res-getConfig', global.SITE_CONFIG)
      break;
  }
})

/** sample */
// ipcMain.on('sample', (event, ...args) => {
//   return event.returnValue = global.SITE_CONFIG;
// });


