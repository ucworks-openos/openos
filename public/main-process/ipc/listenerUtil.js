
const { ipcMain, shell } = require('electron');
const path = require("path")
const winston = require('../../winston');


// shellOpenItem
ipcMain.on('shellOpenFolder', (event, arg, removeFileName) => {

  winston.debug('shellOpenFolder req:', arg)
  try {
    if (removeFileName) {
      arg = path.dirname(arg);
    }
    shell.showItemInFolder(arg);
  } catch (err) {
    winston.debug('shellOpenFolder Err:', arg, err)
  }
});

// shellOpenItem
ipcMain.on('shellOpenItem', (event, arg) => {
  winston.debug('shellOpenItem req:', arg)

  try {
    shell.openPath(arg);
  } catch (err) {
    winston.debug('shellOpenItem Err:', arg, err)
  }

});