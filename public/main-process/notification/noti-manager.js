const winston = require('../../winston')
const { BrowserWindow} = require('electron');

const { send } = require('../ipc/ipc-cmd-sender');
const { getDispSize } = require('../utils/utils-os');
const cmdConst = require('../net-command/command-const');
const notiType = require('../common/noti-type');
const { showAlert } = require('./noti-window');

var notiWin;

const notiHeight = 155;
const notiWidth = 375;

/**
 * 쪽지 수신 알림을 처리합니다.
 * @param {MessageData} msgData 
 */
function messageReceived(msgData) {

  winston.debug('messageReceived', msgData)

  let destIds = msgData.allDestId.split(cmdConst.SEP_PIPE);
  if (destIds.includes(global.USER.userId)) {
    send('messageReceived', msgData)

    // main에서 바로 알림창을 처리합니다.
    showAlert(notiType.NOTI_MESSAGE, msgData.key, '쪽지', msgData.subject, msgData.sendName);
  }
}

/**
 * 미확인 카운트 알림을 처리합니다.
 * @param {CountData} cntData 
 */
function unreadCountReceived(cntData) {
    winston.info('unreadCount Received! ', JSON.stringify(cntData));
    send('unreadCountReceived', cntData)
}

/**
 * 
 * @param {String} userId 사용자 아이디
 * @param {Number} status 사용자 상태
 * @param {Number} connType 접속 유형
 */
function userStatusChanged(userId, status, connType) {
  winston.info('userStatusChanged! ', userId, status, connType);
  send('userStatusChanged', userId, status, connType)
}

/**
 * 대화 메세지 수신
 */
function chatReceived(chatData) {
  // 대화는 포커스 여부를 판단하기 위해 Rander에서 알림을 요청합니다.
  winston.debug('chatReceived! ', JSON.stringify(chatData));
  send('chatReceived', chatData)
}

module.exports = {
    messageReceived: messageReceived,
    unreadCountReceived: unreadCountReceived,
    userStatusChanged: userStatusChanged,
    chatReceived: chatReceived
  }