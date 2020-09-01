const { connectCS, writeCommandCS } = require('../net-core/network-cs-core');
const { sendLog } = require('../ipc/ipc-cmd-sender');

var CommandHeader = require('./command-header');
var CmdCodes = require('./command-code');
var CmdConst = require('./command-const');
var OsUtil = require('../utils/utils-os');
var CryptoUtil = require('../utils/utils-crypto')

/**
 * 서버로 접속요청 합니다.
 */
function reqconnectCS () {
    connectCS().then(function() {
        console.log('CS Connect Success!');
    }).catch(function(err){
        console.log('CS Connect fale!' + JSON.stringify(err));
    })

}

/**
 * 사용자 인증을 요청합니다.
 * @param {String} userPass 
 */
function reqCertifyCS(loginId, loginPass, connTry = true) {
    return new Promise(function(resolve, reject) {

        if (connTry && !global.SERVER_INFO.CS.isConnected) {
            connectCS();
        }

        var cipherPwd = loginPass;
        switch(global.ENCRYPT.pwdAlgorithm.toUpperCase()) {
            case 'RC4' :
                cipherPwd = CryptoUtil.encryptRC4(global.ENCRYPT.pwdCryptKey, loginPass)
                break;
            default:
                sendLog('Unknown PWD Algorithm :' + global.ENCRYPT.pwdAlgorithm);
                break;
        }

        var idBuf = Buffer.alloc(CmdConst.BUF_LEN_USERID);
        idBuf.write(loginId, global.ENC);

        var dnBuf = Buffer.alloc(CmdConst.BUF_LEN_USERDN);
        //idBuf.write(dn, global.ENC);

        var certXml = '<cert> '+
                    '<auth_kind>' + global.USER.authMethod + '</auth_kind> ' + // ServerInfo에서 가져옴 UserAuth.method    /BASE64
                    //'<method>' + '347' + '</method> ' +
                    '<method>' + global.ENCRYPT.pwdAlgorithm + '</method> ' + // RULE에서 가져옴 FUNC_ENCRYPT_3  RC4
                    '<otp>' + 'NO' + '</otp> ' +
                    '<pwd>' + cipherPwd + '</pwd> ' + // FL_password 우선 RC4 암호화로 받아온다.
                    '<mobile>' +
                    '</mobile> ' +
                    '</cert>';
                    
        var certBuf = Buffer.from(certXml, global.ENC);
        var dataBuf = Buffer.concat([idBuf, dnBuf, certBuf]);
        writeCommandCS(new CommandHeader(CmdCodes.CS_CERTIFY, 0, function(resData){
            resolve(resData);
        }), dataBuf);
    });

}

module.exports = {
    reqconnectCS: reqconnectCS,
    reqCertifyCS: reqCertifyCS
}
