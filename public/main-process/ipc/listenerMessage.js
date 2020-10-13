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
ipcMain.on('sendMessage', async (event, recvIds, recvNames, subject, message) => {

  nsAPI.reqSendMessage(recvIds, recvNames, subject, message).then(function (resData) {
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
ipcMain.on('deleteMessage', async (event, msgGubun, msgKeys) => {

  nsAPI.reqDeleteMessage(msgGubun, msgKeys).then(function (resData) {
    winston.info('[IPC] deleteMessage res:', resData)
    event.reply('res-deleteMessage', resData);
  }).catch(function (err) {
    winston.info('[IPC] deleteMessage res  Err:', err)
    event.reply('res-deleteMessage', new ResData(false, err));
  });
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
ipcMain.on('sendChatMessage', async (event, chatUserIds, chatMessage, roomKey = null) => {

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
      nsAPI.reqSendChatMessage(roomKey, resData.data.lineKey, chatUserIds, chatMessage).then(function (resData) {
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
 * decrypt message
 */
ipcMain.on('decryptMessage', async (event, encryptKey, cipherMessage) => {

  let decMessage = decryptMessage(encryptKey, cipherMessage);

  winston.info('[IPC] decryptMessage res:', decMessage)
  event.reply('res-decryptMessage', decMessage);

});