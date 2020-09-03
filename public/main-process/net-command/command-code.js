const CommandHeader = require("./command-header");

const DS_BASE = 3000;
const NS_BASE = 4000;
const PS_BASE = 6000;
const CS_BASE = 13000;

module.exports = Object.freeze({
    CONNECTION_CHECK            : 0,

    //
    //#region DS COMMAND
    DS_BASE               : DS_BASE,
    DS_HANDSHAKE          : DS_BASE + 300,
    DS_SET_SESSION        : DS_BASE + 303,

    DS_SUCCESS            : DS_BASE + 3,
    DS_NO_USERID          : DS_BASE + 4,
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
    NS_UNREADALL_COUNT           : NS_BASE + 262,
    NS_SERVER_BUSY               : NS_BASE + 999,
    NS_SERVER_CLOSE              : NS_BASE + 998,

    //#endregion
});