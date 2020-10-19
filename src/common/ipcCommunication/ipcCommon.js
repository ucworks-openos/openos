import { writeInfo } from "./ipcLogger";

const electron = window.require("electron");

/** 로그인 요청을 합니다. */
export const login = (loginId, loginPwd) => {
  return new Promise(function (resolve, reject) {
    let reqData = {
      loginId: loginId,
      loginPwd: loginPwd,
    };

    electron.ipcRenderer.once('res-login', (event, arg) => {
      console.log("LOGIN REQUEST res:", arg);
      resolve(arg);
    });

    console.log("LOGIN REQUEST ipc:", reqData);
    electron.ipcRenderer.send("login", reqData);
  });
};

/** 로그아웃 요청을 합니다. */
export const logout = () => {
  writeInfo('====  LOG OUT  ===')

  return new Promise(function (resolve, reject) {
    electron.ipcRenderer.once("res-logout", (event, arg) => {
      writeInfo('logout Response', arg);
      resolve(arg);
    });

    electron.ipcRenderer.send("logout", null);

    sessionStorage.clear();
    
  });
};

/** updateMyAlias */
export const updateMyAlias = async (myAlias) => {
  console.log("updateMyAlias:", myAlias);

  return new Promise(function (resolve, reject) {
    electron.ipcRenderer.once("res-updateMyAlias", (event, arg) => {
      resolve(arg);
    });
    electron.ipcRenderer.send("updateMyAlias", myAlias);
  });
};

/** changeStatus */
export const changeStatus = async (status, force = false) => {
  console.log("changeStatus:", status, force);

  return new Promise(function (resolve, reject) {
    electron.ipcRenderer.once("res-changeStatus", (event, arg) => {
      resolve(arg);
    });
    electron.ipcRenderer.send("changeStatus", status, force);
  });
};

/** setStatusMonitor */
export const setStatusMonitor = async (userIds) => {
  console.log("setStatusMonitor:", userIds);

  return new Promise(function (resolve, reject) {
    electron.ipcRenderer.once("res-setStatusMonitor", (event, arg) => {
      resolve(arg);
    });
    electron.ipcRenderer.send("setStatusMonitor", userIds);
  });
};

/** Config를 불러옵니다. */
export const getConfig = () => {
  return new Promise(function(resolve, reject) {
    electron.ipcRenderer.once('res-getConfig', (event, arg) => {
      resolve(arg);
    });

    electron.ipcRenderer.send("getConfig", "");
  });
};

/** Config를 저장합니다.. */
export const saveConfig = (configData) => {
  electron.ipcRenderer.send("saveConfig", configData);
};


/** decryptMessage */
export const decryptMessage = async (endKey, cipherMessage) => {
  return new Promise(function(resolve, reject) {
      electron.ipcRenderer.once('res-decryptMessage', (event, arg) => {
          resolve(arg);
      });

      electron.ipcRenderer.send('decryptMessage', endKey, cipherMessage)
    });
}