
const {ipcMain} = require('electron');
const { DS_CONNECT, req_DS_LOGIN, req_DS_UPGRADE_CHECK } = require('../net-command/command-api');

ipcMain.on('net-connect-req', (event, arg) => {
  DS_CONNECT()
})

ipcMain.on('net-login-req', (event, arg) => {
  req_DS_LOGIN(arg);
})

ipcMain.on('net-upgradeCheck-req', (event, arg) => {
  req_DS_UPGRADE_CHECK("arg");
})

