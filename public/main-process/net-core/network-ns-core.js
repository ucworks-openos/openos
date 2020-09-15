const { sendLog } = require('../ipc/ipc-cmd-sender');
const { receiveCmdProc } = require('../net-command/command-ns-res');

const CommandHeader = require('../net-command/command-header');
const ResData = require('../ResData');
const CmdConst = require('../net-command/command-const');
const CmdCodes = require('../net-command/command-code');
const { adjustBufferMultiple4 } = require('../utils/utils-buffer');

var nsSock;
var rcvCommand;

/**
 * NS는 연결 유지형으로 Connection Check가 적용
 * 
 */

 /**
  * 서버 접속
  */
function connect () {
    
    if (nsSock) {
        nsSock.destroy();
    }
    
    sendLog("Conncect MAIN_NS to " + JSON.stringify(global.SITE_CONFIG, null, 0))

    return new Promise(function(resolve, reject){
        var tcpSock = require('net');  
        var client  = new tcpSock.Socket;  
        nsSock = client.connect(global.SERVER_INFO.NS.port, global.SERVER_INFO.NS.pubip, function() {
            sendLog("Conncect MAIN_NS Completed to " + JSON.stringify(global.SERVER_INFO.NS, null, 0))
            global.SERVER_INFO.NS.isConnected = true;

            startConnectionCheck()
    
            resolve(new ResData(true));
        });  
    
        // listen for incoming data
        nsSock.on("data", function(data){
            readDataStream(data);
        })
    
        // 접속이 종료됬을때 메시지 출력
        nsSock.on('end', function(){
            sendLog('NS Disconnected!');
            global.SERVER_INFO.NS.isConnected = false;

            // 연결이 종료되면 Connectin Check를 멈춘다.
            clearInterval(global.NS_CONN_CHECK);   
        });
        // 
        nsSock.on('close', function(hadError){
            sendLog("NS Close. hadError: " + hadError);
            global.SERVER_INFO.NS.isConnected = false;
        });
        // 에러가 발생할때 에러메시지 화면에 출력
        nsSock.on('error', function(err){
            sendLog("NS Error: " + JSON.stringify(err));
            
            // 연결이 안되었는데 에러난것은 연결시도중 발생한 에러라 판당한다.
            if (!global.SERVER_INFO.NS.isConnected) {
                reject(err);
            } else {
                global.SERVER_INFO.NS.isConnected = false;
            }
            
        });
        // connection에서 timeout이 발생하면 메시지 출력
        nsSock.on('timeout', function(){
            sendLog('NS Connection timeout.');
            global.SERVER_INFO.NS.isConnected = false;
        });
    });
};

/**
 * 종료
 */
function close() {
    if (nsSock) {
        nsSock.destroy();
    }
}

/**
 * 수신된 데이터를 Command형식으로 변환 합니다.
 * @param {Buffer}} rcvData 
 */
