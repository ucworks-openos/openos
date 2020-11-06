
const OsUtil = require('../utils/utils-os');

let value1;
let value2;
let value3;

function funcTest(val1, val2) {
    logger.info('==========  funcTest before', value1, value2, value3)

    value1 = val1;
    value2 = val2;
    value3 = OsUtil.getUUID();
    logger.info('==========  funcTest before', value1, value2, value3)


    
}


// var proto = CommandHeader.prototype;

// /**
//  * 요청에 대한 응답길이를 지정할때 사용한다.
//  *   { 파일처리에서는 헤더 사이즈가 없거나 다른 용도로 사용되는 경우가 있음 }
//  * @param {Number} resLength 
//  */
// proto.setResponseLength = function(resLength){
//     this.responseLength = resLength;
// };

// /**
//  * 요청에 대한 응답길이를 가져옵니다.
//  */
// proto.getResponseLength = function() {
//     // 지정되지 않았다면 전문사이즈를 돌려준다.
//     if (!this.responseLength) return this.size;
//     return this.responseLength;
// };



module.exports = {
    funcTest: funcTest
};