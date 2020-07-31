
const {ipcMain} = require('electron');
const { connectToServer } = require('./network-core');

ipcMain.on('net-connect-req', (event, arg) => {
    connectToServer(0)
  })