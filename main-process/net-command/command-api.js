const { connectToServer, writeCommand } = require('../net-core/network-core');
//const { CommandHeader } = require('./command-header');
var CommandHeader = require('./command-header');
var CommandCodes = require('./command-code');

/**
 * 서버로 접속요청 합니다.
 */
function DS_CONNECT () {
    connectToServer(0);
}

/**
 * 서버와 통신가능여부를 확인 합니다. 
 * @param {UserID} userId 
 */
function req_DS_HANDSHAKE (userId) {
    
    var idBuf = Buffer.alloc(51);
    var len = idBuf.write(userId, "utf-8");

    var pukCertKeyBuf = Buffer.alloc(513);
    var challengeBuf = Buffer.alloc(33);
    var sessionBuf = Buffer.alloc(33);

    var dataBuf = Buffer.concat([idBuf, pukCertKeyBuf, challengeBuf, sessionBuf]);
    writeCommand(new CommandHeader(CommandCodes.DS_HANDSHAKE, 0), dataBuf);
}

/**
 * 서버로 업그레이드 정보를 확인합니다.
 */
function req_DS_UPGRADE_CHECK () {
    var serverSize = Buffer.alloc(4); // ?

    var versionStr = global.SITE_CONFIG.version + '|' + global.SITE_CONFIG.server_ip;
    var dataBuf = Buffer.concat([serverSize, Buffer.from(versionStr, "utf-8")]);
    
    writeCommand(new CommandHeader(CommandCodes.DS_UPGRADE_CHECK, 0), dataBuf);
}
     
module.exports = {
    DS_CONNECT: DS_CONNECT,
    req_DS_HANDSHAKE: req_DS_HANDSHAKE,
    req_DS_UPGRADE_CHECK: req_DS_UPGRADE_CHECK
}
