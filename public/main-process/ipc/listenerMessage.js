const { ipcMain } = require('electron');
const winston = require('../../winston')

const { send } = require('./ipc-cmd-sender');
const { createChatRoomKey } = require('../utils/utils-message');
const nsAPI = require('../net-command/command-ns-api');
const fetchAPI = require('../net-command/command-fetch-api');

const ResData = require('../ResData');
const { decryptMessage } = require('../utils/utils-crypto');


/**
 * sendMessage
 */
ipcMain.on('sendMessage', async (event, recvIds, recvNames, subject, message, attFileInfo) => {
  winston.info('[IPC] sendMessage ', {recvIds:recvIds, recvNames:recvNames, subject:subject, message:message, attFileInfo:attFileInfo})
  nsAPI.reqSendMessage(recvIds, recvNames, subject, message, attFileInfo).then(function (resData) {
    winston.info('[IPC] sendMessage res:', resData)
    event.reply('res-sendMessage', resData);
  }).catch(function (err) {
    winston.info('[IPC] sendMessage res  Err:', err)
    event.reply('res-sendMessage', new ResData(false, err));
  });

});

/**
 * getMessage
 */
ipcMain.on('getMessage', async (event, msgType, rowOffset = 0, rowLimit = 100) => {

  fetchAPI.reqMessageList(msgType, rowOffset, rowLimit).then(function (resData) {
    winston.info('[IPC] getMessage res:', resData)
    event.reply('res-getMessage', resData);
  }).catch(function (err) {
    winston.info('[IPC] getMessage res  Err:', err)
    event.reply('res-getMessage', new ResData(false, err));
  });
});

/**
 * getMessageDetail
 */
ipcMain.on('getMessageDetail', async (event, msgKey) => {

  fetchAPI.reqGetMessageDetail(msgKey).then(function (resData) {
    winston.info('[IPC] getMessageDetail res:', resData)
    event.reply('res-getMessageDetail', resData);
  }).catch(function (err) {
    winston.info('[IPC] getMessageDetail res  Err:', err)
    event.reply('res-getMessageDetail', new ResData(false, err));
  });
});

/**
 * deleteMessage
 */
ipcMain.on('deleteMessage', async (event, msgType, msgKeys) => {

  try {
    // data 삭제
    await fetchAPI.reqDeleteMessage(msgType, msgKeys);

    // 서버로 삭제 알림
    await nsAPI.reqDeleteMessage(msgType, msgKeys);

    winston.info('[IPC] deleteMessage res:', resData)
    event.reply('res-deleteMessage', resData);
  } catch (err) {
    winston.info('[IPC] deleteMessage res  Err:', err)
    event.reply('res-deleteMessage', new ResData(false, err));
  }
});

/**
 * getChatRoomList
 */
ipcMain.on('getChatRoomList', async (event, msgKey) => {

  fetchAPI.reqChatRoomList(msgKey).then(function (resData) {
    winston.info('[IPC] getChatRoomList res:', resData)
    event.reply('res-getChatRoomList', resData);
  }).catch(function (err) {
    winston.info('[IPC] getChatRoomList res  Err:', err)
    event.reply('res-getChatRoomList', new ResData(false, err));
  });
});

/**
 * getChatRoom
 */
ipcMain.on('getChatRoomByRoomKey', async (event, roomKey) => {

  fetchAPI.reqChatRoomByRoomKey(roomKey).then(function (resData) {
    winston.info('[IPC] getChatRoomByRoomKey res:', resData)
    event.reply('res-getChatRoomByRoomKey', resData);
  }).catch(function (err) {
    winston.info('[IPC] getChatRoomByRoomKey res  Err:', roomKey, err)
    event.reply('res-getChatRoomByRoomKey', new ResData(false, err));
  });
});

/**
 * sendChatMessage
 */
ipcMain.on('sendChatMessage', async (event, chatUserIds, chatMessage, chatFontName, roomKey = null, roomTitle = '', type) => {

  winston.info('[IPC] sendChatMessage :', roomKey, chatUserIds, chatMessage);

  // RoomKey가 없다면 만든다.
  if (!roomKey) {
    // 1:1이라면
    roomKey = createChatRoomKey(chatUserIds);
    winston.info('[IPC] createChatRoomKey :', roomKey);
  }

  nsAPI.reqChatLineKey(roomKey).then(function (resData) {
    winston.info('[IPC] getChatLineKey res:', resData)
    if (resData.resCode) {
      nsAPI.reqSendChatMessage(roomKey, resData.data.lineKey, chatUserIds, chatMessage, chatFontName, roomTitle, type).then(function (resData) {
        winston.info('[IPC] sendChatMessage res:', resData)
        event.reply('res-sendChatMessage', resData);

      }).catch(function (err) {
        winston.info('[IPC] sendChatMessage res  Err:', err)
        event.reply('res-sendChatMessage', new ResData(false, err));
      });
    } else {
      winston.info('[IPC] getChatLineKey res  Err:', resData)
      event.reply('res-getChatLineKey', resData);
    }


  }).catch(function (err) {
    winston.info('[IPC] getChatLineKey res  Err:', err)
    event.reply('res-getChatLineKey', new ResData(false, err));
  });
});

/**
 * getChatList
 */
ipcMain.on('getChatList', async (event, roomId, lastLineKey = '9999999999999999', rowLimit = 30) => {

  fetchAPI.reqGetChatList(roomId, lastLineKey = '9999999999999999', rowLimit = 100).then(function (resData) {
    winston.info('[IPC] getChatList res:', resData)
    event.reply('res-getChatList', resData);
  }).catch(function (err) {
    winston.info('[IPC] getChatList res  Err:', err)
    event.reply('res-getChatList', new ResData(false, err));
  });
});

/**
 * exit chatRoom
 */
ipcMain.on('exitChatRoom', async (event, roomId, chatUserIds) => {
  winston.debug('exitChatRoom', roomId)
  nsAPI.reqExitChatRoom(roomId, chatUserIds).then(function (resData) {
    winston.info('[IPC] exitChatRoom res:', resData)
    event.reply('res-exitChatRoom', resData);
  }).catch(function (err) {
    winston.info('[IPC] exitChatRoom res  Err:', err)
    event.reply('res-exitChatRoom', new ResData(false, err));
  });
});

/**
 * exit chatRoom
 */
ipcMain.on('changeChatRoomName', async (event, roomId, roomName, chatUserIds) => {
  winston.debug('changeChatRoomName', roomId)
  nsAPI.reqChangeChatRoomName(roomId, roomName, chatUserIds).then(function (resData) {
    winston.info('[IPC] changeChatRoomName res:', resData)
    event.reply('res-changeChatRoomName', resData);
  }).catch(function (err) {
    winston.info('[IPC] changeChatRoomName res  Err:', err)
    event.reply('res-changeChatRoomName', new ResData(false, err));
  });
});

/**
 * inviteChatUser
 */
ipcMain.on('inviteChatUser', async (event, roomKey, newRoomName, asIsUserIds, newUserIds) => {
  winston.debug('inviteChatUser', roomId)
  nsAPI.reqInviteChatUser(roomKey, newRoomName, asIsUserIds, newUserIds).then(function (resData) {
    winston.info('[IPC] inviteChatUser res:', resData)
    event.reply('res-inviteChatUser', resData);
  }).catch(function (err) {
    winston.info('[IPC] inviteChatUser res  Err:', err)
    event.reply('res-inviteChatUser', new ResData(false, err));
  });
});