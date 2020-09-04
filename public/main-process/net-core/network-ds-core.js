const { sendLog } = require('../ipc/ipc-cmd-sender');
const { receive_command } = require('../net-command/command-res-proc');

const CommandHeader = require('../net-command/command-header');
const ResData = require('../ResData');
const CmdConst = require('../net-command/command-const');
const CmdCodes = require('../net-command/command-code');

var dsSock;
var rcvCommand;

/**
 * DS는 연결 비유지형으로 요청후 원하는 응답을 받으면 끊어 버린다.
 * 단, 응답이 오지 않는것도 있음으로 주의
 */


 /**
  * 서버 접속
  */
function connect () {
    
    if (dsSock) {
        dsSock.destroy();
    }
    
    sendLog("Conncect MAIN_DS to " + JSON.stringify(global.SITE_CONFIG, null, 0))

    return new Promise(function(resolve, reject){
        var tcpSock = require('net');  
        var client  = new tcpSock.Socket; 
         
        dsSock = client.connect(global.SITE_CONFIG.server_port, global.SITE_CONFIG.server_ip, function() {
            sendLog("Conncect MAIN_DS Completed to " + JSON.stringify(global.SITE_CONFIG, null, 0))
            global.SERVER_INFO.DS.isConnected = true;

            resolve(new ResData(true));
        });  
    
        // listen for incoming data
        dsSock.on("data", function(data){
            readDataStream(data);
        })
        // 접속이 종료됬을때 메시지 출력
        dsSock.on('end', function(){
            sendLog('DS Disconnected!');
            global.SERVER_INFO.DS.isConnected = false;
        });
        // close
        dsSock.on('close', function(hadError){
            sendLog("DS Close. hadError: " + hadError);
            global.SERVER_INFO.DS.isConnected = false;
        });
        // 에러가 발생할때 에러메시지 화면에 출력
        dsSock.on('error', function(err){
            sendLog("DS Error: " + JSON.stringify(err));
            
            // 연결이 안되었는데 에러난것은 연결시도중 발생한 에러라 판당한다.
            if (!global.SERVER_INFO.DS.isConnected) {
                reject(err);
            } else {
                global.SERVER_INFO.DS.isConnected = false;
            }
        });
        // connection에서 timeout이 발생하면 메시지 출력
        dsSock.on('timeout', function(){
            sendLog('DS Connection timeout.');
            global.SERVER_INFO.DS.isConnected = false;
        });
    });
};

/**
 * 종료
 */
function close() {
    if (dsSock) {
        dsSock.destroy();
    }
}

/**
 * 수신된 데이터를 Command형식으로 변환 합니다.
 * @param {Buffer}} rcvData 
 */
function readDataStream(rcvData){  
    console.log('\r\n++++++++++++++++++++++++++++++++++');
    console.log('DS rcvData:', rcvData);

    if (!rcvCommand){
        // 수신된 CommandHeader가 없다면 헤더를 만든다.
        rcvCommand = new CommandHeader(rcvData.readInt32LE(0), rcvData.readInt32LE(4));

        rcvCommand.data = rcvData.subarray(8);
        if (global.DS_SEND_COMMAND) {
            rcvCommand.sendCmd = global.DS_SEND_COMMAND
        }
    } else {
        // 헤더가 있다면 데이터 길이만큼 다 받았는지 확인한 후 처리로 넘긴다.
        rcvCommand.data = Buffer.concat([rcvCommand.data, rcvData]);        
    }

    if (!rcvCommand.readCnt) {
        rcvCommand.readCnt = 0;
    }

    rcvCommand.readCnt += rcvData.length;
    console.log('Recive DS Command Data :', rcvCommand);

    if (rcvCommand.size <= rcvCommand.readCnt) {
        // 데이터를 모두 다 받았다.

        var procCmd = rcvCommand;
        rcvCommand = null; // 처리시간동안 수신데이터가 오면 엉킴
        global.DS_SEND_COMMAND = null;

        if (!receive_command(procCmd)) {
            console.log('Revceive DS Data Proc Fail! :', rcvData.toString('utf-8', 0));
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
        global.DS_SEND_COMMAND = null;
        // Header Buffer
        var codeBuf = Buffer.alloc(4);
        var sizeBuf = Buffer.alloc(4);

        if (!dataBuf)
            dataBuf = Buffer.alloc(0);

        // Full Data Buffer
        var cmdBuf = Buffer.concat([codeBuf, sizeBuf, dataBuf]);

        // Create Dummy Buffer. Set the length to a multiple of 4.
        var dummyLength = Math.ceil(cmdBuf.length/4)*4;
        if (dummyLength != cmdBuf.length) {
            //console.log("cmdBuf Diff size:" + (dummyLength-cmdBuf.length) + ", DummySize:" + dummyLength + ", BufferSize:" + cmdBuf.length);
            var dummyBuf = Buffer.alloc(dummyLength-cmdBuf.length);
            cmdBuf = Buffer.concat([cmdBuf, dummyBuf]);
        }

        // Command Code
        codeBuf.writeInt32LE(cmdHeader.cmdCode);
        codeBuf.copy(cmdBuf);

        // full Size
        cmdHeader.size = cmdBuf.length;
        sizeBuf.writeInt32LE(cmdHeader.size);
        sizeBuf.copy(cmdBuf, 4, 0);

        dsSock.write(cmdBuf);
        global.DS_SEND_COMMAND = cmdHeader

        console.log('\r\n-------------------------- ');
        //sendLog("write Command ------ CMD: " + JSON.stringify(global.DS_SEND_COMMAND));
        console.log("write DS Command : ", global.DS_SEND_COMMAND);
    // } catch (exception) {
    //     sendLog("write DS Command FAIL! CMD: " + cmdHeader.cmdCode + " ex: " + exception);
    // }
 };

module.exports = {
    connectDS: connect,
    writeCommandDS: writeCommand,
    close: close
};