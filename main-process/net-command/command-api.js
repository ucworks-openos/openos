const { connect_MAIN_DS, writeCommand_MAIN_DS } = require('../net-core/network-ds-core');
const { writeMainProcLog } = require('../communication/sync-msg');
//const { CommandHeader } = require('./command-header');
var CommandHeader = require('./command-header');
var CommandCodes = require('./command-code');
var CmdConst = require('./command-const');
var OsUtil = require('../utils/utils-os');


function TEST_FUNCTION () {

    var num = 5;
    writeMainProcLog(num.toString().padStart(5, '0'));

}

/**
 * 서버로 접속요청 합니다.
 */
function DS_CONNECT () {
    connect_MAIN_DS(function() {
        console.log('!!!!!!!!!!!!!!!!!!!!!  CONNECTED');
    });
}

/**
 * 서버와 통신가능여부를 확인 합니다. 
 * @param {UserID} userId 
 */
function req_DS_HANDSHAKE (userId, callback) {
    
    // 1.보안키를 받아오고
    var idBuf = Buffer.alloc(CmdConst.BUF_LEN_USERID);
    idBuf.write(userId, global.ENC);

    var pukCertKeyBuf = Buffer.alloc(CmdConst.BUF_LEN_PUKCERTKEY);
    var challengeBuf = Buffer.alloc(CmdConst.BUF_LEN_CHALLENGE);
    var sessionBuf = Buffer.alloc(CmdConst.BUF_LEN_SESSION);

    var dataBuf = Buffer.concat([idBuf, pukCertKeyBuf, challengeBuf, sessionBuf]);
    writeCommand_MAIN_DS(new CommandHeader(CommandCodes.DS_HANDSHAKE, 0, callback), dataBuf);

}

async function req_DS_SET_SESSION(userId, callback) {

    console.log('SET_SESSION CertInfo:', global.CERT);

    // 2.세션정보 저장요청을 한다.
    let localInfo = OsUtil.getIpAddress() + CmdConst.CMD_SEP + await OsUtil.getMacAddress();
    var localInfoBuf = Buffer.alloc(localInfo.length);
    localInfoBuf.write(localInfo, global.ENC);

    var idBuf = Buffer.alloc(CmdConst.BUF_LEN_USERID);
    idBuf.write(userId, global.ENC);

    var pukCertKeyBuf = Buffer.alloc(CmdConst.BUF_LEN_PUKCERTKEY);
    pukCertKeyBuf.write(global.CERT.pukCertKey, global.ENC);
    
    var challengeBuf = Buffer.alloc(CmdConst.BUF_LEN_CHALLENGE);
    challengeBuf.write(global.CERT.challenge, global.ENC);
    
    var sessionBuf = Buffer.alloc(CmdConst.BUF_LEN_SESSION);
    sessionBuf.write(global.CERT.session, global.ENC);

     var dataBuf = Buffer.concat([idBuf, pukCertKeyBuf, challengeBuf, sessionBuf, localInfoBuf]);
     writeCommand_MAIN_DS(new CommandHeader(CommandCodes.DS_SET_SESSION, 0, callback), dataBuf);

     // 응답없음. 보내고 끝냄
     callback('')
}

function req_DS_LOGIN (loginData, connectionTry=true) {

    // connect
    if (connectionTry && !global.SERVER_INFO.DS.isConnected) {
        connect_MAIN_DS(function() {
            req_DS_LOGIN(loginData, userPass, false)
        });
        return ;
    }

    if (!global.SERVER_INFO.DS.isConnected) 
    {
        writeMainProcLog('DS Server Not Connected!');
        return;
    }

    writeMainProcLog('--  START LOGIN --');

    // getServerInfo
    req_DS_getServerInfo(loginData.loginId, function(cmd) {
        writeMainProcLog('LOG IN PROCESS --- req_DS_getServerInfo COMPLETED!');        

        // getUserRules
        req_DS_getUserRules(loginData.loginId, loginData.loginPwd, function(cmd) {
            writeMainProcLog('LOG IN PROCESS --- req_DS_getUserRules COMPLETED!');    

            global.USER.userId = loginData.loginId;
            // HANDSHAKE
             req_DS_HANDSHAKE(loginData.loginId, function(cmd) {
                 writeMainProcLog('LOG IN PROCESS --- req_DS_HANDSHAKE COMPLETED!');

                 req_DS_SET_SESSION(loginData.loginId, function(cmd) {
                    writeMainProcLog('LOG IN PROCESS --- req_DS_SET_SESSION COMPLETED!');
                    req_DS_certifyUser(loginData.loginPwd);
                 })
                 
             });
        });
    });
}

function req_DS_certifyUser(userPass, callback) {
    writeMainProcLog('LOG IN PROCESS --- CALL req_DS_certifyUser!');

    var idBuf = Buffer.alloc(CmdConst.BUF_LEN_USERID);
    var dnBuf = Buffer.alloc(CmdConst.BUF_LEN_USERDN);

    userPass.charCodeAt(0)

    var certXml = '<cert> '+
                '<auth_kind>' + '' + '</auth_kind> ' +
                '<method>' + '347' + '</method> ' +
                '<otp>' + 'NO' + '</otp> ' +
                '<pwd>' + FL_password + '</pwd> ' +
                '<mobile>' +
                '</mobile> ' +
                '</cert>';


}


/**
 * 사용자 Rule 정보를 요청합니다.
 */
async function req_DS_getUserRules(userId, userPwd, callback) {

    var idBuf = Buffer.alloc(CmdConst.BUF_LEN_USERID);
    var passBuf = Buffer.alloc(CmdConst.BUF_LEN_USERPWD);
    var connIpBuf = Buffer.alloc(CmdConst.BUF_LEN_IP);
    var svrSize = Buffer.alloc(CmdConst.BUF_LEN_INT);
    var ruleSize = Buffer.alloc(CmdConst.BUF_LEN_INT);

    idBuf.write(userId, global.ENC);
    passBuf.write(userPwd, global.ENC);

    let localInfo = OsUtil.getIpAddress() + CmdConst.CMD_SEP + await OsUtil.getMacAddress();
    console.log('-------  MAC ADDRESS', localInfo)

    //FC_local_ip + SEP + FC_local_mac_addr
    connIpBuf.write(localInfo, global.ENC);
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

    
    var dataBuf = Buffer.from(data, "utf-8");
    var serverSizeBuf = Buffer.alloc(4); // ?
    serverSizeBuf.writeInt32LE(dataBuf.length);

    dataBuf = Buffer.concat([serverSizeBuf, dataBuf]);
    
    let cmdHeader = new CommandHeader(CommandCodes.DS_GET_SERVER_INFO, 0, callback);
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
    req_DS_LOGIN: req_DS_LOGIN,
    req_DS_UPGRADE_CHECK: req_DS_UPGRADE_CHECK,
    TEST_FUNCTION: TEST_FUNCTION
}
