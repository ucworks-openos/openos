<<<<<<< HEAD
const {ipcMain} = require('electron')
const { writeConfig } = require('../configuration/site-config')

function loginResponse(msg) {
  console.log('jidjidj')
  global.MAIN_WINDOW.webContents.send('res-login', msg);
}

=======

const {ipcMain} = require('electron')
const { writeConfig } = require('../configuration/site-config')

>>>>>>> e632b9d8df3b57e67c76f8c0851c41ad6432daa0
function writeMainProcLog(msg) {
  console.log(msg)
  global.MAIN_WINDOW.webContents.send('net-log', msg);
};

ipcMain.on('asynchronous-message', (event, arg) => {

  console.log("synchronous-message", arg)
  event.reply('asynchronous-reply', 'pong')
  
});


module.exports = {
<<<<<<< HEAD
  writeMainProcLog: writeMainProcLog,
  loginResponse: loginResponse
};
=======
	writeMainProcLog: writeMainProcLog,
};




>>>>>>> e632b9d8df3b57e67c76f8c0851c41ad6432daa0
