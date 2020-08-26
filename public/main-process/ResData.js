/**
 * 모든 응답형식에 사용되는 Data
 * @param {Object} resCode  //
 * @param {Object} data  // msg:'Unknown code!'
 */
function ResData(resCode, data = '') {
    this.resCode = resCode;
    
    if (data) {
        this.data = data;
    }
}

module.exports = ResData;