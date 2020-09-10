const { sendLog } = require('../ipc/ipc-cmd-sender');

const CommandHeader = require('./command-header');
const ResData = require('../ResData');

const OsUtil = require('../utils/utils-os');
const CmdCodes = require('./command-code');
const CmdConst = require('./command-const');
const SqlConst = require('./command-const-sql');
const fetchCore = require('../net-core/network-fetch-core');

/**
 * 서버로 접속요청 합니다.
 */
function reqconnectFETCH () {
    fetchCore.connectFETCH().then(function() {
        sendLog('FETCH Connect Success!');
    }).catch(function(err){
        sendLog('FETCH Connect fale!' + JSON.stringify(err));
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
 * @param {}  
 */
function reqMessageHistory(msgType, rowOffset = 0, rowLimit = 100) {
    return new Promise(async function(resolve, reject) {

        await fetchCore.connectFETCH(); // 무조건 새로 붙인다.

        if (!global.SERVER_INFO.FETCH.isConnected) {
            reject(new Error('FETCH IS NOT CONNECTED!'));
            return;
        }

        let query = ''
        switch(msgType) {
            case 'MSG_RECV':
                query = SqlConst.SQL_select_search_tbl_message_where_nogroup_recv_from_server

                break;
            case 'MSG_SEND':
                query = SqlConst.SQL_select_search_tbl_message_where_nogroup_send_from_server
                break;

            case 'MSG_ALL':  // 쿼리가 없다.
            default:
                sendLog('Unknown Message Direction! direction:' + msgDirection)
                reject(new Error('Unknown Message Direction! direction:' + msgDirection));
                return;
        }

        // 쿼리에 따라 변경될수 있도록 case문으로 이동 필요.
        // DB Option에 따라서 변경될 가능성도 있음
        query = query.replace(':WHERE_COND1:', " WHERE (a.msg_user_id = '" + global.USER.userId + "')");
        query = query.replace(':ROW_LIMIT:', rowLimit);
        query = query.replace(':ROW_OFFSET:', rowOffset);
        
        let userIdBuf = Buffer.alloc(CmdConst.BUF_LEN_USERID);
        userIdBuf.write(global.USER.userId, global.ENC);

        let keyBuf = Buffer.alloc(CmdConst.BUF_LEN_SQL_KEY);
        keyBuf.write('GET_MSG_LIST_' + msgType + '_' + global.USER.userId + '_' + OsUtil.getDateString('YYYYMMDDHHmmssSSS'), global.ENC);

        let nameBuf = Buffer.alloc(CmdConst.BUF_LEN_SQL_NAME);
        let whereBuf = Buffer.alloc(CmdConst.BUF_LEN_SQL_DATA);
        let whereKindBuf = Buffer.alloc(CmdConst.BUF_LEN_SQL_FIELD);

        let dbKindBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);         // 1->Memory db, 2->Disk db
        dbKindBuf.writeInt32LE(Number(global.FUNC_COMP_39.DB_KIND));

        let rowCountBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);       // 1. Page단위로 쿼리를 보내는 경우 - 해당 쿼리의 총 갯수를 보낸다. - 페이지 계산을 위해서 필요.
        let rowOrPageBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);      // 1. Page단위로 쿼리를 보내는 경우 - 보고 싶은 페이지 번호를 보낸다.
        rowOrPageBuf.writeInt32LE(1);
        
        let dmlBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);            // 1->select, 2->insert, 3->update, 4->delete 5->sync select(count), 6-sync select - row갯수 포함한것
        dmlBuf.writeInt32LE(1);

        let querySizeBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);
        let queryBuf = Buffer.from(query, global.ENC);
        querySizeBuf.writeInt32LE(queryBuf.length);
        
        sendLog('MSG global.DB_KIND ', global.FUNC_COMP_39.DB_KIND);
        sendLog('MSG QUERY ', query);
        sendLog('MSG QUERY LEN ', queryBuf.length);

        var stringBuf = Buffer.concat([userIdBuf, keyBuf, nameBuf, whereBuf, whereKindBuf]);
        var dummyLength = Math.ceil(stringBuf.length/4)*4;
        if (dummyLength != stringBuf.length) {
            //console.log("cmdBuf Diff size:" + (dummyLength-cmdBuf.length) + ", DummySize:" + dummyLength + ", BufferSize:" + cmdBuf.length);
            var dummyBuf = Buffer.alloc(dummyLength-stringBuf.length);
            stringBuf = Buffer.concat([stringBuf, dummyBuf]);
        }

        var dataBuf = Buffer.concat([stringBuf, dbKindBuf, rowCountBuf, rowOrPageBuf, dmlBuf, querySizeBuf, queryBuf]);
        fetchCore.writeCommandFETCH(new CommandHeader(CmdCodes.FETCH_SQL_REQUEST, 0, function(resData){
            resolve(resData);
        }), dataBuf);
    });
}

module.exports = {
    reqMessageHistory: reqMessageHistory,
    close: close
}
