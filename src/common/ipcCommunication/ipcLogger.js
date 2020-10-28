const electron = window.require("electron");
/**
 * write FileLog
 * @param {*} xml 
 */
export const writeLog = (msg, ...args) => {
  sendToIPC(`writeLog`, msg, ...args);
};

/**
 * write FileLog
 * @param {*} xml 
 */
export const writeDebug = (msg, ...args) => {
  sendToIPC(`writeDebug`, msg, ...args);
};

/**
 * write FileLog
 * @param {*} xml 
 */
export const writeInfo = (msg, ...args) => {
  sendToIPC(`writeInfo`, msg, ...args);
};

/**
 * write FileLog
 * @param {*} xml 
 */
export const writeWarn = (msg, ...args) => {
  sendToIPC(`writeWarn`, msg, ...args);
};
/**
 * write FileLog
 * @param {*} xml 
 */
export const writeError = (msg, ...args) => {
  
  sendToIPC(`writeError`, msg, ...args);
};

function sendToIPC(channel, msg, ...args) {
  console.log(msg, ...args)
  electron.ipcRenderer.send(channel, msg, ...args);
}


