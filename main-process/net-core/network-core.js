const { getCmd_DS_HANDSHAKE } = require('../net-command/command-api');
const { writeMainProcLog } = require('../communication/sync-msg');
const { receive_command } = require('../net-command/command-processer');

var CommandHeader = require('../net-command/command-header');

var clientSock;
var rcvCommand;

/**
 * 수신된 데이터를 Command형식으로 변환 합니다.
 * @param {Buffer}} rcvData 
 */
function readDataStream(rcvData){  
    console.log(rcvData);

    // 헤더와 데이터가 따로 수신된다...

    // 헤더가 존재하는 경우 데이터만 넘어 옴으로 데이터만 받는다.
    if (rcvCommand) {
        rcvCommand.data = rcvData;
        receive_command(rcvCommand)
        rcvCommand = null;

    } else {

        // 헤더 정보를 받도록 하자.
        let rcvBuf = Buffer.from(rcvData);
        rcvCommand = new CommandHeader(rcvBuf.readInt32LE(0), rcvBuf.readInt32LE(4));
        writeMainProcLog('recv cmd Header(' + rcvBuf.length + ")  CMD: " + rcvCommand.cmd + ' SIZE:' + rcvCommand.size);
    }

    //#region Test Codes
    // if (rcvData) {
    //     const rcvBuf = Buffer.from(rcvData);
    //     var cmd = rcvBuf.readInt32LE(0);
    //     var size = rcvBuf.readInt32LE(4);
        
    //     var data = rcvBuf.toString('utf-8', 8);

    //     writeMainProcLog('recv cmd:' + cmd + ' size:' + size + "(" + rcvData.length + ") data:" + data);

    // } else {
    //     writeMainProcLog("Receive Data Empty!");    
    // }


    // writeMainProcLog("readDataStream Size : " + data.length);
    // // log the binary data stream in rows of 8 bits
    // var print = "";
    // for (var i = 0; i < data.length; i++) {
    //     print += " " + data[i].toString(16);

    //     // apply proper format for bits with value < 16, observed as int tuples
    //     if (data[i] < 16) { print += "0"; }

    //     // insert a line break after every 8th bit
    //     if ((i + 1) % 8 === 0) {
    //         print += '\n';
    //     }
    // }

    // // log the stream
    // writeMainProcLog("readDataStream : " + print);
    //#endregion
};

/**
 * 서버로 해당 Command를 보냅니다.
 *
 * @param {CommandHeader} cmdHeader 
 * @param {Buffer} dataBuf 
 */
function writeCommand(cmdHeader, dataBuf) {
    try {
        writeMainProcLog("writeCommand CMD: " + cmdHeader.cmd + " SIZE: "+cmdHeader.size);
        // Header Buffer
        var codeBuf = Buffer.alloc(4);
        var sizeBuf = Buffer.alloc(4);

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
        codeBuf.writeInt32LE(cmdHeader.cmd);
        codeBuf.copy(cmdBuf);

        // full Size
        sizeBuf.writeInt32LE(cmdBuf.length);
        sizeBuf.copy(cmdBuf, 4, 0);

        console.log(cmdBuf);
        clientSock.write(cmdBuf);
        
        writeMainProcLog("writeCommand SUCCESS! CMD: " + cmdHeader.cmd + " size: "+cmdBuf.length);
    } catch (exception) {
        writeMainProcLog("writeCommand FAIL! CMD: " + cmdHeader.cmd + " ex: " + exception);
    }
 };

 /**
  * 서버 접속
  */
function connectToServer () {
    
    if (clientSock) {
        clientSock.destroy();
    }
    
    writeMainProcLog("Conncect to " + JSON.stringify(global.SITE_CONFIG, null, 0))

    var tcpSock = require('net');  
    var client  = new tcpSock.Socket;  
    clientSock = client.connect(global.SITE_CONFIG.server_port, global.SITE_CONFIG.server_ip, function() {
        writeMainProcLog("Conncect Completed to " + JSON.stringify(global.SITE_CONFIG, null, 0))
    });  

    var buffer =  Buffer.alloc(256);

    // listen for incoming data
    clientSock.on("data", function(data){

        // a custom function for logging more readable binary
        writeMainProcLog('rcvData:' + data.length);
        readDataStream(data);
    })

    // 접속이 종료됬을때 메시지 출력
    clientSock.on('end', function(){
        writeMainProcLog('disconnected.');
    });
    // 
    clientSock.on('close', function(hadError){
        writeMainProcLog("Close. hadError:" + hadError);
    });
    // 에러가 발생할때 에러메시지 화면에 출력
    clientSock.on('error', function(err){
        writeMainProcLog(err);
    });
    // connection에서 timeout이 발생하면 메시지 출력
    clientSock.on('timeout', function(){
        writeMainProcLog('connection timeout.');
    });
};


module.exports = {
    connectToServer: connectToServer,
    writeCommand: writeCommand
};