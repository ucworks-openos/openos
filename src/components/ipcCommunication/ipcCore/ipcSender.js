// require("electron")시 webPack과 standard module이 충돌
const electron = window.require("electron")

/**
 * Sync 방식으로 요청을 보냅니다.
 * 응답은 바로 리턴받을수 있습니다.
 * @param {String} chennel 
 * @param {String} actionCode 
 * @param {Object} data 
 */
export const sendSync = (chennel, actionCode, data='') => {
    let reqData = {
        actionCode: actionCode,
        data: data
      }
  
    return electron.ipcRenderer.sendSync(chennel, reqData);
}

/**
 * Async방식으로 요청으르 보냅니다.
 * 'res-[actionCode]'로 응답을 Listen 할수 있습니다.
 * @param {String} chennel 
 * @param {String} actionCode 
 * @param {Object} data 
 */
export const sendAsync = (chennel, actionCode, data='') => {
    
    let reqData = {
        actionCode: actionCode,
        data: data
      }
  
    electron.ipcRenderer.send(chennel, reqData);
}

/**
 * Invoke 방식의 Async를 요청합니다. 
 * @param {*} chennel 
 * @param {*} actionCode 
 * @param {*} data 
 */
export const sendAsyncInvoke = async (chennel, actionCode, data='') => {
    /*
      ex)
      
        // 호출을 하되 다음 처리가 대기하지 않으며 result가 반환된다.
        async () => {
            const result = await sendAsyncInvoke(chennel, actionCode, data)
        // ...
        }
    */
     
    let reqData = {
        actionCode: actionCode,
        data: data
      }
  
    return await electron.ipcRenderer.invoke(chennel, reqData)
}