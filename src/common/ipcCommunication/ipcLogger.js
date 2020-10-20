const electron = window.require("electron");

/**
 * write FileLog
 * @param {*} xml 
 */
export const writeLog = (msg, ...args) => {
  electron.ipcRenderer.send(`writeLog`, msg, ...args);
};

/**
 * write FileLog
 * @param {*} xml 
 */
export const writeDebug = (msg, ...args) => {
  electron.ipcRenderer.send(`writeDebug`, msg, ...args);
};

/**
 * write FileLog
 * @param {*} xml 
 */
export const writeInfo = (msg, ...args) => {
  electron.ipcRenderer.send(`writeInfo`, msg, ...args);
};

/**
 * write FileLog
 * @param {*} xml 
 */
export const writeWarn = (msg, ...args) => {
  electron.ipcRenderer.send(`writeWarn`, msg, ...args);
};
/**
 * write FileLog
 * @param {*} xml 
 */
export const writeError = (msg, ...args) => {
  electron.ipcRenderer.send(`writeError`, msg, ...args);
};


