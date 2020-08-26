const {ipcMain} = require('electron')

function send(channel, ipcCmdHeader) {
  global.MAIN_WINDOW.webContents.send(channel, msg);
}

function sendResponse(channel, ipcCmdHeader) {
  global.MAIN_WINDOW.webContents.send('res-' + channel, ipcCmdHeader);
}

function sendLog(msg) {
  console.log(msg)
  global.MAIN_WINDOW.webContents.send('net-log', msg);
};

// ipcMain.on('asynchronous-message', (event, arg) => {
//   console.log("synchronous-message", arg)
//   event.reply('asynchronous-reply', 'pong')
// });


module.exports = {
  sendLog: sendLog,
  sendResponse: sendResponse,
  send: send
};
