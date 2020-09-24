const { sendLog } = require('../ipc/ipc-cmd-sender');
const { responseCmdProc } = require('../net-command/command-fs-res');

const CommandHeader = require('../net-command/command-header');
const ResData = require('../ResData');
const CmdConst = require('../net-command/command-const');
const CmdCodes = require('../net-command/command-code');
const { adjustBufferMultiple4 } = require('../utils/utils-buffer');

var fsSock;
var rcvCommand;

/**
 * FS는 연결 비유지형으로 요청후 원하는 응답을 받으면 끊어 버린다.
 * 단, 응답이 오지 않는것도 있음으로 주의
 */


 /**
  * 서버 접속
  */
function connect () {
    
    if (fsSock) {
        fsSock.destroy();
    }
    
    sendLog("Conncect MAIN_FS to " + JSON.stringify(global.SERVER_INFO.FS, null, 0))

    return new Promise(function(resolve, reject){
        var tcpSock = require('net');  
        var client  = new tcpSock.Socket; 
         
        fsSock = client.connect(global.SERVER_INFO.FS.port, global.SERVER_INFO.FS.pubip, function() {
            sendLog("Conncect MAIN_FS Completed to " + JSON.stringify(global.SERVER_INFO.FS, null, 0))
            global.SERVER_INFO.FS.isConnected = true;

            resolve(new ResData(true));
        });  
    
        // listen for incoming data
        fsSock.on("data", function(data){
            readDataStream(data);
        })
        // 접속이 종료됬을때 메시지 출력
        fsSock.on('end', function(){
            sendLog('FS Disconnected!');
            global.SERVER_INFO.FS.isConnected = false;
        });
        // close
        fsSock.on('close', function(hadError){
            sendLog("FS Close. hadError: " + hadError);
            global.SERVER_INFO.FS.isConnected = false;
        });
        // 에러가 발생할때 에러메시지 화면에 출력
        fsSock.on('error', function(err){
            sendLog("FS Error: " + JSON.stringify(err));
            
            // 연결이 안되었는데 에러난것은 연결시도중 발생한 에러라 판당한다.
            if (!global.SERVER_INFO.FS.isConnected) {
                reject(err);
            } else {
                global.SERVER_INFO.FS.isConnected = false;
            }
        });
        // connection에서 timeout이 발생하면 메시지 출력
        fsSock.on('timeout', function(){
            sendLog('FS Connection timeout.');
            global.SERVER_INFO.FS.isConnected = false;
        });
    });
};

/**
 * 종료
 */
function close() {
    if (fsSock) {
        fsSock.destroy();
    }
}

/**
 * 수신된 데이터를 Command형식으로 변환 합니다.
 * @param {Buffer}} rcvData 
 */
function readDataStream(rcvData){  
    console.log('\r\n++++++++++++++++++++++++++++++++++');
    console.log('FS rcvData:', rcvData);

    if (!rcvCommand){
        // 수신된 CommandHeader가 없다면 헤더를 만든다.
        rcvCommand = new CommandHeader(rcvData.readInt32LE(0), rcvData.readInt32LE(4));

        rcvCommand.data = rcvData.subarray(8);
        if (global.FS_SEND_COMMAND) {
            rcvCommand.sendCmd = global.FS_SEND_COMMAND

            // 파일서버의 경우 헤더에 전문길이를 주지않는 경우 있음 ㅜㅜ FS_UPLOADFILE
            // 요청 커맨드에서 원하는 응답길이가 있다면 해당 응답길이만큼 받을수 있도록 한다.
            if (global.FS_SEND_COMMAND.getResponseLength() > 0) {
                rcvCommand.setResponseLength(global.FS_SEND_COMMAND.getResponseLength());
            }
        }
    } else {
        // 헤더가 있다면 데이터 길이만큼 다 받았는지 확인한 후 처리로 넘긴다.
        rcvCommand.data = Buffer.concat([rcvCommand.data, rcvData]);        
    }

    if (!rcvCommand.readCnt) {
        rcvCommand.readCnt = 0;
    }

    rcvCommand.readCnt += rcvData.length;
    console.log('Recive FS Command Data :', rcvCommand);

    if (rcvCommand.getResponseLength() <= rcvCommand.readCnt) {
        // 데이터를 모두 다 받았다.

        var procCmd = rcvCommand;
        rcvCommand = null; // 처리시간동안 수신데이터가 오면 엉킴
        global.FS_SEND_COMMAND = null;

        if (!responseCmdProc(procCmd)) {
            console.log('Revceive FS Data Proc Fail! :', rcvData.toString('utf-8', 0));
        }
    }
};

/**
 * 서버로 해당 Command를 보냅니다.
 *
 * @param {CommandHeader} cmdHeader 
 * @param {Buffer} dataBuf 
 */
function writeCommand(cmdHeader, dataBuf = null) {
    //try {
        rcvCommand = null;
        global.FS_SEND_COMMAND = null;
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
        // 수동으로 헤더길이를 지정하는 경우, 사이즈를 계산하지 않는다.
        if (cmdHeader.size <= 0) cmdHeader.size = cmdBuf.length;
        
        sizeBuf.writeInt32LE(cmdHeader.size);
        sizeBuf.copy(cmdBuf, 4, 0);

        fsSock.write(cmdBuf);
        global.FS_SEND_COMMAND = cmdHeader

        console.log("write FS Command : ", global.FS_SEND_COMMAND);
        console.log('-------------------------- \r\n');
    // } catch (exception) {
    //     sendLog("write FS Command FAIL! CMD: " + cmdHeader.cmdCode + " ex: " + exception);
    // }
 };

module.exports = {
    connectFS: connect,
    writeCommandFS: writeCommand,
    close: close
};