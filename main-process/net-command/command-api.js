const { connect_MAIN_DS, writeCommand_MAIN_DS } = require('../net-core/network-ds-core');
//const { CommandHeader } = require('./command-header');
var CommandHeader = require('./command-header');
var CommandCodes = require('./command-code');

/**
 * 서버로 접속요청 합니다.
 */
function DS_CONNECT () {
    connect_MAIN_DS(0);
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
    writeCommand_MAIN_DS(new CommandHeader(CommandCodes.DS_HANDSHAKE, 0), dataBuf);
}

function req_DS_LOGIN (userId, userPass) {
    // connect
    if (!global.SERVER_INFO.DS.isConnected) {
        connect_MAIN_DS(0);
    }

    // getServerInfo
    req_DS_getServerInfo(userId, function(cmd) {
        console.log("!!CALL_BACK!!!!");
        console.log(cmd);
    });

    // getUserRules

    // handshake
    // req_DS_HANDSHAKE(userId);

    // login (certify user)
}

function req_DS_getServerInfo(userId, callback) {

    var data =  userId + String.fromCharCode(13) +
                "PC-" + require("ip").address() + String.fromCharCode(13) +
                '' + String.fromCharCode(13) +
                '' + String.fromCharCode(13) +
                global.SERVER_INFO.DS.ip + String.fromCharCode(13) +
                'ALL';

    console.log("req_DS_getServerInfo: " + data);
    var dataBuf = Buffer.from(data, "utf-8");

    var serverSizeBuf = Buffer.alloc(4); // ?
    serverSizeBuf.writeInt32LE(dataBuf.length);

    dataBuf = Buffer.concat([serverSizeBuf, dataBuf]);
    
    let cmdHeader = new CommandHeader(CommandCodes.DS_UPGRADE_CHECK, 0);
    cmdHeader.callback = callback;
    writeCommand_MAIN_DS(cmdHeader, dataBuf);
}

/**
 * 서버로 업그레이드 정보를 확인합니다.
 */
function req_DS_UPGRADE_CHECK () {
    var serverSizeBuf = Buffer.alloc(4); // ?

    var versionStr = global.SITE_CONFIG.version + '|' + global.SITE_CONFIG.server_ip;
    var dataBuf = Buffer.concat([serverSizeBuf, Buffer.from(versionStr, "utf-8")]);
    
    writeCommand_MAIN_DS(new CommandHeader(CommandCodes.DS_UPGRADE_CHECK, 0), dataBuf);
}
     
module.exports = {
    DS_CONNECT: DS_CONNECT,
    req_DS_HANDSHAKE: req_DS_HANDSHAKE,
    req_DS_LOGIN:req_DS_LOGIN,
    req_DS_UPGRADE_CHECK: req_DS_UPGRADE_CHECK
}
