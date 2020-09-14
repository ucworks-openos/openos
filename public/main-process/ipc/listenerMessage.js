const { ipcMain } = require('electron');

const { sendLog } = require('./ipc-cmd-sender');
const nsAPI = require('../net-command/command-ns-api');
const fetchAPI = require('../net-command/command-fetch-api');
const ResData = require('../ResData');


// sendMessage
ipcMain.on('sendMessage', async (event, recvIds, recvNames, subject, message) => {
  
  nsAPI.reqSendMessage(recvIds, recvNames, subject, message).then(function(resData)
  {
    sendLog('[IPC] sendMessage res:', resData)
    event.reply('res-sendMessage', resData);
  }).catch(function(err) {
    sendLog.log('[IPC] sendMessage res  Err:', err)
    event.reply('res-sendMessage', new ResData(false, err));
  });

});


// getMessage
ipcMain.on('getMessage', async (event, msgType, rowOffset = 0, rowLimit = 100) => {
  
  fetchAPI.reqMessageList(msgType, rowOffset, rowLimit).then(function(resData)
  {
    sendLog('[IPC] getMessage res:', resData)
    event.reply('res-getMessage', resData);
  }).catch(function(err) {
    sendLog.log('[IPC] getMessage res  Err:', err)
    event.reply('res-getMessage', new ResData(false, err));
  });
});

// getMessage
ipcMain.on('getMessageDetail', async (event, msgKey) => {
  
  fetchAPI.reqGetMessageDetail(msgKey).then(function(resData)
  {
    sendLog('[IPC] getMessageDetail res:', resData)
    event.reply('res-getMessageDetail', resData);
  }).catch(function(err) {
    sendLog.log('[IPC] getMessageDetail res  Err:', err)
    event.reply('res-getMessageDetail', new ResData(false, err));
  });
});

// getChatRoomList
ipcMain.on('getChatRoomList', async (event, msgKey) => {
  
  fetchAPI.reqChatRoomList(msgKey).then(function(resData)
  {
    sendLog('[IPC] getChatRoomList res:', resData)
    event.reply('res-getChatRoomList', resData);
  }).catch(function(err) {
    sendLog.log('[IPC] getChatRoomList res  Err:', err)
    event.reply('res-getChatRoomList', new ResData(false, err));
  });
});


// getChatRoomList
ipcMain.on('getChatLineKey', async (event, msgKey) => {
  
  nsAPI.reqChatLineKey(msgKey).then(function(resData)
  {
    sendLog('[IPC] getChatLineKey res:', resData)
    event.reply('res-getChatLineKey', resData);
  }).catch(function(err) {
    sendLog.log('[IPC] getChatLineKey res  Err:', err)
    event.reply('res-getChatLineKey', new ResData(false, err));
  });
});




