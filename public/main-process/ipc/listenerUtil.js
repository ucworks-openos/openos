
const { ipcMain, shell } = require('electron');
const path = require("path")
const logger = require('../../logger');


// shellOpenItem
ipcMain.on('shellOpenFolder', (event, arg, removeFileName) => {

  logger.debug('shellOpenFolder req:', arg)
  try {
    if (removeFileName) {
      arg = path.dirname(arg);
    }
    shell.showItemInFolder(arg);
  } catch (err) {
    logger.debug('shellOpenFolder Err:', arg, err)
  }
});

// shellOpenItem
ipcMain.on('shellOpenItem', (event, arg) => {
  logger.debug('shellOpenItem req:', arg)

  try {
    shell.openPath(arg);
  } catch (err) {
    logger.debug('shellOpenItem Err:', arg, err)
  }

});