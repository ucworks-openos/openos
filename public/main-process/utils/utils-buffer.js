const winston = require('../../winston');
const CommandHeader = require('../net-command/command-header');


/**
 * 문자열 끝 코드를 제외하고 문자열을 가져옵니다. 
 */
function getStringWithoutEndOfString(strBuf, sInx = 0, readLength = -1, encoding = global.ENC) {
    if (!strBuf) return '';

    let eInx = strBuf.length;

    // readLength가 있다면 해당 길이만큼만 읽는다.
    if (readLength > 0) eInx = sInx+readLength;

    let tempBuf = strBuf.slice(sInx, eInx);
    let endOfStrInx = tempBuf.indexOf(0x00);
    
    if (endOfStrInx > 0) tempBuf = tempBuf.slice(0, endOfStrInx);

    return tempBuf.toString(encoding);
}

/**
 * 버퍼의 길이를 4의 배수로 맞춥니다.
 * @param {Buffer} originBuf 
 */
function adjustBufferMultiple4(originBuf) {

    // Create Dummy Buffer. Set the length to a multiple of 4.
    var multiple4Len = getMultiple4Size(originBuf.length);
    if (multiple4Len != originBuf.length) {
        //winston.info("cmdBuf Diff size:" + (multiple4Len-cmdBuf.length) + ", DummySize:" + multiple4Len + ", BufferSize:" + cmdBuf.length);
        var dummyBuf = Buffer.alloc(multiple4Len-originBuf.length);
        originBuf = Buffer.concat([originBuf, dummyBuf]);
    }

    return originBuf;
}

/**
 * 해당 사이즈를 4의 배수로 맞춘다.
 * @param {int} size 
 */
function getMultiple4Size (size) {
    return Math.ceil(size/4)*4;
}

/**
 * 해당 사이즈를 4의 배수 차이를 가져옵니다.
 * @param {int} size 
 */
function getMultiple4DiffSize (size) {
    return (Math.ceil(size/4)*4) - size;
}


function getCommandHeader(dataBuf, readLength = 0) {
    if (dataBuf.length < 8) return dataBuf;

    let cmd = new CommandHeader(dataBuf.readInt32LE(0), dataBuf.readInt32LE(4));
    
    // 수신사이즈를 모른다면 헤더 정보를 활용한다.
    if (0 >= readLength) readLength = cmd.size;

    cmd.setResponseLength(readLength);

    let leftBuf;
    if (dataBuf.length > readLength) {
        cmd.data = dataBuf.subarray(8, readLength); // 헤더 길이는 뺸다.
        cmd.addReadCount(readLength); // Buf가 더 많음으로 읽는길이만큼 다 읽었다.

        leftBuf = dataBuf.subarray(readLength);

    } else {
        //cmd.data = dataBuf.slice(8);
        cmd.data = dataBuf.subarray(8);
        cmd.addReadCount(dataBuf.length);

        leftBuf = Buffer.alloc(0);
    }

    return {command:cmd, leftBuf:leftBuf}
}

    
module.exports = {
    getStringWithoutEndOfString: getStringWithoutEndOfString,
    adjustBufferMultiple4: adjustBufferMultiple4,
    getMultiple4Size: getMultiple4Size,
    getMultiple4DiffSize: getMultiple4DiffSize,
    getCommandHeader: getCommandHeader
}
