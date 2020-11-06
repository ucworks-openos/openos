const logger = require('../../logger');
const CommandHeader = require('./command-header');
const ResData = require('../ResData');

const OsUtil = require('../utils/utils-os');
const EncUtil = require('../utils/utils-crypto')
const CmdCodes = require('./command-code');
const CmdConst = require('./command-const');
const SqlConst = require('./command-const-sql');
const fetchCore = require('../net-core/network-fetch-core');
const { adjustBufferMultiple4 } = require('../utils/utils-buffer');
const { DATE_FORMAT, MSG_TYPE, DML_KIND } = require('../common/common-const');
const { decryptMessage } = require('../utils/utils-crypto');
const { realpathSync } = require('fs');

/**
 * 서버로 접속요청 합니다.
 */
function reqconnectFETCH () {
    fetchCore.connectFETCH().then(function() {
        logger.info('FETCH Connect Success!');
    }).catch(function(err){
        logger.error('FETCH Connect fale!' + JSON.stringify(err));
    })
}

/**
 * 연결을 종료합니다.
 */
function close() {
    fetchCore.close();
}

/**
 * 쪽지목록 조회
 */
function reqMessageList(msgType, rowOffset = 0, rowLimit = 100) {
    let queryKey = 'GET_MSG_LIST_' + msgType + '_' + global.USER.userId + '_' + OsUtil.getDateString(DATE_FORMAT.YYYYMMDDHHmmssSSS);

    let query = ''
    switch(msgType) {
        case MSG_TYPE.RECEIVE:
            query = SqlConst.SQL_select_search_tbl_message_where_nogroup_recv_from_server

            break;
        case MSG_TYPE.SEND:
            query = SqlConst.SQL_select_search_tbl_message_where_nogroup_send_from_server
            break;

        case MSG_TYPE.ALL:  // 쿼리가 없다.
        default:
            logger.warn('Unknown Message Direction! direction:' + msgDirection)
            return new Error('Unknown Message Direction! direction:' + msgDirection);
    }

    // 쿼리에 따라 변경될수 있도록 case문으로 이동 필요.
    // DB Option에 따라서 변경될 가능성도 있음
    query = query.replace(':WHERE_COND1:', " WHERE (a.msg_user_id = '" + global.USER.userId + "')");
    query = query.replace(':ROW_LIMIT:', rowLimit);
    query = query.replace(':ROW_OFFSET:', rowOffset);

    return queryToServer(query, queryKey)
}

/**
 * 쪽지상세정보 조회
 * @param {String} msgKey  
 */
function reqGetMessageDetail(msgKey) {
    return new Promise(async function(resolve, reject) {
        
        let queryKey = 'GET_MSG_LIST_MSG_ALL_' + global.USER.userId + '_' + OsUtil.getDateString(DATE_FORMAT.YYYYMMDDHHmmssSSS);
        let query = SqlConst.SQL_select_tbl_message_msg_key_from_server;
        query = query.replace(':MSG_KEY:', msgKey);
        
        try {
            let resData = await queryToServer(query, queryKey);

            if (resData.resCode) {
                let encryptKey = resData.data.table.row.encrypt_key
                let encArr = encryptKey.split(CmdConst.SEP_PIPE);
                let encMode = encArr[0];
                let encKey = encArr[1];

                let cipherContents = resData.data.table.row.msg_content;
                switch(encMode) {
                case CmdConst.ENCODE_TYPE_OTS:
                    encKey = EncUtil.decryptRC4(CmdConst.SESSION_KEY, encKey);
                    resData.data.table.row.msg_content = EncUtil.decryptRC4(encKey, cipherContents);
                    break;
                case CmdConst.ENCODE_TYPE_OTS_AES256:
                    encKey = EncUtil.decryptAES256(CmdConst.SESSION_KEY_AES256, encKey);
                    resData.data.table.row.msg_content = EncUtil.decryptAES256(encKey, cipherContents);
                    break;

                default:
                    resData.data.table.row.msg_content = cipherContents;
                    break;
                }
            }
            resolve(resData);
        } catch (err) {
            logger.err(query, err)
            reject(err);
        }

    });
}

/**
 * msgKeys seperated comma ','
 * @param {MSG_TYPE} msgType 
 * @param {Array} msgKeys 
 */
