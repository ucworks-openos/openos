import { writeDebug } from "./ipcLogger";

const electron = window.require("electron")

/**
 * shellOpenFolder
 */
export const shellOpenFolder = (path, removeFileName = false) => {
    writeDebug('shellOpenFolder IPC', path);
    electron.ipcRenderer.send('shellOpenFolder', path, removeFileName);
}

/**
 * shellOpenItem
 */
export const shellOpenItem = (path) => {
    writeDebug('shellOpenItem IPC', path);
    electron.ipcRenderer.send('shellOpenItem', path);
}