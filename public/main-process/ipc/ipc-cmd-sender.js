const {ipcMain} = require('electron')

function send(channel, ...args) {
  global.MAIN_WINDOW.webContents.send(channel, args);
}

module.exports = {
  send: send
};
