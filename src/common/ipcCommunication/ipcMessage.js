import { writeDebug } from "./ipcLogger";

const electron = window.require("electron")

/** sendMessage */
export const sendMessage = async (recvIds, recvNames, subject, message, attFileInfo = '') => {
  return new Promise(function(resolve, reject) {
      electron.ipcRenderer.once('res-sendMessage', (event, arg) => {
          resolve(arg);
        })
        electron.ipcRenderer.send('sendMessage', recvIds, recvNames, subject, message, attFileInfo)
    });
}

/** getMessage */
export const getMessage = async (msgType, rowOffset = 0, rowLimit = 100) => {
  return new Promise(function(resolve, reject) {
      electron.ipcRenderer.once('res-getMessage', (event, arg) => {
          resolve(arg);
        })
        electron.ipcRenderer.send('getMessage', msgType, rowOffset, rowLimit)
    });
}

/** getMessageDetail */
export const getMessageDetail = async (msgKey) => {
  return new Promise(function(resolve, reject) {
      electron.ipcRenderer.once('res-getMessageDetail', (event, arg) => {
          resolve(arg);
        })
        electron.ipcRenderer.send('getMessageDetail', msgKey)
    });
}

/** deleteMessage */
export const deleteMessage = async (msgBubun, msgKeys) => {
  return new Promise(function(resolve, reject) {
      electron.ipcRenderer.once('res-deleteMessage', (event, arg) => {
          resolve(arg);
        })
        electron.ipcRenderer.send('deleteMessage', msgBubun, msgKeys)
    });
}

/** getChatRoomList */
export const getChatRoomList = async (rowOffset = 0, rowLimit = 100) => {
  return new Promise(function(resolve, reject) {
      electron.ipcRenderer.once('res-getChatRoomList', (event, arg) => {
          resolve(arg);
        })
        electron.ipcRenderer.send('getChatRoomList', rowOffset, rowLimit)
    });
}

/** getChatRoomByRoomKey */
export const getChatRoomByRoomKey = async (roomId) => {
  return new Promise(function(resolve, reject) {
      electron.ipcRenderer.once('res-getChatRoomByRoomKey', (event, arg) => {
          resolve(arg);
        })
        electron.ipcRenderer.send('getChatRoomByRoomKey', roomId)
    });
}


/** sendChatMessage */
export const sendChatMessage = async (chatUserIds, chatMessage, chatFontName, roomKey = null, roomTitle, type) => {
  console.log(`chatMessage: `, chatMessage);
  console.log(`chat type: `, type)
  return new Promise(function(resolve, reject) {
      electron.ipcRenderer.once('res-sendChatMessage', (event, arg) => {
          resolve(arg);
        })
        electron.ipcRenderer.send('sendChatMessage', chatUserIds, chatMessage, chatFontName, roomKey, roomTitle, type)
    });
}

/** getChatList */
export const getChatList = async (roomId, lastLineKey, rowLimit) => {
  console.log(`lastLineKey: `, lastLineKey);
  return new Promise(function(resolve, reject) {
      electron.ipcRenderer.once('res-getChatList', (event, arg) => {
          resolve(arg);
        })
        electron.ipcRenderer.send('getChatList', roomId, lastLineKey, rowLimit)
    });
}

/** showChatNoti */
export const showChatNoti = (chatMsg) => {
      electron.ipcRenderer.send('showChatNoti', chatMsg)
}

/** exitChatRoom */
export const exitChatRoom = (roomId, chatUserIds) => {
  writeDebug('exitChatRoom', roomId, chatUserIds)
  electron.ipcRenderer.send('exitChatRoom', roomId, chatUserIds)
}

/** changeChatRoomName */
export const changeChatRoomName = (roomId, roomName, chatUserIds) => {
  writeDebug('changeChatRoomName', {roomId:roomId, roomName:roomName, chatUserIds:chatUserIds})
  electron.ipcRenderer.send('changeChatRoomName', roomId, roomName, chatUserIds)
}

/** inviteChatUser */
export const inviteChatUser = (roomKey, newRoomName, asIsUserIds, newUserIds) => {
  writeDebug('inviteChatUser', {roomKey:roomKey, newRoomName:newRoomName, asIsUserIds:asIsUserIds, newUserIds:newUserIds})
  electron.ipcRenderer.send('inviteChatUser', roomKey, newRoomName, asIsUserIds, newUserIds)
}