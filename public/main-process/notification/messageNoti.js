const { BrowserWindow} = require('electron');

const { send, sendLog } = require('../ipc/ipc-cmd-sender');
const { getDispSize } = require('../utils/utils-os');
const cmdConst = require('../net-command/command-const');
const notiType = require('../common/noti-type');

var notiWin;

/**
 * 쪽지 수신 알림을 처리합니다.
 * @param {MessageData} msgData 
 */
function messageReceived(msgData) {

  console.log('--------------- Received Message', msgData)

  let destIds = msgData.allDestId.split(cmdConst.SEP_PIPE);
  //if (msgData.sendId != global.USER.userId) {
  if (destIds.includes(global.USER.userId)) {
    showAlert(notiType.NOTI_MESSAGE, msgData.key, '쪽지수신', msgData.subject);
    sendLog('Message Received! ', JSON.stringify(msgData));
    send('messageReceived', msgData)
  }
}

/**
 * 미확인 카운트 알림을 처리합니다.
 * @param {CountData} cntData 
 */
function unreadCountReceived(cntData) {
    sendLog('unreadCount Received! ', JSON.stringify(cntData));
    send('unreadCountReceived', cntData)
}

/**
 * 
 * @param {String} userId 사용자 아이디
 * @param {Number} status 사용자 상태
 * @param {Number} connType 접속 유형
 */
function userStatusChanged(userId, status, connType) {
  sendLog('userStatusChanged! ', userId, status, connType);
  send('userStatusChanged', userId, status, connType)

}

/**
 * 대화 메세지 수신
 */
function chatReceived(chatData) {

  let chatMessage = chatData.chatData;
  if (chatMessage.length > 10) chatMessage = chatMessage.substring(0, 10);

  showAlert(notiType.NOTI_CHAT, chatData.roomKey, '대화메세지', chatMessage);
  send('chatReceived', chatData)
  sendLog('Chat Received! ', JSON.stringify(chatData));
}

/**
 * 우측하단에 알림창을 띄웁니다.
 * @param {String} notiType 
 * @param {String} notiId 
 * @param {String} title 
 * @param {String} message 
 */
async function showAlert(notiType, notiId, title, message) {

  console.log('showAlert', notiType, notiId, title, message);
  if (notiWin) {
    notiWin.destroy();
  }
   
  // 확장 포함한 전제 스크린사이즈
  let dispSize = await getDispSize();

  notiWin = new BrowserWindow({
    x: dispSize.width - 300, y: dispSize.height - 200,
    width: 300, height: 200,
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

  let notifyFile = `file://${global.ROOT_PATH}/notify.html`;
  console.log(`>>>>>>>>>>>  `, notifyFile);
  notiWin.webContents.on('did-finish-load', () => {
    console.log(`>>>>>>>>>>>   LOAD COMPLETED!`);
    notiWin.webContents.executeJavaScript(`
        document.getElementById("notiType").value = '${notiType}';
        document.getElementById("notiId").value = '${notiId}';
        document.getElementById("title").innerHTML += '${title}';
        document.getElementById("msg").innerHTML += '${message}'
    `);
  })
  notiWin.loadURL(notifyFile)
}

module.exports = {
    messageReceived: messageReceived,
    unreadCountReceived: unreadCountReceived,
    userStatusChanged: userStatusChanged,
    chatReceived: chatReceived
  }