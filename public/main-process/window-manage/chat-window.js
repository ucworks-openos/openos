const {ipcMain} = require('electron')

ipcMain.on('show-chat', (event, arg) => {
  event.returnValue = 'pong'
})
