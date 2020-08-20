const DS_BASE = 3000;

module.exports = Object.freeze({
    DS_HANDSHAKE:           DS_BASE + 300,
    DS_SET_SESSION:         DS_BASE + 303,

    DS_SUCCESS:             DS_BASE + 3,
    DS_NO_USERID:           DS_BASE + 4,
    DS_UPGRADE_CHECK:       DS_BASE + 91,
    DS_UPGRADE_CHANGE:      DS_BASE + 92,
    DS_GET_SERVER_INFO:     DS_BASE + 93,
    DS_GET_RULES:           DS_BASE + 94,
});