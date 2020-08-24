
const {ipcMain} = require('electron');
const { reqConnectDS, reqLogin, reqUpgradeCheckDS, testFunction } = require('../net-command/command-ds-api');

ipcMain.on('net-connect-req', (event, arg) => {
  reqConnectDS()
})

ipcMain.on('net-login-req', (event, arg) => {
  reqLogin(arg);
})

ipcMain.on('net-upgradeCheck-req', (event, arg) => {
  reqUpgradeCheckDS("arg");
})

ipcMain.on('test-function', (event, arg) => {
  testFunction();
})

