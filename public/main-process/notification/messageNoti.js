const { send, sendLog } = require('../ipc/ipc-cmd-sender');

function messageReceived(msgData) {
    sendLog('Message Received! ', msgData);
    send('messageReceived', msgData)
}

function unreadCountReceived(cntData) {
    unreadCountReceived
    sendLog('unreadCount Received! ', cntData);
    send('unreadCountReceived', cntData)
}

module.exports = {
    messageReceived: messageReceived,
    unreadCountReceived: unreadCountReceived
  }