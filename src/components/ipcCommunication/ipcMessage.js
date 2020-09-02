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