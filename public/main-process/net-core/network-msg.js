<<<<<<< HEAD
const {ipcMain} = require('electron');
const { DS_CONNECT, req_DS_LOGIN, req_DS_UPGRADE_CHECK } = require('../net-command/command-api');
=======

const {ipcMain} = require('electron');
const { DS_CONNECT, req_DS_HANDSHAKE, req_DS_LOGIN, req_DS_UPGRADE_CHECK } = require('../net-command/command-api');
>>>>>>> e632b9d8df3b57e67c76f8c0851c41ad6432daa0

ipcMain.on('net-connect-req', (event, arg) => {
  DS_CONNECT()
})

ipcMain.on('net-login-req', (event, arg) => {
  req_DS_LOGIN(arg);
})

ipcMain.on('net-upgradeCheck-req', (event, arg) => {
  req_DS_UPGRADE_CHECK("arg");
})
<<<<<<< HEAD
=======

ipcMain.on('net-login-req', (event, arg) => {
  
})

>>>>>>> e632b9d8df3b57e67c76f8c0851c41ad6432daa0
