const DS_BASE = 3000;
const CS_BASE = 13000;

module.exports = Object.freeze({
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
    DS_GET_BUDDY_MEMORY_LZ       : DS_BASE + 601,
    DS_GET_BUDDY_MEMORY_LZO      : DS_BASE + 602,
    DS_GET_BUDDY_DATA            : DS_BASE + 20,
    DS_GET_BUDDY_DATA_LZ         : DS_BASE + 603,
    DS_GET_BUDDY_DATA_LZO        : DS_BASE + 604,
    DS_GET_BUDDY_DATA_OK         : DS_BASE + 21,

    
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
    CS_NOT_LOGIN_SSO_VERISIGN    : CS_BASE + 14
    //#endregion CS COMMAND
});