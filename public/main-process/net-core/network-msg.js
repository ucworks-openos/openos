<<<<<<< HEAD
const {ipcMain} = require('electron');
<<<<<<< HEAD:main-process/net-core/network-msg.js
const { reqConnectDS, reqLogin, reqUpgradeCheckDS, testFunction } = require('../net-command/command-ds-api');
=======
const { DS_CONNECT, req_DS_LOGIN, req_DS_UPGRADE_CHECK } = require('../net-command/command-api');
=======

const {ipcMain} = require('electron');
const { DS_CONNECT, req_DS_HANDSHAKE, req_DS_LOGIN, req_DS_UPGRADE_CHECK } = require('../net-command/command-api');
>>>>>>> e632b9d8df3b57e67c76f8c0851c41ad6432daa0
>>>>>>> upstream/master:public/main-process/net-core/network-msg.js

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
<<<<<<< HEAD
=======

ipcMain.on('net-login-req', (event, arg) => {
  
})

>>>>>>> e632b9d8df3b57e67c76f8c0851c41ad6432daa0
