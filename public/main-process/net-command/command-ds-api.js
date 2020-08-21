const { connectDS, writeCommandDS } = require('../net-core/network-ds-core');
const { writeMainProcLog } = require('../communication/sync-msg');

var CsAPI = require('./command-cs-api');
var CommandHeader = require('./command-header');
var CommandCodes = require('./command-code');
var CmdConst = require('./command-const');
var OsUtil = require('../utils/utils-os');


function testFunction () {
    var num = 5;
    writeMainProcLog(num.toString().padStart(5, '0'));
}

/**
 * 서버로 접속요청 합니다.
 */
function reqConnectDS () {
    connectDS(function() {
        console.log('!!!!!!!!!!!!!!!!!!!!!  CONNECTED');
    });
}

/**
 * 서버와 통신가능여부를 확인 합니다. 
 * @param {String} userId 
 */
function reqHandshackDS (userId, callback) {
    
    // 1.보안키를 받아오고
    var idBuf = Buffer.alloc(CmdConst.BUF_LEN_USERID);
    idBuf.write(userId, global.ENC);

    var pukCertKeyBuf = Buffer.alloc(CmdConst.BUF_LEN_PUKCERTKEY);
    var challengeBuf = Buffer.alloc(CmdConst.BUF_LEN_CHALLENGE);
    var sessionBuf = Buffer.alloc(CmdConst.BUF_LEN_SESSION);

    var dataBuf = Buffer.concat([idBuf, pukCertKeyBuf, challengeBuf, sessionBuf]);
    writeCommandDS(new CommandHeader(CommandCodes.DS_HANDSHAKE, 0, callback), dataBuf);

}

async function reqSetSessionDS(userId, callback) {

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
     writeCommandDS(new CommandHeader(CommandCodes.DS_SET_SESSION, 0, callback), dataBuf);

     // 응답없음. 보내고 끝냄
     callback('')
}

function reqLogin (loginData, connectionTry=true) {

    // connect
    if (connectionTry && !global.SERVER_INFO.DS.isConnected) {
        connectDS(function() {
            reqLogin(loginData, false)
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
    reqGetServerInfo(loginData.loginId, function(cmd) {
        writeMainProcLog('LOG IN PROCESS --- reqGetServerInfo COMPLETED!');        

        // getUserRules
        reqGetUserRules(loginData.loginId, loginData.loginPwd, function(cmd) {
            writeMainProcLog('LOG IN PROCESS --- reqGetUserRules COMPLETED!');    
            global.USER.userId = loginData.loginId;

            // HANDSHAKE
            reqHandshackDS(loginData.loginId, function(cmd) {
                writeMainProcLog('LOG IN PROCESS --- reqHandshackDS COMPLETED!');

                // SetSession
                reqSetSessionDS(loginData.loginId, function(cmd) {
                    writeMainProcLog('LOG IN PROCESS --- reqSetSessionDS COMPLETED!');
                   
                    CsAPI.reqCertifyCS(loginData.loginPwd, function(cmd) {
                        writeMainProcLog('LOG IN PROCESS --- reqCertifyCS COMPLETED!');
                        
                        reqGetUserContacts(loginData.loginId, function(cmd) {
                            writeMainProcLog('LOG IN PROCESS --- reqGetUserContacts COMPLETED!');
                        })
                    });
                })
                 
             });
        });
    });
}


/**
 * 사용자 Rule 정보를 요청합니다.
 */
async function reqGetUserRules(userId, userPwd, callback) {

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
    writeCommandDS(new CommandHeader(CommandCodes.DS_GET_RULES, 0, callback), dataBuf);
}

/**
 * 서버정보를 받아옵니다. (ServerUpgradeInfo 와 다름)
 * @param {String} userId 
 * @param {Function} callback 
 */
function reqGetServerInfo(userId, callback) {

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
    writeCommandDS(cmdHeader, dataBuf);
}

/**
 * 서버로 업그레이드 정보를 확인합니다. 
 * 응답을 서버정보를 주나 ServerInfo와는 다름
 */
function reqUpgradeCheckDS () {
    var serverSizeBuf = Buffer.alloc(CmdConst.BUF_LEN_INT); // ?

    var versionStr = global.SITE_CONFIG.version + CmdConst.CMD_SEP + global.SITE_CONFIG.server_ip;
    var dataBuf = Buffer.concat([serverSizeBuf, Buffer.from(versionStr, "utf-8")]);
    
    writeCommandDS(new CommandHeader(CommandCodes.DS_UPGRADE_CHECK, 0), dataBuf);
}

/**
 * 즐겨찾기 정보를 요청합니다.
 * @param {String} userId 
 * @param {Function} callback 
 */
function reqGetUserContacts(userId, callback) {

    var idBuf = Buffer.alloc(CmdConst.BUF_LEN_USERID);
    idBuf.write(userId, global.ENC);
    writeCommandDS(new CommandHeader(CommandCodes.DS_GET_BUDDY_DATA, 0, callback), idBuf);
}


module.exports = {
    testFunction: testFunction,
    reqConnectDS: reqConnectDS,
    reqHandshackDS: reqHandshackDS,
    reqLogin: reqLogin,
    reqUpgradeCheckDS: reqUpgradeCheckDS,
    
}
