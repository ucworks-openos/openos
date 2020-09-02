var crypto = require('crypto');
const { sendLog } = require('../ipc/ipc-cmd-sender');

/**
 * 지정된 길이의 임의 비밀번호를 발생합니다.
 * @param {Integer} len 
 */
function randomPassword(len) {
    let pwdStr = '';

    let seedChar = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';

    for(let i = 0; i < len; i++) {
        let charInx = Math.floor(Math.random() * (seedChar.length));
        pwdStr += seedChar.charAt(charInx);
    }

    return pwdStr;
}


//#region RC4
/**
 * RC4 알고이즘으로 람호화 합니다.
 * @param {String} key 
 * @param {String} text 
 */
function encryptRC4(key, text) {
    try {
        //var keyHash = crypto.createHash('sha256').update(key).digest();
        var keyHash = Buffer.from(key, global.ENC);
        var cipher = crypto.createCipheriv('rc4', keyHash,'');
        return cipher.update(text, 'utf8', 'hex');
    } catch (err) {
        console.log('encryptRC4 Err! ', key, text, err);
        sendLog('encryptRC4 Ex', err);
    }
    
    return '';
}
/**
 * RC4 암호 문자열을 복호화 합니다.
 * @param {String}} key 
 * @param {String} ciphertext 
 */
function decryptRC4(key, ciphertext) {
    //var keyHash = crypto.createHash('sha256').update(key).digest();
    var keyHash = Buffer.from(key, global.ENC);
    var decipher = crypto.createDecipheriv('rc4', keyHash,'' );
    var text = decipher.update( ciphertext, 'hex','utf8');
    return text;
}
//#endregion RC4


//#region AES256
/**
 * AES256 방식으로 Encrypt 합니다.
 * @param {String} key 
 * @param {String} text 
 */
function encryptAES256(key, text) {
    // Key length is dependent on the algorithm. In this case for aes256, it is
    // 32 bytes (256 bits).
    //const keyHash = crypto.scryptSync(key, 'salt', 32);
    //const iv = Buffer.alloc(16, 0);
    const keyHash = Buffer.from(key, global.ENC);
    const iv = Buffer.alloc(16, key, global.ENC);


    var cipher = crypto.createCipheriv('aes-256-cbc', keyHash, iv);
    cipher.setAutoPadding(true)
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
  
    // let buf1 = cipher.update(text)
    // let buf2 = cipher.final()
    //let encBuf = Buffer.concat([buf1, buf2]);
    //let encrypted = encBuf.toString('base64')

    return encrypted;
}

/**
 * AES256 방식으로 Decoding 합니다.
 * @param {String} key 
 * @param {String} ciphertext 
 */
function decryptAES256(key, ciphertext) {
    // Key length is dependent on the algorithm. In this case for aes192, it is
    // 32 bytes (256 bits).
    //const keyHash = crypto.scryptSync(key, 'salt', 32);
    //const iv = Buffer.alloc(16, 0);
    const keyHash = Buffer.from(key, global.ENC);
    const iv = Buffer.alloc(16, key, global.ENC);

    var decipher  = crypto.createDecipheriv('aes-256-cbc', keyHash, iv);
    decipher.setAutoPadding(true)
    
    //ciphertext = Buffer.from(ciphertext, 'base64').toString('utf8');
    let decrypted = decipher.update(ciphertext, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}
//#endregion AES256
    
//
// exports
module.exports = {
    randomPassword: randomPassword,
    encryptRC4: encryptRC4,
    decryptRC4: decryptRC4,
    encryptAES256: encryptAES256,
    decryptAES256: decryptAES256
}
