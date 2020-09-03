const { send, sendLog } = require('../ipc/ipc-cmd-sender');

function messageReceived(msgData) {
    sendLog('Message Received! ', JSON.stringify(msgData));
    send('messageReceived', msgData)
}

function unreadCountReceived(cntData) {
    unreadCountReceived
    sendLog('unreadCount Received! ', JSON.stringify(cntData));
    send('unreadCountReceived', cntData)
}

module.exports = {
    messageReceived: messageReceived,
    unreadCountReceived: unreadCountReceived
  }