
const { ipcMain } = require('electron');
const fsAPI = require('../net-command/command-fs-api');


// download file
ipcMain.on('downloadFile', (event, serverIp, serverPort, serverFileName, saveFilePath) => {

  fsAPI.reqDownloadFile(serverIp, serverPort, serverFileName, saveFilePath).then(function(resData)
  {
    console.log('downloadFile res:', resData)
    event.reply('res-downloadFile', resData);
  }).catch(function(err) {
    event.reply('res-downloadFile', new ResData(false, err));
  });

});


// upload file
ipcMain.on('uploadFile', (event, fileKey, filePath) => {

  fsAPI.reqUploadFile(fileKey, filePath).then(function(resData)
  {
    console.log('uploadFile res:', resData)
    event.reply('res-uploadFile', resData);
  }).catch(function(err) {
    event.reply('res-uploadFile', new ResData(false, err));
  });

});