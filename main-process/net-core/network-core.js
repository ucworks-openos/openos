const { getCmd_DS_HANDSHAKE } = require('../net-command/command-api');
const { writeMainProcLog } = require('../communication/sync-msg');

var clientSock;
var rcvCommand;


function readDataStream(rcvData){  
    const rcvBuf = Buffer.from(rcvData);

    // 헤더가 존재하는 경우 데이터만 넘어 옴으로 데이터만 받는다.
    if (rcvCommand) {
       
        rcvCommand.prototype.data = rcvBuf.toString('utf-8', 8);
        writeMainProcLog('recv cmd Data(' + rcvBuf.length + ")   CMD: " + rcvCommand.cmd + " Data: " + rcvCommand.data);

    } else {

        // 헤더 정보를 받도록 하자.
        rcvCommand = new CommandHeader(rcvBuf.readInt32LE(0), rcvBuf.readInt32LE(4));
        writeMainProcLog('recv cmd Header(' + rcvBuf.length + ")  CMD: " + rcvCommand.cmd + ' SIZE:' + rcvCommand.size);
    }

    //#region 
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
 * 사이트 Config 정보를 비동기 형식으로 파일에 씁니다.
 */
function writeCommand(cmdHeader, dataBuf) {
    try {
        var codeBuf = Buffer.alloc(4);
        var sizeBuf = Buffer.alloc(4);

        var cmdBuf = Buffer.concat([codeBuf, sizeBuf, dataBuf]);

        // Command Code
        codeBuf.writeInt32LE(cmdHeader.cmd);
        sizeBuf.copy(cmdBuf, 0, 0);

        // full Size
        sizeBuf.writeInt32LE(cmdBuf.length);
        sizeBuf.copy(cmdBuf, 4, 0);

        clientSock.write(cmdBuf);
        writeMainProcLog("writeCommand CMD: " + cmdHeader.cmd + " size: "+cmdBuf.length);

    } catch (exception) {
        writeMainProcLog("writeCommand FAIL! CMD: " + cmdHeader.cmd + " ex: " + exception);
    }
 };

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