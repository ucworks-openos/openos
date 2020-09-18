const { ipcMain } = require('electron');

const { sendLog } = require('./ipc-cmd-sender');
const {createChatRoomKey} = require('../utils/utils-message');
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
    sendLog('[IPC] sendMessage res  Err:', err)
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
    sendLog('[IPC] getMessage res  Err:', err)
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
    sendLog('[IPC] getMessageDetail res  Err:', err)
    event.reply('res-getMessageDetail', new ResData(false, err));
  });
});

// deleteMessage
ipcMain.on('deleteMessage', async (event, msgGubun, msgKeys) => {
  
  nsAPI.reqDeleteMessage(msgGubun, msgKeys).then(function(resData)
  {
    sendLog('[IPC] deleteMessage res:', resData)
    event.reply('res-deleteMessage', resData);
  }).catch(function(err) {
    sendLog('[IPC] deleteMessage res  Err:', err)
    event.reply('res-deleteMessage', new ResData(false, err));
  });
});

// getChatRoomList
ipcMain.on('getChatRoomList', async (event, msgKey) => {
  
  fetchAPI.reqChatRoomList(msgKey).then(function(resData)
  {
    sendLog('[IPC] getChatRoomList res:', resData)
    event.reply('res-getChatRoomList', resData);
  }).catch(function(err) {
    sendLog('[IPC] getChatRoomList res  Err:', err)
    event.reply('res-getChatRoomList', new ResData(false, err));
  });
});

// getChatRoomList
ipcMain.on('sendChatMessage', async (event, chatUserIds, chatMessage, roomKey = null) => {

  sendLog('[IPC] sendChatMessage :',roomKey, chatUserIds, chatMessage);

  // RoomKey가 없다면 만든다.
  if (!roomKey) {
    // 1:1이라면
    roomKey = createChatRoomKey(chatUserIds);
    sendLog('[IPC] createChatRoomKey :',roomKey);
  }
  
  nsAPI.reqChatLineKey(roomKey).then(function(resData)
  {
    sendLog('[IPC] getChatLineKey res:', resData)
    if (resData.resCode) {
      nsAPI.reqSendChatMessage(roomKey, resData.data.lineKey, chatUserIds, chatMessage).then(function(resData)
      {
        sendLog('[IPC] sendChatMessage res:', resData)
        event.reply('res-sendChatMessage', resData);
  
      }).catch(function(err) {
        sendLog('[IPC] sendChatMessage res  Err:', err)
        event.reply('res-sendChatMessage', new ResData(false, err));
      });
    } else {
      sendLog('[IPC] getChatLineKey res  Err:', resData)
      event.reply('res-getChatLineKey', resData);
    }
    

  }).catch(function(err) {
    sendLog('[IPC] getChatLineKey res  Err:', err)
    event.reply('res-getChatLineKey', new ResData(false, err));
  });
});

// getChatRoomList
ipcMain.on('notiTitleClick', async (event, notiType, notiId) => {
  console.log('notiTitleClick!', notiType, notiId)
});


// getChatList
ipcMain.on('getChatList', async (event, msgKey) => {
  
  // fetchAPI.getChatList(msgKey).then(function(resData)
  // {
  //   sendLog('[IPC] getChatList res:', resData)
  //   event.reply('res-getChatList', resData);
  // }).catch(function(err) {
  //   sendLog('[IPC] getChatList res  Err:', err)
  //   event.reply('res-getChatList', new ResData(false, err));
  // });
});


