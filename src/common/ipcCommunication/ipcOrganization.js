import { writeDebug } from "./ipcLogger";

const electron = window.require("electron");


/** getFavorite */
export const getBuddyList = async () => {
  return new Promise(function (resolve, reject) {
    electron.ipcRenderer.once("res-getBuddyList", (event, arg) => {
      console.log("---getBuddyList----------", arg);
      resolve(arg);
    });
    electron.ipcRenderer.send("getBuddyList", "");
  });
};

/** getFavorite */
export const getBaseOrg = async () => {
  return new Promise(function (resolve, reject) {
    electron.ipcRenderer.once("res-getBaseOrg", (event, arg) => {
      resolve(arg);
    });
    electron.ipcRenderer.send("getBaseOrg", "");
  });
};

/** getFavorite */
export const getChildOrg = async (orgGroupCode, groupCode, groupSeq) => {
  console.log("getChildOrg:", orgGroupCode, groupCode, groupSeq);

  return new Promise(function (resolve, reject) {
    electron.ipcRenderer.once("res-getChildOrg", (event, arg) => {
      resolve(arg);
    });
    electron.ipcRenderer.send("getChildOrg", orgGroupCode, groupCode, groupSeq);
  });
};

/** getUserInfos */
export const getUserInfos = async (userIds) => {
  return new Promise(function (resolve, reject) {

    // ipc 요청이 많은경우 응답으로 잘못된 데이터가 넘어온다..
    // 요청에 대한 응답을 같이 요청하여 받도록 해야한다.  
    let resKey = userIds.join("|");
    electron.ipcRenderer.once("res-getUserInfos_" + resKey, (event, arg) => {
      resolve(arg);
    });
    
    electron.ipcRenderer.send("getUserInfos", userIds);
  });
};

/** searchUsers */
export const searchUsers = async (searchMode, searchText) => {
  return new Promise(function (resolve, reject) {
    electron.ipcRenderer.once("res-searchUsers", (event, arg) => {
      resolve(arg);
    });
    electron.ipcRenderer.send("searchUsers", searchMode, searchText);
  });
};

/** searchOrgUsers */
export const searchOrgUsers = async (orgGroupCode, searchText) => {
  return new Promise(function (resolve, reject) {
    electron.ipcRenderer.once("res-searchOrgUsers", (event, arg) => {
      resolve(arg);
    });
    electron.ipcRenderer.send("searchOrgUsers", orgGroupCode, searchText);
  });
};

/**
 * saveBuddyData
 * @param {*} xml 
 */
export const saveBuddyData = async (xml) => {
  console.log("saveBuddyData: ", xml);
  return new Promise((resolve, reject) => {
    electron.ipcRenderer.once(`res-saveBuddyData`, (event, arg) => {
      resolve(arg);
    });
    electron.ipcRenderer.send(`saveBuddyData`, xml);
  });
};
