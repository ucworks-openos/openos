const winston = require('../../winston')
const { BrowserWindow} = require('electron');

const { send } = require('../ipc/ipc-cmd-sender');
const { getDispSize } = require('../utils/utils-os');
const cmdConst = require('../net-command/command-const');
const notiType = require('../common/noti-type');

var notiWin;

const notiHeight = 155;
const notiWidth = 375;

/**
 * 쪽지 수신 알림을 처리합니다.
 * @param {MessageData} msgData 
 */
function messageReceived(msgData) {

  winston.info('--------------- Received Message', msgData)

  let destIds = msgData.allDestId.split(cmdConst.SEP_PIPE);
  //if (msgData.sendId != global.USER.userId) {
  if (destIds.includes(global.USER.userId)) {
    showAlert(notiType.NOTI_MESSAGE, msgData.key, '쪽지수신', msgData.subject, 'senderName', 'allMem');
    winston.info('Message Received! ', JSON.stringify(msgData));
    send('messageReceived', msgData)
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

  winston.debug('Chat Received! ', JSON.stringify(chatData));
  send('chatReceived', chatData)
}

/**
 * 우측하단에 알림창을 띄웁니다.
 * @param {String} notiType 
 * @param {String} notiId 
 * @param {String} title 
 * @param {String} message 
 */
async function showAlert(notiType, notiId, title, message, sendName, allMembers) {

  winston.info('showAlert',notiType, notiId, title, message, sendName, allMembers);
  if (notiWin) {
    notiWin.destroy();
  }
   
  // 확장 포함한 전제 스크린사이즈
  let dispSize = await getDispSize();

  notiWin = new BrowserWindow({
    x: dispSize.width - notiWidth, y: dispSize.height - notiHeight,
    width: notiWidth, height: notiHeight,
    //backgroundColor: '#2e2029',
    modal: true,
    resizable: false,
    focusable: false, // 포커스를 가져가 버리는데
    fullscreenable: false,
    frame: false,     // 프레임 없어짐, 타이틀바 포함  titleBarStyle: hidden
    thickFrame: true, // 그림자와 창 애니메이션
    webPreferences: {
      nodeIntegration: true, // is default value after Electron v5
    }
  })
  //notiWin.webContents.openDevTools();
  notiWin.menuBarVisible = false;

  let notifyFile = `file://${__dirname}/notify.html`;
  winston.info(`>>>>>>>>>>>  `, notifyFile);
  notiWin.webContents.on('did-finish-load', () => {
    winston.info(`>>>>>>>>>>>   LOAD COMPLETED!`);
    notiWin.webContents.executeJavaScript(`
      document.getElementById("notiType").value = '${notiType}';
      document.getElementById("notiId").value = '${notiId}';
      document.getElementById("title").innerHTML += '${title}';
      document.getElementById("msg").innerHTML += '${message}';
      document.getElementById("allMembers").value += '${allMembers}';
      document.getElementById("sendName").innerHTML += '${sendName}';
      document.getElementById("message").value += '${message}';
    `);
  })
  notiWin.loadURL(notifyFile)
    .then(() => {})
    .catch((err) => {winston.err('showAlert fail!', err)});
}

module.exports = {
    messageReceived: messageReceived,
    unreadCountReceived: unreadCountReceived,
    userStatusChanged: userStatusChanged,
    chatReceived: chatReceived
  }