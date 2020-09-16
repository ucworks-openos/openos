const electron = window.require("electron")

/** sendMessage */
export const sendMessage = async (recvIds, recvNames, subject, message) => {
  return new Promise(function(resolve, reject) {
      electron.ipcRenderer.on('res-sendMessage', (event, arg) => {
          resolve(arg);
        })
        electron.ipcRenderer.send('sendMessage', recvIds, recvNames, subject, message)
    });
}

/** getMessage */
export const getMessage = async (msgType, rowOffset = 0, rowLimit = 100) => {
  return new Promise(function(resolve, reject) {
      electron.ipcRenderer.on('res-getMessage', (event, arg) => {
          resolve(arg);
        })
        electron.ipcRenderer.send('getMessage', msgType, rowOffset, rowLimit)
    });
}

/** getMessageDetail */
export const getMessageDetail = async (msgKey) => {
  return new Promise(function(resolve, reject) {
      electron.ipcRenderer.on('res-getMessageDetail', (event, arg) => {
          resolve(arg);
        })
        electron.ipcRenderer.send('getMessageDetail', msgKey)
    });
}


/** getChatRoomList */
export const getChatRoomList = async (rowOffset = 0, rowLimit = 100) => {
  return new Promise(function(resolve, reject) {
      electron.ipcRenderer.on('res-getChatRoomList', (event, arg) => {
          resolve(arg);
        })
        electron.ipcRenderer.send('getChatRoomList', rowOffset, rowLimit)
    });
}

/** getChatRoomList */
export const sendChatMessage = async (chatUserIds, chatMessage, roomKey = null) => {
  return new Promise(function(resolve, reject) {
      electron.ipcRenderer.on('res-sendChatMessage', (event, arg) => {
          resolve(arg);
        })
        electron.ipcRenderer.send('sendChatMessage', chatUserIds, chatMessage, roomKey)
    });
}