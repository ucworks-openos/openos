const logger = require('../../logger')

const CommandHeader = require('./command-header');
const CmdCodes = require('./command-code');
const CmdConst = require('./command-const');
const CryptoUtil = require('../utils/utils-crypto')
const csAPI = require('../net-core/network-cs-core');

/**
 * 연결을 종료합니다.
 */
function close() {
    csAPI.close();
}

/**
 * 서버로 접속요청 합니다.
 */
function reqconnectCS () {
    csAPI.connectCS().then(function() {
        logger.info('CS Connect Success!');
    }).catch(function(err){
        logger.error('CS Connect fale!' + JSON.stringify(err));
    })

}

/**
 * 사용자 인증을 요청합니다.
 * @param {String} userPass 
 */
function reqCertifyCS(loginId, loginPass) {
    return new Promise(function(resolve, reject) {

        if (!global.SERVER_INFO.CS.isConnected) {
            csAPI.connectCS();
        }

        var cipherPwd = loginPass;
        switch(global.ENCRYPT.pwdAlgorithm.toUpperCase()) {
            case 'RC4' :
                cipherPwd = CryptoUtil.encryptRC4(global.ENCRYPT.pwdCryptKey, loginPass)
                break;
            default:
                logger.error('Unknown PWD Algorithm :' + global.ENCRYPT.pwdAlgorithm);
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
        csAPI.writeCommandCS(new CommandHeader(CmdCodes.CS_CERTIFY, 0, function(resData){
            resolve(resData);
        }), dataBuf);
    });

}

module.exports = {
    reqconnectCS: reqconnectCS,
    reqCertifyCS: reqCertifyCS,
    close: close
}
