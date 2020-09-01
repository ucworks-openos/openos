
/** description
 *  Main -> Randerer으로 응답을 줄때 쓰이는 포멧.
 *  Reanderer로 데이터를 보낼시 항상 사용하도록 한다.
 */


/**
 * 
 * @param {ipc-command-code} actionCode 
 * @param {Nuber} resCode  // resCde>0:Sucess 0:fail (-1, -2 ...)
 * @param {Object} data  // msg:'Unknown code!'
 */
function IPC_Header(actionCode, resCode, data = '') {
    this.actionCode = actionCode;
    this.resCode = resCode;
    
    if (data) {
        this.data = data;
    }
}

module.exports = IPC_Header;
