const { connectCS, writeCommandCS } = require('../net-core/network-cs-core');
const { writeMainProcLog } = require('../communication/sync-msg');

var CommandHeader = require('./command-header');
var CommandCodes = require('./command-code');
var CmdConst = require('./command-const');
var OsUtil = require('../utils/utils-os');

/**
 * TEST_CS_FUNCTION
 */
function testFunction () {
    var num = 5;
    writeMainProcLog(num.toString().padStart(5, '0'));
}

/**
 * 서버로 접속요청 합니다.
 */
function reqconnectCS () {
    connectCS(function() {
        console.log('CS CONNECTED !!!!!!!!!!!!!!!!!!!!!');
    });
}

/**
 * 사용자 인증을 요청합니다.
 * @param {String} userPass 
 * @param {Function} callback 
 */
function reqCertifyCS(userPass, callback) {
    writeMainProcLog('LOG IN PROCESS --- CALL req_DS_certifyUser!');

    var idBuf = Buffer.alloc(CmdConst.BUF_LEN_USERID);
    var dnBuf = Buffer.alloc(CmdConst.BUF_LEN_USERDN);

    userPass.charCodeAt(0)

    var certXml = '<cert> '+
                '<auth_kind>' + global.CERT.enc + '</auth_kind> ' + // ServerInfo에서 가져옴 UserAuth.method
                //'<method>' + '347' + '</method> ' +
                '<method>' + '' + '</method> ' + // RULE에서 가져옴 FUNC_ENCRYPT_3
                '<otp>' + 'NO' + '</otp> ' +
                '<pwd>' + '' + '</pwd> ' + // FL_password 우선 RC4 암호화로 받아온다.
                '<mobile>' +
                '</mobile> ' +
                '</cert>';
}

module.exports = {
    testFunction: testFunction,
    reqconnectCS: reqconnectCS,
    reqCertifyCS: reqCertifyCS
}
