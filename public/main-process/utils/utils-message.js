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

    // logger.debug('-------------------  createChatRoomKey  base64', crypto.createHash('sha256').update(userIds).digest('base64'));
    // logger.debug('-------------------  createChatRoomKey hex', crypto.createHash('sha256').update(userIds).digest('hex'));
    // let hex = crypto.createHash('sha256').update(userIds).digest('hex')
    // let hexInt = parseInt(hex, 16);
    // let intHex = hexInt.toString(16);
    // logger.debug('-------------------  createChatRoomKey hexInt:%s intHex:%s ', hexInt, intHex);
    // let tmp = crypto.createHash('sha1').update(userIds).digest()
    // logger.debug('-------------------  createChatRoomKey hex',tmp.length, tmp );
    // logger.debug('-------------------  createChatRoomKey', crypto.createHash('sha256').update(userIds));

    // return Buffer.from(roomKey).toString('hex');
    // if (chatUserIds.length > 2) { 
    //     // 1:N
    //     return global.USER.userId + "_" + OsUtil.getUUID();
    // }  else {
    //     // 1:1
    //     return crypto.createHash('sha256').update(userIds).digest('base64');
    //     //return chatUserIds.sort().join("|");
    // }
}

    
module.exports = {
    createChatRoomKey: createChatRoomKey,
}
