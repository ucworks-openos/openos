const {ipcMain} = require('electron')
const { writeConfig } = require('../configuration/site-config')

function loginResponse(msg) {
  console.log('jidjidj')
  global.MAIN_WINDOW.webContents.send('res-login', msg);
}

function writeMainProcLog(msg) {
  console.log(msg)
  global.MAIN_WINDOW.webContents.send('net-log', msg);
};

ipcMain.on('asynchronous-message', (event, arg) => {

  console.log("synchronous-message", arg)
  event.reply('asynchronous-reply', 'pong')
  
});


module.exports = {
  writeMainProcLog: writeMainProcLog,
  loginResponse: loginResponse
};
