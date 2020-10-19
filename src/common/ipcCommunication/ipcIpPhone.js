const electron = window.require("electron")

/**
 * 
 * @param {String} dest 
 */
export const makeCall = async (dest) => {
    return new Promise(function(resolve, reject) {
        electron.ipcRenderer.once('res-makeCall', (event, arg) => {
            resolve(arg);
          })
          electron.ipcRenderer.send('makeCall', dest);
      });
}
