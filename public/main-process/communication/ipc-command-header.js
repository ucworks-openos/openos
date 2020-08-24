
/** description
 *  Main -> Randerer으로 응답을 줄때 쓰이는 포멧.
 *  Reanderer로 데이터를 보낼시 항상 사용하도록 한다.
 */


/**
 * 
 * @param {ipc-command-code} ipcCommand 
 * @param {Nuber} resCode  // resCde>0:Sucess 0:fail (-1, -2 ...)
 * @param {Object} data  // msg:'Unknown code!'
 */
function IPC_Header(ipcCommand, resCode, data = '') {
    this.ipcCommand = ipcCommand;
    this.resCode = resCode;
    
    if (data) {
        this.data = data;
    }
}

module.exports = CommandHeader;
