import { sendAsync, sendSync, sendAsyncInvoke } from './ipcCore/ipcSender';
const electron = window.require("electron")

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

/** Config를 불러옵니다. */
export const getConfig = () => {
  return electron.ipcRenderer.sendSync('getConfig', '');
}

/** Config를 저장합니다.. */
export const saveConfig = (configData) => {
  electron.ipcRenderer.send('saveConfig', configData);
}

