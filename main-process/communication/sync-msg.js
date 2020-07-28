
const {ipcMain} = require('electron')
const { writeConfig } = require('../configuration/SiteConfig')

ipcMain.on('asynchronous-message', (event, arg) => {

  console.log("synchronous-message", arg)
  event.reply('asynchronous-reply', 'pong')
  
})
