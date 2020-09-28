function CommandHeader(cmdCode, size, callback = null) {
    this.cmdCode = cmdCode;
    this.size = size;
    
    if (callback) {
        this.callback = callback;
    }
}

var proto = CommandHeader.prototype;

/**
 * 요청에 대한 응답길이를 지정할때 사용한다.
 *   { 파일처리에서는 헤더 사이즈가 없거나 다른 용도로 사용되는 경우가 있음 }
 * @param {Number} resLength 
 */
proto.setResponseLength = function(resLength){
    this.responseLength = resLength;
};

/**
 * 요청에 대한 응답길이를 가져옵니다.
 */
proto.getResponseLength = function() {
    // 지정되지 않았다면 전문사이즈를 돌려준다.
    if (!this.responseLength) return 0;
    return this.responseLength;
};

/**
 * Tag를 설정합니다.
 */
proto.addReadCount = function(readCnt){
    if (this.readCnt) this.readCnt += readCnt;
    else this.readCnt = readCnt;
};

/**
 * Tag를 가져옵니다.
 */
proto.getReadCount = function() {
    return this.readCnt?this.readCnt:0;
};

/**
 * Tag를 설정합니다.
 */
proto.setTag = function(tag){
    this.tag = tag;
};

/**
 * Tag를 가져옵니다.
 */
proto.getTag = function() {
    return this.tag;
};



module.exports = CommandHeader;
