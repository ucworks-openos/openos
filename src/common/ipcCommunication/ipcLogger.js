const electron = window.require("electron");

// const arrayPrepareStackTrace = (err, stack) => { return stack }

// function getPreviousStackInfo() {
//   let priorPrepareStackTrace = Error.prepareStackTrace;
//     Error.prepareStackTrace = arrayPrepareStackTrace;
//     let stacks = (new Error()).stack;
//     Error.prepareStackTrace = priorPrepareStackTrace;
//     if (stacks) {
//       let traceInx = 2;
//       return `[${stacks[traceInx].getFileName()}:${stacks[traceInx].getLineNumber()} ${stacks[traceInx].getFunctionName()?stacks[traceInx].getFunctionName():' '}]`;
//     }
//     return '[ unknown ]> '
// };

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


