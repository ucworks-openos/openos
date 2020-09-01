
const {ipcMain} = require('electron');
var IPC_Header = require('./ipc-cmd-header');

const { reqConnectDS, reqLogin, reqUpgradeCheckDS, testFunction } = require('../net-command/command-ds-api');
const { sendLog } = require('./ipc-cmd-sender');
const ResData = require('../ResData');

// connectDS
ipcMain.on('connectDS', async (event, ...args) => {

  reqConnectDS().then(function(resData) {
    console.log('DS CONNECTIN SUCCESS! res:', resData)
    event.reply('res-connectDS', resData);
  }).catch(function(err) {
    console.log('DS CONNECTIN FAIL!', err)
    event.reply('res-connectDS', new ResData(false, err));
  });

})

// upgradeCheck
ipcMain.on('upgradeCheck', async (event, ...args) => {
  
  reqUpgradeCheckDS(function(resData)
  {
    console.log('upgradeCheck res:', resData)
    event.reply('res-upgradeCheck', resData);
  });

})






ipcMain.handle('invokeTest', async (event, ...args) => {
  
  return global.SITE_CONFIG;
})