function reqDeleteMessage(msgType, msgKeys) {

    if (!msgKeys) return;

    let queryKey = 'GET_MSG_DELETE_MSGKEY_' + msgType + '_' + global.USER.userId + '_' + OsUtil.getDateString(DATE_FORMAT.YYYYMMDDHHmmssSSS);

    let query = ''
    switch(msgType) {
        case MSG_TYPE.RECEIVE:
            query = SqlConst.SQL_delete_tbl_msg_recv_msg_key_from_server

            break;
        case MSG_TYPE.SEND:
            query = SqlConst.SQL_delete_tbl_msg_send_msg_key_from_server
            break;

        default:
            logger.warn('Unknown Message Direction! direction:' + msgDirection)
            return new Error('Unknown Message Direction! direction:' + msgDirection);
    }

    let keyTmp = msgKeys.join("','");
    query = query.replace(':MSG_KEYS:', "'" + keyTmp + "')");

    return queryToServer(query, queryKey, DML_KIND.DELETE)
}

/**
 * 대화방 목록 조회
 */
async function reqChatRoomList( rowOffset = 0, rowLimit = 100) {
    
    let queryKey = 'GET_CHAT_COLLRECT_' + global.USER.userId + '_' + OsUtil.getDateString(DATE_FORMAT.YYYYMMDDHHmmssSSS);
    let query = SqlConst.SQL_select_tbl_chat_collect_server;
    query = query.replace(':USER_ID:', global.USER.userId);
    query = query.replace(':ROW_LIMIT:', rowLimit);
    query = query.replace(':ROW_OFFSET:', rowOffset);

    
    let res = await queryToServer(query, queryKey);

    try {
        if (Array.isArray(res.data.table.row)) {
            res.data.table.row.forEach((chat) => {
                chat.chat_contents = decryptMessage(chat.chat_encrypt_key, chat.chat_contents);
            });
        } else if (res.data.table.row){
            // 대화 내용이 1개밖에 없는 경우
            res.data.table.row.chat_contents = decryptMessage(res.data.table.row.chat_encrypt_key, res.data.table.row.chat_contents);
        }
        
    } catch (err) {
        logger.err('chatList decrypt content fail!', res, err)
    }
    return res
}

/**
 * 대화방 조회
 */
async function reqChatRoomByRoomKey(roomKey) {
    
    let queryKey = 'GET_CHAT_COLLRECT_' + global.USER.userId + '_' + OsUtil.getDateString(DATE_FORMAT.YYYYMMDDHHmmssSSS);
    let query = SqlConst.SQL_select_tbl_chat_room_server;
    query = query.replace(':CAHT_ROOM_KEY:', roomKey);
    query = query.replace(':USER_ID:', global.USER.userId);

    
    let res = await queryToServer(query, queryKey);

    try {
        if (res.data.table.row){
            // 대화 내용이 1개밖에 없는 경우
            res.data.table.row.chat_contents = decryptMessage(res.data.table.row.chat_encrypt_key, res.data.table.row.chat_contents);
            res.data = res.data.table.row;
        }
    } catch (err) {
        logger.err('chatList decrypt content fail!', res, err)
    }
    return res
}

/**
 * 이전대화 목록 조회
 */
async function reqGetChatList(roomId, lastLineKey = '9999999999999999', rowLimit = 30) {
    
    let queryKey = 'GET_TBL_CHAT_RECV_LINE_' + global.USER.userId + '_' + OsUtil.getDateString(DATE_FORMAT.YYYYMMDDHHmmssSSS);
    let query = SqlConst.SQL_select_tbl_chat_recv_line_server_redis;
    query = query.replace(':CHAT_USER_ID:', global.USER.userId);
    query = query.replace(':ROOM_KEY:', roomId);
    query = query.replace(':LINE_KEY:', lastLineKey);
    query = query.replace(':ROW_LIMIT:', rowLimit);
    
    let res = await queryToServer(query, queryKey);

    try {
        if (Array.isArray(res.data.table.row)) {
            res.data.table.row.forEach((chat) => {
                chat.chat_contents = decryptMessage(chat.chat_encrypt_key, chat.chat_contents);
            });
        } else if (res.data.table.row){
            // 대화 내용이 1개밖에 없는 경우
            res.data.table.row.chat_contents = decryptMessage(res.data.table.row.chat_encrypt_key, res.data.table.row.chat_contents);
        }
        
    } catch (err) {
        logger.err('chatList decrypt content fail!', res, err)
    }

    return res;
}

