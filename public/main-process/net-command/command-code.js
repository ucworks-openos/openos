const CommandHeader = require("./command-header");

const DS_BASE           = 3000;
const NS_BASE           = 4000;
const SB_BASE           = 5000;
const PS_BASE           = 6000;
const CS_BASE           = 13000;
const CHAT_DATA_BASE    = 15000;
const FETCH_BASE        = 25000;



module.exports = Object.freeze({
    CONNECTION_CHECK            : 99999,

    //
    //#region DS COMMAND
    DS_BASE               : DS_BASE,
    DS_HANDSHAKE          : DS_BASE + 300,
    DS_SET_SESSION        : DS_BASE + 303,

    DS_SUCCESS            : DS_BASE + 3,
    DS_NO_USERID          : DS_BASE + 4,
    DS_SAVE_BUDDY_DATA    : DS_BASE + 22,
    DS_UPGRADE_CHECK      : DS_BASE + 91,
    DS_UPGRADE_CHANGE     : DS_BASE + 92,
    DS_GET_SERVER_INFO    : DS_BASE + 93,
    DS_GET_RULES          : DS_BASE + 94,

    DS_GET_BUDDY_MEMORY          : DS_BASE + 19,
    DS_GET_BUDDY_DATA            : DS_BASE + 20,
    DS_GET_BUDDY_DATA_OK         : DS_BASE + 21,
    DS_GET_BUDDY_MEMORY_LZ       : DS_BASE + 601,
    DS_GET_BUDDY_MEMORY_LZO      : DS_BASE + 602,
    DS_GET_BUDDY_DATA_LZ         : DS_BASE + 603,
    DS_GET_BUDDY_DATA_LZO        : DS_BASE + 604,
    
    //#endregion DS COMMAND

    //
    //#region CS COMMAND
    CS_BASE                      : CS_BASE,
    CS_CERTIFY                   : CS_BASE + 1,
    CS_SUCCESS                   : CS_BASE + 2,
    CS_NOT_CONNECT               : CS_BASE + 3,
    CS_NO_USERID                 : CS_BASE + 4,
    CS_WRONG_PASSWORD            : CS_BASE + 5,
    CS_NOT_DB_CONNECT            : CS_BASE + 6,
    CS_ERROR                     : CS_BASE + 7,
    CS_QUERY_ERROR               : CS_BASE + 8,
    CS_WRONG_MAC_ADDR            : CS_BASE + 10,
    CS_NOT_LOGIN_SSO             : CS_BASE + 11,
    CS_UCWARE_LOGIN              : CS_BASE + 12,
    CS_NOT_LOGIN_SSO_ACTIVEX     : CS_BASE + 13,
    CS_NOT_LOGIN_SSO_VERISIGN    : CS_BASE + 14,
    //#endregion CS COMMAND

    //
    //#region PS COMMAND
    PS_BASE                      : PS_BASE,
    PS_SERVER_BUSY               : PS_BASE + 999,
    PS_GET_USERS_INFO            : PS_BASE + 5,
    PS_GET_CONDICTION            : PS_BASE + 7,
    PS_GET_BASE_CLASS            : PS_BASE + 9,
    PS_GET_CHILD_CLASS           : PS_BASE + 13,
    PS_GET_CHILD_CLASS_GROUP     : PS_BASE + 26,
    PS_GET_ALL_USERS             : PS_BASE + 15,
    PS_GET_ONLINE_USERS          : PS_BASE + 17,
    PS_GET_LOGIN_USERS           : PS_BASE + 18,
    PS_GET_FRIEND_USERS          : PS_BASE + 25,
    PS_GET_CLASS_USER            : PS_BASE + 30,
    PS_GET_CLASS_USER_NODE       : PS_BASE + 31,

    PS_GET_USERS_INFO_LZ         : PS_BASE + 805,  
    PS_GET_CONDICTION_LZ         : PS_BASE + 807,
    PS_GET_BASE_CLASS_LZ         : PS_BASE + 809,
    PS_GET_CHILD_CLASS_LZ        : PS_BASE + 813,
    PS_GET_CHILD_CLASS_GROUP_LZ  : PS_BASE + 826,
    PS_GET_ALL_USERS_LZ          : PS_BASE + 815,
    PS_GET_ONLINE_USERS_LZ       : PS_BASE + 817,
    PS_GET_LOGIN_USERS_LZ        : PS_BASE + 818,
    PS_GET_FRIEND_USERS_LZ       : PS_BASE + 825,
    PS_GET_CLASS_USER_LZ         : PS_BASE + 830,
    PS_GET_CLASS_USER_NODE_LZ    : PS_BASE + 831,
    PS_GET_DATA_CONTINUE         : PS_BASE + 832,
    //#endregion PS COMMAND

    //
    //#region NS COMMAND
    NS_BASE                      : NS_BASE,
    NS_CONNECT                   : NS_BASE + 6,
    NS_USER_DISCONNECT           : NS_BASE + 8,
    NS_CHANGE_STATE              : NS_BASE + 10,
    NS_SEND_MSG                  : NS_BASE + 11,
    NS_DELETE_MESSAGE            : NS_BASE + 26,
    NS_NOTIFY_FRIENDS            : NS_BASE + 78,
    NS_UNNOTIFY_FRIENDS          : NS_BASE + 79,
    NS_CHECK_SEND                : NS_BASE + 90,
    NS_GET_STATE                 : NS_BASE + 96,
    NS_STATE_LIST                : NS_BASE + 110,
    NS_CHATLINE_UNREAD_CNT       : NS_BASE + 250,
    NS_UNREADALL_COUNT           : NS_BASE + 262,
    NS_CHAT_LINEKEY              : NS_BASE + 640,
    NS_SERVER_BUSY               : NS_BASE + 999,
    NS_SERVER_CLOSE              : NS_BASE + 998,
    //#endregion NS COMMAND

    //
    //#region FETCH COMMAND
    FETCH_BASE                      : FETCH_BASE,
    FETCH_NO_SQL                    : FETCH_BASE + 1,
    FETCH_SELECT_SUCCESS            : FETCH_BASE + 2,
    FETCH_INSERT_SUCCESS            : FETCH_BASE + 3,
    FETCH_UPDATE_SUCCESS            : FETCH_BASE + 4,
    FETCH_DELETE_SUCCESS            : FETCH_BASE + 5,
    FETCH_SELECT_SYNC_ROW_SUCCESS   : FETCH_BASE + 6,
    FETCH_SELECT_SYNC_COUNT_SUCCESS : FETCH_BASE + 7,

    FETCH_NOT_CONNECT              : FETCH_BASE + 8,
    FETCH_NOT_DB_CONNECT           : FETCH_BASE + 9,
    FETCH_ERROR                    : FETCH_BASE + 10,
    FETCH_QUERY_ERROR              : FETCH_BASE + 11,
    FETCH_ENV_MEM_ERROR            : FETCH_BASE + 12,
    FETCH_ENV_DISK_ERROR           : FETCH_BASE + 13,

    FETCH_SQL_REQUEST            : FETCH_BASE + 14,
    FETCH_SQL_REQUEST_LZ         : FETCH_BASE + 814,  
    FETCH_SQL_RESPONSE           : FETCH_BASE + 15,
    FETCH_NO_DATA                : FETCH_BASE + 16,
    //#endregion FETCH COMMAND


    SB_BASE                      : SB_BASE,
    SB_CHAT_DATA                 : SB_BASE + 3,
    SB_CHAT_INPUT_CHANGE         : SB_BASE + 5,
    SB_CHAT_OUT                  : SB_BASE + 6,
    SB_CHAT_LIST                 : SB_BASE + 7,
    SB_CHAT_NOLIST               : SB_BASE + 8,
    SB_CHAT_USER_CHANGE          : SB_BASE + 10,
    SB_NO_CHATTING               : SB_BASE + 11,

    // 채팅구분
    CHAT_DATA_BASE               : CHAT_DATA_BASE,
    CHAT_DATA_LINE               : 0,
    CHAT_DATA_READ_OK            : CHAT_DATA_BASE + 31,
    CHAT_DATA_INVITE_OK          : CHAT_DATA_BASE + 32,
    CHAT_RECV_FILE               : CHAT_DATA_BASE + 35,
    CHAT_SEND_FILE               : CHAT_DATA_BASE + 36,

});