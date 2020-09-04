

/**
 * 문자열 끝 코드를 제외하고 문자열을 가져옵니다. 
 */
function getStringWithoutEndOfString(strBuf, sInx, eInx, encoding = global.ENC) {
    let tempBuf = strBuf.slice(sInx, eInx);
    let endOfStrInx = tempBuf.indexOf(0x00);  
    tempBuf = tempBuf.slice(0, endOfStrInx);
    return tempBuf.toString(encoding);
}

    
module.exports = {
    getStringWithoutEndOfString: getStringWithoutEndOfString,
}
