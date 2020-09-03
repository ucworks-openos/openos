const { ipcMain } = require('electron');

const { sendLog } = require('./ipc-cmd-sender');
const { reqSendMessage, reqGetOrgChild } = require('../net-command/command-ns-api');
const ResData = require('../ResData');


// getBuddyList
ipcMain.on('sendMessage', async (event, recvIds, recvNames, subject, message) => {
  
  reqSendMessage(recvIds, recvNames, subject, message).then(function(resData)
  {
    sendLog('[IPC] sendMessage res:', resData)
    event.reply('res-sendMessage', resData);
  }).catch(function(err) {
    sendLog.log('[IPC] sendMessage res  Err:', err)
    event.reply('res-sendMessage', new ResData(false, err));
  });

});
