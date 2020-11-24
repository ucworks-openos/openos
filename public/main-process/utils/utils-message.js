const OsUtil = require('./utils-os');
const crypto = require('crypto');
const logger = require('../../logger');

/**
 * 대화방 키를 생성합니다.
 * 
 */
function createChatRoomKey(chatUserIds) {
    if (!chatUserIds) return '';

    let userIds = chatUserIds.sort().join("|");
    //Buffer.from('hello world').toString('hex')
    return crypto.createHash('sha1').update(userIds).digest('hex').toUpperCase() //('hex') //('base64');
}

    
module.exports = {
    createChatRoomKey: createChatRoomKey,
}
