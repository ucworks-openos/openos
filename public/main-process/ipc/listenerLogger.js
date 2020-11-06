const { ipcMain } = require('electron');
const logger = require('../../logger')

/** writeLog */
ipcMain.on('writeLog', async (event, msg, ...args) => {
 logger.debugRanderer(msg, ...args)
});

/** writeDebug */
ipcMain.on('writeDebug', async (event, msg, ...args) => {
  logger.debugRanderer(msg, ...args)
 });

 /** writeInfo */
ipcMain.on('writeInfo', async (event, msg, ...args) => {
  logger.infoRanderer(msg, ...args)
 });

 
 /** writeWarn */
ipcMain.on('writeWarn', async (event, msg, ...args) => {
  logger.warnRanderer(msg, ...args)
 });

 /** writeError */
ipcMain.on('writeError', async (event, msg, ...args) => {
  logger.errorRanderer(msg, ...args)
 });
