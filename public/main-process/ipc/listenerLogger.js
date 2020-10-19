const { ipcMain } = require('electron');
const winston = require('../../winston')

/** writeLog */
ipcMain.on('writeLog', async (event, msg, ...args) => {
 winston.debugRanderer(msg, ...args)
});

/** writeDebug */
ipcMain.on('writeDebug', async (event, msg, ...args) => {
  winston.debugRanderer(msg, ...args)
 });

 /** writeInfo */
ipcMain.on('writeInfo', async (event, msg, ...args) => {
  winston.infoRanderer(msg, ...args)
 });

 
 /** writeWarn */
ipcMain.on('writeWarn', async (event, msg, ...args) => {
  winston.warnRanderer(msg, ...args)
 });

 /** writeError */
ipcMain.on('writeError', async (event, msg, ...args) => {
  winston.errorRanderer(msg, ...args)
 });
