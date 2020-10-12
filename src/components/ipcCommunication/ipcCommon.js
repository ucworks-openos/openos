const electron = window.require("electron");

/** Config를 불러옵니다. */
export const getConfig = () => {
  return new Promise(function (resolve, reject) {
    electron.ipcRenderer.on("res-getConfig", (event, arg) => {
      resolve(arg);
    });

    electron.ipcRenderer.send("getConfig", "");
  });
};

/** Config를 저장합니다.. */
export const saveConfig = (configData) => {
  electron.ipcRenderer.send("saveConfig", configData);
};

/** 로그인 요청을 합니다. */
export const login = (loginId, loginPwd) => {
  return new Promise(function (resolve, reject) {
    let reqData = {
      loginId: loginId,
      loginPwd: loginPwd,
    };

    electron.ipcRenderer.on("res-login", (event, arg) => {
      console.log("LOGIN REQUEST res:", arg);
      resolve(arg);
    });

    console.log("LOGIN REQUEST ipc:", reqData);
    electron.ipcRenderer.send("login", reqData);
  });
};

/** 로그아웃 요청을 합니다. */
export const logout = () => {
  return new Promise(function (resolve, reject) {
    electron.ipcRenderer.on("res-logout", (event, arg) => {
      resolve(arg);
    });

    electron.ipcRenderer.send("logout", null);
  });
};

/** getFavorite */
export const getBuddyList = async () => {
  return new Promise(function (resolve, reject) {
    electron.ipcRenderer.on("res-getBuddyList", (event, arg) => {
      console.log("---getBuddyList----------", arg);
      resolve(arg);
    });
    electron.ipcRenderer.send("getBuddyList", "");
  });
};

/** getFavorite */
export const getBaseOrg = async () => {
  return new Promise(function (resolve, reject) {
    electron.ipcRenderer.on("res-getBaseOrg", (event, arg) => {
      resolve(arg);
    });
    electron.ipcRenderer.send("getBaseOrg", "");
  });
};

/** getFavorite */
export const getChildOrg = async (orgGroupCode, groupCode, groupSeq) => {
  console.log("getChildOrg:", orgGroupCode, groupCode, groupSeq);

  return new Promise(function (resolve, reject) {
    electron.ipcRenderer.on("res-getChildOrg", (event, arg) => {
      resolve(arg);
    });
    electron.ipcRenderer.send("getChildOrg", orgGroupCode, groupCode, groupSeq);
  });
};

/** getUserInfos */
export const getUserInfos = async (userIds) => {
  return new Promise(function (resolve, reject) {
    electron.ipcRenderer.on("res-getUserInfos", (event, arg) => {
      resolve(arg);
    });
    electron.ipcRenderer.send("getUserInfos", userIds);
  });
};

/** searchUsers */
export const searchUsers = async (searchMode, searchText) => {
  return new Promise(function (resolve, reject) {
    electron.ipcRenderer.on("res-searchUsers", (event, arg) => {
      resolve(arg);
    });
    electron.ipcRenderer.send("searchUsers", searchMode, searchText);
  });
};

/** searchOrgUsers */
export const searchOrgUsers = async (orgGroupCode, searchText) => {
  return new Promise(function (resolve, reject) {
    electron.ipcRenderer.on("res-searchOrgUsers", (event, arg) => {
      resolve(arg);
    });
    electron.ipcRenderer.send("searchOrgUsers", orgGroupCode, searchText);
  });
};

/** changeStatus */
export const changeStatus = async (status, force = false) => {
  console.log("changeStatus:", status, force);

  return new Promise(function (resolve, reject) {
    electron.ipcRenderer.on("res-changeStatus", (event, arg) => {
      resolve(arg);
    });
    electron.ipcRenderer.send("changeStatus", status, force);
  });
};

/** setStatusMonitor */
export const setStatusMonitor = async (userIds) => {
  console.log("setStatusMonitor:", userIds);

  return new Promise(function (resolve, reject) {
    electron.ipcRenderer.on("res-setStatusMonitor", (event, arg) => {
      resolve(arg);
    });
    electron.ipcRenderer.send("setStatusMonitor", userIds);
  });
};

export const saveBuddyData = async (xml) => {
  console.log("saveBuddyData: ", xml);
  return new Promise((resolve, reject) => {
    electron.ipcRenderer.on(`res-saveBuddyData`, (event, arg) => {
      resolve(arg);
    });
    electron.ipcRenderer.send(`saveBuddyData`, xml);
  });
};
