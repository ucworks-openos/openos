const { getCmd_DS_HANDSHAKE } = require('../net-command/command-header');
const { writeMainProcLog } = require('../communication/sync-msg');

var clientSock;

function readDataStream(data){  

    writeMainProcLog("readDataStream Size : " + data.length);
    // log the binary data stream in rows of 8 bits
    var print = "";
    for (var i = 0; i < data.length; i++) {
        print += " " + data[i].toString(16);

        // apply proper format for bits with value < 16, observed as int tuples
        if (data[i] < 16) { print += "0"; }

        // insert a line break after every 8th bit
        if ((i + 1) % 8 === 0) {
            print += '\n';
        }
    }

    // log the stream
    writeMainProcLog("readDataStream : " + print);
};

/**
 * 사이트 Config 정보를 비동기 형식으로 파일에 씁니다.
 */
function writeCommand (cmdBuf) {
    try {
        writeMainProcLog("writeCommand size: "+cmdBuf.length);
        console.log("writeCommand: ", cmdBuf);
        clientSock.write(cmdBuf);
    } catch (Exception) {
        writeMainProcLog("Write To Server Fail! ex:" + exception);
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

        var cmdBuf = getCmd_DS_HANDSHAKE("bslee");
        writeCommand(cmdBuf);
    });  

    var buffer =  Buffer.alloc(256);

    // listen for incoming data
    clientSock.on("data", function(data){

        // a custom function for logging more readable binary
        readDataStream(data)

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
    connectToServer: connectToServer
};