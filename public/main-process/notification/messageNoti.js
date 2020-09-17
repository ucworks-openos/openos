const { BrowserWindow, screen, app } = require('electron');

const { send, sendLog } = require('../ipc/ipc-cmd-sender');
//const notifier = require('node-notifier'); //https://github.com/mikaelbr/node-notifier

var notiWin;

/**
 * 쪽지 수신 알림을 처리합니다.
 * @param {MessageData} msgData 
 */
function messageReceived(msgData) {

  console.log('--------------- Received Message', msgData)
  if (msgData.sendId != global.USER.userId) {
    
   

      showAlert('쪽지수신', msgData.subject);

      /*
      let options = {
        title: 'Message Received',
        message: msgData.subject,
        sound: true, // Only Notification Center or Windows Toasters
        wait: true // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
      }
      new notifier.WindowsBalloon(options).notify(options);   // WIN O
      notifier.notify(options, function (err, response) {
            console.log('Notification Click!', err, response );
        }
      );
      */

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

  showAlert('대화메세지', chatMessage);
  send('chatReceived', chatData)
  sendLog('Chat Received! ', JSON.stringify(chatData));
}


async function showAlert(title, message) {

  if (notiWin) {
    notiWin.destroy();
  }
  
  await app.whenReady();
  let displays = screen.getAllDisplays()

  let x = 0;
  let y = 0;
  displays.forEach((disp) => {
    if (disp.bounds.x === 0 && disp.bounds.y === 0) {
      // main disp
      x += disp.workArea.width;
      y += disp.workArea.height;
    } else {
      // external disp
      if (disp.bounds.x > 0) {
        x += disp.workArea.width;
      }
      if (disp.bounds.y > 0) {
        y += disp.workArea.height;
      }
    }

    console.log('disp', disp)
    console.log('x y ++', x, y)
  })

  console.log('x y', x, y)

  notiWin = new BrowserWindow({
    //title: '알림테스트',
    x: x - 300, y: y - 200,
    width: 300, height: 200,
    //backgroundColor: '#2e2029',
    modal: true,
    resizable: false,
    //focusable: false, // 포커스를 가져가 버리는데..  포커스를 뺴면 알림창이 안닫힌다.
    fullscreenable: false,
    frame: false,     // 프레임 없어짐, 타이틀바 포함  titleBarStyle: hidden
    thickFrame: true, // 그림자와 창 애니메이션
    // webPreferences: {
    //   nodeIntegration: true, // is default value after Electron v5
    // }
  })
  //notiWin.webContents.openDevTools();
  win.menuBarVisible = false;


  let notifyFile = `file://${global.ROOT_PATH}/notify.html`;
  console.log(`>>>>>>>>>>>  `, notifyFile);
  notiWin.webContents.on('did-finish-load', () => {
    console.log(`>>>>>>>>>>>   LOAD COMPLETED!`);
    notiWin.webContents.executeJavaScript(`
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