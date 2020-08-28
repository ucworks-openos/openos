const electron = window.require("electron")


/** Config를 불러옵니다. */
export const getConfig = () => {
  return electron.ipcRenderer.sendSync('getConfig', '');
}

/** Config를 저장합니다.. */
export const saveConfig = (configData) => {
  electron.ipcRenderer.send('saveConfig', configData);
}

/** 로그인 요청을 합니다. */
export const login = (loginId, loginPwd) => {
  return new Promise(function(resolve, reject) {
    let reqData = {
      loginId: loginId,
      loginPwd: loginPwd
    }

    electron.ipcRenderer.on('res-login', (event, arg) => {
        resolve(arg);
      })

      electron.ipcRenderer.send('login', reqData)
  });
}

/** getFavorite */
export const getBuddyList = async () => {
  return new Promise(function(resolve, reject) {
      electron.ipcRenderer.on('res-getBuddyList', (event, arg) => {
          resolve(arg);
        })
        electron.ipcRenderer.send('getBuddyList', '')
    });
}

/** getFavorite */
export const getBaseOrg = async () => {
  return new Promise(function(resolve, reject) {
      electron.ipcRenderer.on('res-getBaseOrg', (event, arg) => {
          resolve(arg);
        })
        electron.ipcRenderer.send('getBaseOrg', '')
    });
}

/** getFavorite */
export const getChildOrg = async (orgGroupCode, groupCode, groupSeq) => {
  console.log('getChildOrg:', orgGroupCode, groupCode, groupSeq)

  return new Promise(function(resolve, reject) {
      electron.ipcRenderer.on('res-getChildOrg', (event, arg) => {
          resolve(arg);
        })
        electron.ipcRenderer.send('getChildOrg', orgGroupCode, groupCode, groupSeq)
    });
}

