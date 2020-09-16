const { send, sendLog } = require('../ipc/ipc-cmd-sender');
const notifier = require('node-notifier'); //https://github.com/mikaelbr/node-notifier

/**
 * 쪽지 수신 알림을 처리합니다.
 * @param {MessageData} msgData 
 */
function messageReceived(msgData) {

  console.log('--------------- Received Message', msgData)
  if (msgData.sendId != global.USER.userId) {
    
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

  let options = {
    title: 'STATUS CHANGED',
    message: userId + ' Status:' + status + ' Conn:' + connType,
    sound: true, // Only Notification Center or Windows Toasters
    wait: true // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
  }

  notifier.notify(options, function (err, response) {
        console.log('Notification Click!', err, response );
    }
  );
}

function chatReceived(chatData) {

  let options = {
      title: 'Chat Received',
      message: chatData.chatData,
      sound: true, // Only Notification Center or Windows Toasters
      wait: true // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
    }


    // new notifier.WindowsBalloon(options).notify(options);   // WIN O
    // notifier.notify(options, function (err, response) {
    //       console.log('Notification Click!', err, response );
    //   }
    // );

  sendLog('Chat Received! ', JSON.stringify(chatData));
}


module.exports = {
    messageReceived: messageReceived,
    unreadCountReceived: unreadCountReceived,
    userStatusChanged: userStatusChanged,
    chatReceived: chatReceived
  }