/**
 * 대화방 이름 변경
 * @param {String} roomId 
 * @param {String} chatEntryNames 
 */
async function reqChangeChatRoomName(roomId, chatEntryNames) {
    
    let queryKey = 'UPDATE_CHAT_ROOM_TITLE_' + global.USER.userId + '_' + OsUtil.getDateString(DATE_FORMAT.YYYYMMDDHHmmssSSS);
    let query = SqlConst.SQL_update_tbl_chat_room_title_from_server;
    query = query.replace(':CHAT_ENTRY_NAMES:', chatEntryNames);
    query = query.replace(':ROOM_KEY:', roomId);
    
    let res = await queryToServer(query, queryKey, DML_KIND.UPDATE);
    return res;
}

/**
 * queryToServer
 * @param {String} query 
 * @param {String} queryKey 
 */
function queryToServer(query, queryKey, dmlKind = DML_KIND.SELECT) {
    return new Promise(async function(resolve, reject) {

        await fetchCore.connectFETCH(); // 무조건 새로 붙인다.

        if (!global.SERVER_INFO.FETCH.isConnected) {
            reject(new Error('FETCH IS NOT CONNECTED!'));
            return;
        }

        let userIdBuf = Buffer.alloc(CmdConst.BUF_LEN_USERID);
        userIdBuf.write(global.USER.userId, global.ENC);

        let keyBuf = Buffer.alloc(CmdConst.BUF_LEN_SQL_KEY);
        keyBuf.write(queryKey, global.ENC);

        let nameBuf = Buffer.alloc(CmdConst.BUF_LEN_SQL_NAME);
        let whereBuf = Buffer.alloc(CmdConst.BUF_LEN_SQL_DATA);
        let whereKindBuf = Buffer.alloc(CmdConst.BUF_LEN_SQL_FIELD);

        let dbKindBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);         // 1->Memory db, 2->Disk db
        dbKindBuf.writeInt32LE(Number(global.FUNC_COMP_39.DB_KIND));

        let rowCountBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);       // 1. Page단위로 쿼리를 보내는 경우 - 해당 쿼리의 총 갯수를 보낸다. - 페이지 계산을 위해서 필요.
        let rowOrPageBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);      // 1. Page단위로 쿼리를 보내는 경우 - 보고 싶은 페이지 번호를 보낸다.
        
        let dmlBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);            // 1->select, 2->insert, 3->update, 4->delete 5->sync select(count), 6-sync select - row갯수 포함한것
        dmlBuf.writeInt32LE(dmlKind);

        let querySizeBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);
        let queryBuf = Buffer.from(query, global.ENC);
        querySizeBuf.writeInt32LE(queryBuf.length);
        
        logger.info('QUERY global.DB_KIND ', global.FUNC_COMP_39.DB_KIND);
        logger.info('QUERY KEY', queryKey);
        logger.debug('QUERY ', queryBuf.length, query);

        var stringBuf = Buffer.concat([userIdBuf, keyBuf, nameBuf, whereBuf, whereKindBuf]);
        stringBuf = adjustBufferMultiple4(stringBuf);

        var dataBuf = Buffer.concat([stringBuf, dbKindBuf, rowCountBuf, rowOrPageBuf, dmlBuf, querySizeBuf, queryBuf]);
        fetchCore.writeCommandFETCH(new CommandHeader(CmdCodes.FETCH_SQL_REQUEST, 0, function(resData){
            resolve(resData);
        }), dataBuf);
    });
}

module.exports = {
    reqMessageList: reqMessageList,
    reqGetMessageDetail: reqGetMessageDetail,
    reqDeleteMessage: reqDeleteMessage,
    reqChatRoomList: reqChatRoomList,
    reqChatRoomByRoomKey: reqChatRoomByRoomKey,
    reqGetChatList: reqGetChatList,
    reqChangeChatRoomName: reqChangeChatRoomName,
    close: close
}
