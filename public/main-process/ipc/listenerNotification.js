const { ipcMain } = require('electron');
const winston = require('../../winston');
const { showAlert } = require('../notification/noti-window');

const { send } = require('./ipc-cmd-sender');
const notiType = require('../common/noti-type');

/**
 * notiTitleClick
 * 
 * 알림창에서 수신된 메세지를 다시 Randerer로 돌려준다.
 */
ipcMain.on('showChatNoti', async (event, chatMsg) => {

  showAlert(notiType.NOTI_CHAT, 
    chatMsg.roomKey,
    '대화 메세지',
    chatMsg.chatData,
    chatMsg.sendName,
    chatMsg)
});

/**
 * notiTitleClick
 * 
 * 알림창에서 수신된 메세지를 다시 Randerer로 돌려준다.
 */
ipcMain.on('notiTitleClick', async (event, notiType, notiId, tag) => {
  winston.info('notiTitleClick', notiType, notiId, tag)
  send('notiTitleClick!', notiType, notiId, tag)
});
