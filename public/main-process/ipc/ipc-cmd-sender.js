const {ipcMain} = require('electron')

function send(channel, ...args) {
  global.MAIN_WINDOW.webContents.send(channel, ...args);
}

function goto(page) {
  global.MAIN_WINDOW.webContents.send('goto', page);
}

module.exports = {
  send: send,
  goto: goto
};
