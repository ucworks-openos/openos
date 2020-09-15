const OsUtil = require('./utils-os');

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
        return chatUserIds.sort().join("|");
    }
}

    
module.exports = {
    createChatRoomKey: createChatRoomKey,
}
