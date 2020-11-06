import { writeDebug } from "./ipcLogger";

const electron = window.require("electron")

/**
 * encryptRC4
 */
export const encryptRC4 = (key, str) => {
    writeDebug('encryptRC4 IPC', path);
    return electron.ipcRenderer.sendSync('sync-encryptRC4', key, str);
}

/**
 * decryptRC4
 */
export const decryptRC4 = (key, cipherStr) => {
    writeDebug('decryptRC4 IPC', path);
    return electron.ipcRenderer.sendSync('sync-decryptRC4', key, cipherStr);
}


/**
 * encryptAES256
 */
export const encryptRC4 = (key, str) => {
    writeDebug('encryptAES256 IPC', path);
    return electron.ipcRenderer.sendSync('sync-encryptAES256', key, str);
}


/**
 * decryptAES256
 */
export const decryptAES256 = (key, cipherStr) => {
    writeDebug('decryptAES256 IPC', path);
    return electron.ipcRenderer.sendSync('sync-decryptAES256', key, cipherStr);
}

