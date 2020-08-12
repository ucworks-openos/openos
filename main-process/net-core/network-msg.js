
const {ipcMain} = require('electron');
const { DS_CONNECT, req_DS_HANDSHAKE, req_DS_UPGRADE_CHECK } = require('../net-command/command-api');

ipcMain.on('net-connect-req', (event, arg) => {
  DS_CONNECT()
})

ipcMain.on('net-handshake-req', (event, arg) => {
  req_DS_HANDSHAKE(arg);
})

ipcMain.on('net-upgradeCheck-req', (event, arg) => {
  req_DS_UPGRADE_CHECK("arg");
})

ipcMain.on('net-login-req', (event, arg) => {
  
})

