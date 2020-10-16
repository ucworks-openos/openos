const { ipcMain } = require('electron');
const winston = require('../../winston')

/** writeLog */
ipcMain.on('writeLog', async (event, msg, ...args) => {
 winston.debugRanderer(msg, ...args)
});

/** writeLog */
ipcMain.on('writeDebug', async (event, msg, ...args) => {
  winston.debugRanderer(msg, ...args)
 });

 /** writeLog */
ipcMain.on('writeInfo', async (event, msg, ...args) => {
  winston.infoRanderer(msg, ...args)
 });

 /** writeLog */
ipcMain.on('writeError', async (event, msg, ...args) => {
  winston.errorRanderer(msg, ...args)
 });
