const electron = window.require("electron")

/** sendMessage */
export const sendMessage = async (recvIds, recvNames, subject, message) => {
  return new Promise(function(resolve, reject) {
      electron.ipcRenderer.on('res-sendMessage', (event, arg) => {
          resolve(arg);
        })
        electron.ipcRenderer.send('sendMessage', recvIds, recvNames, subject, message)
    });
}

/** sendMessage */
export const getMessage = async (msgType, rowOffset = 0, rowLimit = 100) => {
  return new Promise(function(resolve, reject) {
      electron.ipcRenderer.on('res-getMessage', (event, arg) => {
          resolve(arg);
        })
        electron.ipcRenderer.send('getMessage', msgType, rowOffset, rowLimit)
    });
}

