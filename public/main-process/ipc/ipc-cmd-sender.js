const {ipcMain} = require('electron');
const logger = require('../../logger');

function send(channel, ...args) {
  // Progress는 로그가 많아 제외한다.
  if (!channel.toLowerCase().indexOf('progress')<0)
    logger.debug('SendToRanderer', channel, ...args);

  global.MAIN_WINDOW.webContents.send(channel, ...args);
}

function goto(page) {
  global.MAIN_WINDOW.webContents.send('goto', page);
}

module.exports = {
  send: send,
  goto: goto
};
