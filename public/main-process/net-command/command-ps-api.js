const { sendLog } = require('../ipc/ipc-cmd-sender');

const CommandHeader = require('./command-header');
const CmdCodes = require('./command-code');
const CmdConst = require('./command-const');
const psCore = require('../net-core/network-ps-core');


/**
 * 서버로 접속요청 합니다.
 */
function reqconnectPS () {
    psCore.connectPS().then(function() {
        sendLog('PS Connect Success!');
    }).catch(function(err){
        sendLog('PS Connect fale!' + JSON.stringify(err));
    })
}

/**
 * 연결을 종료합니다.
 */
function close() {
    psCore.close();
}

function reqGetCondition(userId) {
    return new Promise(async function(resolve, reject) {

        if (!global.SERVER_INFO.PS.isConnected) {
            await psCore.connectPS();
        }

        if (!global.SERVER_INFO.PS.isConnected) {
            reject(new Error('PS IS NOT CONNECTED!'));
            return;
        }

        if (!userId) {
            reject(new Error('userId Empty!'));
            return;
        }

        let idData = 'ID' + CmdConst.PIPE_SEP + userId;
        var dataBuf = Buffer.from(idData, global.ENC);

        console.log('PS_GET_CONDICTION ------  ', idData)
        psCore.writeCommandPS(new CommandHeader(CmdCodes.PS_GET_CONDICTION, 0, function(resData){
            resolve(resData);
        }), dataBuf);
    });
}

/**
 * 조직도 그룹을 요청합니다.
 * @param {String} userPass 
 */
function reqGetOrganization(groupCode) {
    return new Promise(async function(resolve, reject) {

        if (!global.SERVER_INFO.PS.isConnected) {
            await psCore.connectPS();
        }

        if (!global.SERVER_INFO.PS.isConnected) {
            reject(new Error('PS IS NOT CONNECTED!'));
            return;
        }

        var orgGroupCodeBuf = Buffer.alloc(CmdConst.BUF_LEN_ORG_GROUP_CODE);
        var groupCodeBuf = Buffer.alloc(CmdConst.BUF_LEN_GROUP_CODE);
        var classIdBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);
        
        orgGroupCodeBuf.write(groupCode, global.ENC);

        var dataBuf = Buffer.concat([orgGroupCodeBuf, groupCodeBuf, classIdBuf]);
        psCore.writeCommandPS(new CommandHeader(CmdCodes.PS_GET_BASE_CLASS, 0, function(resData){
            resolve(resData);
        }), dataBuf);
    });
}


/**
 * 하위 그룹을 요청합니다.
 */
function reqGetOrgChild(orgGroupCode, groupCode, groupSeq) {
    return new Promise(async function(resolve, reject) {

        if (!global.SERVER_INFO.PS.isConnected) {
            await psCore.connectPS();
        }

        if (!global.SERVER_INFO.PS.isConnected) {
            reject(new Error('PS IS NOT CONNECTED!'));
            return;
        }

        console.log('reqGetOrgChild ----' , orgGroupCode, groupCode, groupSeq);

        var orgGroupCodeBuf = Buffer.alloc(CmdConst.BUF_LEN_ORG_GROUP_CODE);
        var groupCodeBuf = Buffer.alloc(CmdConst.BUF_LEN_GROUP_CODE);
        var classIdBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);
        
        orgGroupCodeBuf.write(orgGroupCode, global.ENC);
        groupCodeBuf.write(groupCode, global.ENC);
        classIdBuf.writeInt32LE(groupSeq);

        var dataBuf = Buffer.concat([orgGroupCodeBuf, groupCodeBuf, classIdBuf]);
        psCore.writeCommandPS(new CommandHeader(CmdCodes.PS_GET_CHILD_CLASS, 0, function(resData){
            resolve(resData);
        }), dataBuf);
    });
}

module.exports = {
    reqGetCondition: reqGetCondition,
    reqGetOrganization: reqGetOrganization,
    reqGetOrgChild: reqGetOrgChild,
    close: close
}
