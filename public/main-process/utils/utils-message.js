const OsUtil = require('./utils-os');
const crypto = require('crypto');

/**
 * 대화방 키를 생성합니다.
 * 
 */
function createChatRoomKey(chatUserIds) {
    if (!chatUserIds) return '';

    if (chatUserIds.length > 2) { 
        // 1:N
        return global.USER.userId + "_" + OsUtil.getUUID();
    }  else {
        // 1:1

        // let userIds = chatUserIds.sort().join("|");
        // return crypto.createHash('sha256').update(userIds).digest('base64');
        return chatUserIds.sort().join("|");
    }
}

    
module.exports = {
    createChatRoomKey: createChatRoomKey,
}
