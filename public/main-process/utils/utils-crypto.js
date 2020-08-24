
var crypto = require('crypto');

function encryptRC4(key, text) {
    //var keyHash = crypto.createHash('sha256').update(key).digest();
    var keyHash = Buffer.from(key, global.ENC);
    var cipher = crypto.createCipheriv('rc4', keyHash,'' );
    var ciphertext = cipher.update(text, 'utf8', 'hex');

    return ciphertext;
}

function decryptRC4(key, ciphertext) {
    //var keyHash = crypto.createHash('sha256').update(key).digest();
    var keyHash = Buffer.from(key, global.ENC);
    var decipher = crypto.createDecipheriv('rc4', keyHash,'' );
    var text = decipher.update( ciphertext, 'hex','utf8');
    return text;
}
    
module.exports = {
    encryptRC4: encryptRC4,
    decryptRC4: decryptRC4
}
