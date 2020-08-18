const { getCmd_DS_HANDSHAKE } = require('../net-command/command-api');
const { writeMainProcLog } = require('../communication/sync-msg');
const { receive_command } = require('../net-command/command-processer');

var CommandHeader = require('../net-command/command-header');

var MAIN_DS_SOCK;
var rcvCommand;
var sndCommand;

var commandDic = {}

/**
 * 수신된 데이터를 Command형식으로 변환 합니다.
 * @param {Buffer}} rcvData 
 */
function readDataStream(rcvData){  
    console.log(rcvData);

    // 헤더와 데이터가 따로 수신된다...

    // 헤더가 존재하는 경우 데이터만 넘어 옴으로 데이터만 받는다.
    //if (rcvCommand) {
    if (rcvData.length > 8) {
        if (!rcvCommand){
            rcvCommand = new CommandHeader(0, 0);
        }

        if (rcvCommand.cmd in commandDic) {
            rcvCommand = commandDic[rcvCommand.cmd]
        }

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
        writeMainProcLog("writeCommand CMD: " + cmdHeader.cmd + " Data SIZE: " + dataBuf.size);
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
        cmdHeader.size = cmdBuf.length;
        sizeBuf.writeInt32LE(cmdHeader.size);
        sizeBuf.copy(cmdBuf, 4, 0);

        console.log(cmdBuf);
        MAIN_DS_SOCK.write(cmdBuf);

        sndCommand = cmdHeader
        
        writeMainProcLog("writeCommand SUCCESS! CMD: " + cmdHeader.cmd + " size: "+cmdHeader.size);
    } catch (exception) {
        writeMainProcLog("writeCommand FAIL! CMD: " + cmdHeader.cmd + " ex: " + exception);
    }
 };

 /**
  * 서버 접속
  */
function connect_MAIN_DS () {
    
    if (MAIN_DS_SOCK) {
        MAIN_DS_SOCK.destroy();
    }
    
    writeMainProcLog("Conncect MAIN_DS to " + JSON.stringify(global.SITE_CONFIG, null, 0))

    var tcpSock = require('net');  
    var client  = new tcpSock.Socket;  
    MAIN_DS_SOCK = client.connect(global.SITE_CONFIG.server_port, global.SITE_CONFIG.server_ip, function() {
        writeMainProcLog("Conncect MAIN_DS Completed to " + JSON.stringify(global.SITE_CONFIG, null, 0))
        global.SERVER_INFO.DS.isConnected = true;
    });  

    var buffer =  Buffer.alloc(256);

    // listen for incoming data
    MAIN_DS_SOCK.on("data", function(data){

        // a custom function for logging more readable binary
        writeMainProcLog('rcvData:' + data.length);
        readDataStream(data);
    })

    // 접속이 종료됬을때 메시지 출력
    MAIN_DS_SOCK.on('end', function(){
        writeMainProcLog('Disconnected!');
        global.SERVER_INFO.DS.isConnected = true;
    });
    // 
    MAIN_DS_SOCK.on('close', function(hadError){
        writeMainProcLog("Close. hadError: " + hadError);
        global.SERVER_INFO.DS.isConnected = true;
    });
    // 에러가 발생할때 에러메시지 화면에 출력
    MAIN_DS_SOCK.on('error', function(err){
        writeMainProcLog("Error: " + JSON.stringify(err));
        global.SERVER_INFO.DS.isConnected = true;
    });
    // connection에서 timeout이 발생하면 메시지 출력
    MAIN_DS_SOCK.on('timeout', function(){
        writeMainProcLog('Connection timeout.');
        global.SERVER_INFO.DS.isConnected = true;
    });
};


module.exports = {
    connect_MAIN_DS: connect_MAIN_DS,
    writeCommand_MAIN_DS: writeCommand
};