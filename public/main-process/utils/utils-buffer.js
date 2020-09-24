

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
        //console.log("cmdBuf Diff size:" + (multiple4Len-cmdBuf.length) + ", DummySize:" + multiple4Len + ", BufferSize:" + cmdBuf.length);
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

    
module.exports = {
    getStringWithoutEndOfString: getStringWithoutEndOfString,
    adjustBufferMultiple4: adjustBufferMultiple4,
    getMultiple4Size: getMultiple4Size,
    getMultiple4DiffSize: getMultiple4DiffSize,
}
