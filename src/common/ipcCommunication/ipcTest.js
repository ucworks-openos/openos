
const electron = window.require("electron")

/** DS 연결. */
export const connectDS = async () => {
    return new Promise(function(resolve, reject) {
        electron.ipcRenderer.once('res-connectDS', (event, arg) => {
            resolve(arg);
          })
          electron.ipcRenderer.send('connectDS', 'ping')
      });
}

/** upgradeCheck */
export const upgradeCheck = async () => {
    return new Promise(function(resolve, reject) {
        electron.ipcRenderer.once('res-upgradeCheck', (event, arg) => {
            resolve(arg);
          })
          electron.ipcRenderer.send('upgradeCheck', 'ping')
      });
}

/** Test Action */
export const testAction = (testArg) => {
    
    return new Promise(function(resolve, reject) {
        electron.ipcRenderer.once('res-testAction', (event, arg) => {
            console.log('testAction res', arg)
            resolve(arg);
        })

        console.log('testAction', testArg)
        electron.ipcRenderer.send('testAction', testArg)
      });
}

/**  */
export const testInvoke = async (callback) => {

    const result = await  electron.ipcRenderer.invoke('getConfig')
    console.log('res-getConfig', result)
    callback(result);

  // electron.ipcRenderer.once('res-getConfig', (event, data) => {
  //   console.log('res-getConfig', data)
  //   callback(data);
  // });

  // return sendAsync(chennelName, 'getConfig', '');
}