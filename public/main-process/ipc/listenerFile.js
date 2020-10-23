
const { ipcMain } = require('electron');
const fsAPI = require('../net-command/command-fs-api');
const winston = require('../../winston');
const ResData = require('../ResData');


// download file
ipcMain.on('downloadFile', (event, serverIp, serverPort, serverFileName, saveFilePath) => {

  fsAPI.reqDownloadFile(serverIp, serverPort, serverFileName, saveFilePath).then(function(resData)
  {
    winston.info('downloadFile res:', resData)
    event.reply('res-downloadFile', resData);
  }).catch(function(err) {
    event.reply('res-downloadFile', new ResData(false, err));
  });

});


// upload file
ipcMain.on('uploadFile', (event, fileKey, filePath) => {

  fsAPI.reqUploadFile(fileKey, filePath).then(function(resData)
  {
    winston.info('uploadFile res:', resData)
    event.reply('res-uploadFile', resData);
  }).catch(function(err) {
    event.reply('res-uploadFile', new ResData(false, err));
  });

});