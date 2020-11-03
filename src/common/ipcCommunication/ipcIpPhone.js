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

/**
 * answerCall
 * @param {String} callid 
 */
export const answerCall = async (callid) => {
    return new Promise(function(resolve, reject) {
        electron.ipcRenderer.once('res-answerCall', (event, arg) => {
            resolve(arg);
          })
          electron.ipcRenderer.send('answerCall', callid);
      });
}

/**
 * clearCall
 * @param {String} callid 
 */
export const clearCall = async (callid) => {
    return new Promise(function(resolve, reject) {
        electron.ipcRenderer.once('res-clearCall', (event, arg) => {
            resolve(arg);
          })
          electron.ipcRenderer.send('clearCall', callid);
      });
}

/**
 * transferCall
 */
export const transferCall = async (heldcallid, actcallid) => {
    return new Promise(function(resolve, reject) {
        electron.ipcRenderer.once('res-transferCall', (event, arg) => {
            resolve(arg);
          })
          electron.ipcRenderer.send('transferCall', heldcallid, actcallid);
      });
}

/**
 * pickupCall
 */
export const pickupCall = async (pucallid) => {
    return new Promise(function(resolve, reject) {
        electron.ipcRenderer.once('res-pickupCall', (event, arg) => {
            resolve(arg);
          })
          electron.ipcRenderer.send('pickupCall', pucallid);
      });
}

/**
 * forwardCall
 */
export const forwardCall = async (act, fwdnum) => {
    return new Promise(function(resolve, reject) {
        electron.ipcRenderer.once('res-forwardCall', (event, arg) => {
            resolve(arg);
          })
          electron.ipcRenderer.send('forwardCall', act, fwdnum);
      });
}