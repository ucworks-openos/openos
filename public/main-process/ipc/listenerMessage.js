const { ipcMain } = require('electron');
const { reqSendMessage, reqGetOrgChild } = require('../net-command/command-ns-api');
const ResData = require('../ResData');



// getBuddyList
ipcMain.on('sendMessage', async (event, recvIds, recvNames, subject, message) => {
  
  reqSendMessage(recvIds, recvNames, subject, message).then(function(resData)
  {
    console.log('sendMessage res:', resData)
    event.reply('res-sendMessage', resData);
  }).catch(function(err) {
    event.reply('res-sendMessage', new ResData(false, err));
  });

});
