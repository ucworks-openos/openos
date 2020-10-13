const electron = window.require("electron")

export const downloadFile = async (serverIp, serverPort, serverFileName, saveFilePath) => {
    return new Promise(function(resolve, reject) {
        electron.ipcRenderer.once('res-downloadFile', (event, arg) => {
            resolve(arg);
          })
          electron.ipcRenderer.send('downloadFile', serverIp, serverPort, serverFileName, saveFilePath);
      });
}

/**
 * upgradeCheck
 * 
 * 'upload-file-progress' chennel로 진행 이벤트가 발생한다.
 *  progress param:  uploadKey, uploadedLength, fileLength
 * 
 */
export const uploadFile = async (fileKey, filePath) => {
    return new Promise(function(resolve, reject) {
        electron.ipcRenderer.once('res-uploadFile', (event, arg) => {
            resolve(arg);
          })
          electron.ipcRenderer.send('uploadFile', fileKey, filePath);
      });
}