function readDataStream(rcvData){  
    let dataBuff = rcvData;

    //console.log('\r\n++++++++++++++++++++++++++++++++++');
    //console.log('NS rcvData:', rcvData.toString('hex', 0));
    // sendLog('NS rcvData Str:', rcvData.toString('utf-8', 0))
    // sendLog('NS rcvData Hex:', rcvData.toString('hex', 0))

    if (!rcvCommand){
        // 수신된 CommandHeader가 없다면 헤더를 만든다.
        rcvCommand = new CommandHeader(rcvData.readInt32LE(0), rcvData.readInt32LE(4));
        rcvCommand.readCnt = 8;

        rcvCommand.data = Buffer.alloc(0);
        dataBuff = dataBuff.subarray(8); // 받은 헤더를 잘라낸다.

        // 응답을 요구하는 콜백처리가 있는경우에만 처리한다.
        if (global.NS_SEND_COMMAND && global.NS_SEND_COMMAND.callback) {
             rcvCommand.sendCmd = global.NS_SEND_COMMAND
        }
    }

    // 받은 데이터가 전문의 길이 값보다 더크다면 다음 커맨드가 붙어왔을수 있다.
     console.log('rcvCommand ----------------------', rcvCommand)
     console.log('recvData : data Size  -----------------', rcvData.length , dataBuff.length)

    // 기존데이터 + 받은 데이터 길이가 사이즈보다 넘는다면, 이후 커맨드까지 같이 받은것이다.
    if (rcvCommand.readCnt + dataBuff.length > rcvCommand.size) {

        let moreReadLen = rcvCommand.size - (rcvCommand.data.length + 8);
        rcvCommand.data = Buffer.concat([rcvCommand.data, dataBuff.subarray(0, moreReadLen)]);
        rcvCommand.readCnt += moreReadLen;
        
        var procCmd = rcvCommand;
        rcvCommand = null; // 처리시간동안 수신데이터가 오면 엉킴
        global.NS_SEND_COMMAND = null;

        //console.log(' >> Recived NS Command Data more :', procCmd);
        if (!receiveCmdProc(procCmd)) {
            console.log('Revceive NS Data Proc Fail! :', rcvData.toString('utf-8', 0));
        }

        // 새로 전문을 받는다.
        dataBuff = dataBuff.subarray(moreReadLen)
        readDataStream(dataBuff)
        return;
    } else {
        rcvCommand.data = Buffer.concat([rcvCommand.data, dataBuff]);
        rcvCommand.readCnt += dataBuff.length;
    }    
        
    //console.log('rcvCommand.readCnt : Command.Size : rcvCommand.readCnt  -----------------', rcvData.length , dataBuff.length, rcvCommand.readCnt)
    if (rcvCommand.size <= rcvCommand.readCnt) {
        // 데이터를 모두 다 받았다.
        var procCmd = rcvCommand;
        rcvCommand = null; // 처리시간동안 수신데이터가 오면 엉킴
        global.NS_SEND_COMMAND = null;

        //console.log(' >> Recived NS Command Data :', procCmd);
        if (!receiveCmdProc(procCmd)) {
            sendLog('Revceive NS Data Proc Fail! :', rcvData.toString('utf-8', 0));
        }
    } else {
        // console.log('\r\n >> Reading data ..........................');
        // console.log('NS rcvData:', rcvData);
        // console.log('NS rcvData toStr:', rcvData.toString('utf-8', 0));
    }
};

/**
 * 서버로 해당 Command를 보냅니다.
 *
 * @param {CommandHeader} cmdHeader 
 * @param {Buffer} dataBuf 
 */
function writeCommand(cmdHeader, dataBuf = null, resetConnCheck = true) {
    //try {
        rcvCommand = null;
        global.NS_SEND_COMMAND = null;
        // Header Buffer
        var codeBuf = Buffer.alloc(4);
        var sizeBuf = Buffer.alloc(4);

        if (!dataBuf)
            dataBuf = Buffer.alloc(0);

        // Full Data Buffer
        var cmdBuf = Buffer.concat([codeBuf, sizeBuf, dataBuf]);
        cmdBuf = adjustBufferMultiple4(cmdBuf);
        
        // Command Code
        codeBuf.writeInt32LE(cmdHeader.cmdCode);
        codeBuf.copy(cmdBuf);

        // full Size
        cmdHeader.size = cmdBuf.length;
        sizeBuf.writeInt32LE(cmdHeader.size);
        sizeBuf.copy(cmdBuf, 4, 0);

        nsSock.write(cmdBuf);
        global.NS_SEND_COMMAND = cmdHeader

        if (resetConnCheck) startConnectionCheck();
        
        //console.log('\r\n-------------------------- ');
        sendLog("\r\nwrite NS Command ------ CMD: " + JSON.stringify(global.NS_SEND_COMMAND));
        //console.log("write NS Command : ", global.NS_SEND_COMMAND);
    // } catch (exception) {
    //     sendLog("write NS Command FAIL! CMD: " + cmdHeader.cmdCode + " ex: " + exception);
    // }
 };


function startConnectionCheck() {
    if (global.NS_CONN_CHECK) {
        clearInterval(global.NS_CONN_CHECK);
    }
    
    global.NS_CONN_CHECK = setInterval(function() {
        if (global.SERVER_INFO.NS.isConnected) {
            // send connection check.
            writeCommand(new CommandHeader(CmdCodes.CONNECTION_CHECK, 0), null, false);
        } else {
            clearInterval(global.NS_CONN_CHECK);
        }
    }, CmdConst.SESSION_CHECK_INTERVAL);

    sendLog('STATR_NS_CONNECTION_CHECK.')
}


module.exports = {
    connectNS: connect,
    writeCommandNS: writeCommand,
    close: close
};