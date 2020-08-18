const { connect_MAIN_DS, writeCommand_MAIN_DS } = require('../net-core/network-ds-core');
const { writeMainProcLog } = require('../communication/sync-msg');
//const { CommandHeader } = require('./command-header');
var CommandHeader = require('./command-header');
var CommandCodes = require('./command-code');
var CmdConst = require('./command-const')

var macaddress = require('macaddress');

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
function req_DS_HANDSHAKE (userId, callback) {
    
    var idBuf = Buffer.alloc(CmdConst.BUF_LEN_USERID);
    var len = idBuf.write(userId, global.ENC);

    var pukCertKeyBuf = Buffer.alloc(CmdConst.BUF_LEN_PUKCERTKEY);
    var challengeBuf = Buffer.alloc(CmdConst.BUF_LEN_CHALLENGE);
    var sessionBuf = Buffer.alloc(CmdConst.BUF_LEN_SESSION);

    var dataBuf = Buffer.concat([idBuf, pukCertKeyBuf, challengeBuf, sessionBuf]);
    writeCommand_MAIN_DS(new CommandHeader(CommandCodes.DS_HANDSHAKE, 0), dataBuf);
}

function req_DS_LOGIN (loginData, userPass) {

    // connect
    if (!global.SERVER_INFO.DS.isConnected) {
        connect_MAIN_DS(0);
    }

    // getServerInfo
    req_DS_getServerInfo(loginData.loginId, function(cmd) {
        writeMainProcLog('LOG IN PROCESS --- req_DS_getServerInfo COMPLETED!');        

        // getUserRules
        req_DS_getUserRules(loginData.loginId, loginData.loginPwd, function(cmd) {
            writeMainProcLog('LOG IN PROCESS --- req_DS_getUserRules COMPLETED!');    
            
            // HANDSHAKE
             req_DS_HANDSHAKE(loginData.loginId, function(cmd) {
                 writeMainProcLog('LOG IN PROCESS --- req_DS_HANDSHAKE COMPLETED!');

                 req_DS_certifyUser()
             });
        });
    });
}

function req_DS_getUserRules(userId, userPwd, callback) {

    var idBuf = Buffer.alloc(CmdConst.BUF_LEN_USERID);
    var passBuf = Buffer.alloc(CmdConst.BUF_LEN_USERPWD);
    var connIpBuf = Buffer.alloc(CmdConst.BUF_LEN_IP);
    var svrSize = Buffer.alloc(CmdConst.BUF_LEN_INT);
    var ruleSize = Buffer.alloc(CmdConst.BUF_LEN_INT);

    idBuf.write(userId, global.ENC);
    passBuf.write(userPwd, global.ENC);

    macaddress.one().then(function (mac) {

        let localInfo = require("ip").address() + CmdConst.CMD_SEP + mac;
        console.log('-------  MAC ADDRESS', localInfo)

        //FC_local_ip + SEP + FC_local_mac_addr
        connIpBuf.write(localInfo, global.ENC);
    });

    var dataBuf = Buffer.concat([idBuf, passBuf, connIpBuf, svrSize, ruleSize]);
    writeCommand_MAIN_DS(new CommandHeader(CommandCodes.DS_GET_RULES, 0, callback), dataBuf);

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
    var serverSizeBuf = Buffer.alloc(CmdConst.BUF_LEN_INT); // ?

    var versionStr = global.SITE_CONFIG.version + CmdConst.CMD_SEP + global.SITE_CONFIG.server_ip;
    var dataBuf = Buffer.concat([serverSizeBuf, Buffer.from(versionStr, "utf-8")]);
    
    writeCommand_MAIN_DS(new CommandHeader(CommandCodes.DS_UPGRADE_CHECK, 0), dataBuf);
}
     
module.exports = {
    DS_CONNECT: DS_CONNECT,
    req_DS_HANDSHAKE: req_DS_HANDSHAKE,
    req_DS_LOGIN:req_DS_LOGIN,
    req_DS_UPGRADE_CHECK: req_DS_UPGRADE_CHECK
}
