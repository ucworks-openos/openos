const winston = require('../../winston');

const CommandHeader = require('../net-command/command-header');
const ResData = require('../ResData');

const BufUtil = require('../utils/utils-buffer')

const { receiveCmdProc } = require('../net-command/command-fs-res');

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
    
    winston.info("Conncect MAIN_FS to %s", global.SERVER_INFO.FS)

    return new Promise(function(resolve, reject){
        var tcpSock = require('net');  
        var client  = new tcpSock.Socket; 
         
        fsSock = client.connect(global.SERVER_INFO.FS.port, global.SERVER_INFO.FS.pubip, function() {
            winston.info("Conncect MAIN_FS Completed to %s", global.SERVER_INFO.FS)
            global.SERVER_INFO.FS.isConnected = true;

            resolve(new ResData(true));
        });  
    
        // listen for incoming data
        fsSock.on("data", function(data){
            receiveDatasProc(data);
        })
        // 접속이 종료됬을때 메시지 출력
        fsSock.on('end', function(){
            winston.warn('FS Disconnected!');
            global.SERVER_INFO.FS.isConnected = false;
        });
        // close
        fsSock.on('close', function(hadError){
            winston.warn("FS Close. hadError: %s", hadError);
            global.SERVER_INFO.FS.isConnected = false;
        });
        // 에러가 발생할때 에러메시지 화면에 출력
        fsSock.on('error', function(err){
            winston.error("FS Error: %s", err);
            
            // 연결이 안되었는데 에러난것은 연결시도중 발생한 에러라 판당한다.
            if (!global.SERVER_INFO.FS.isConnected) {
                reject(err);
            } else {
                global.SERVER_INFO.FS.isConnected = false;
            }
        });
        // connection에서 timeout이 발생하면 메시지 출력
        fsSock.on('timeout', function(){
            winston.warn('FS Connection timeout.');
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
function receiveDatasProc(rcvData){  
    winston.debug('FS Received Data: %s',rcvData.length);

    if (!rcvCommand){
        let dataLen = 0; // default file Command Size
        if (global.FS_SEND_COMMAND) {
            dataLen = global.FS_SEND_COMMAND.getResponseLength();
        }

        // 수신된 CommandHeader가 없다면 헤더를 만든다.
        let cmdLeft = BufUtil.getCommandHeader(rcvData, dataLen);
        rcvCommand = cmdLeft.command;
        rcvData = cmdLeft.leftBuf;

        if (global.FS_SEND_COMMAND) {
            rcvCommand.sendCmd = global.FS_SEND_COMMAND
        }

        winston.info('>> Receive Header %s', rcvCommand)

        if (rcvCommand.readCnt == rcvCommand.getResponseLength()) {
            receiveCmdProc(rcvCommand);
        } else if (rcvCommand.readCnt > dataLen) {
            winston.info('>> FS OVER READ !!! %s  %s', dataLen, rcvCommand)
        }

        // 남는거 없이 다 읽었다면 끝낸다.
        winston.debug('>>>>>> First  Left rcvData  %s', rcvData.toString('hex'))
        if (!rcvData || rcvData.length == 0) return;

    } else {
        
        // 또 받을 데이터 보다 더 들어 왔다면 자르고 남는것을 넘긴다.
        let leftLen = rcvCommand.getResponseLength() - rcvCommand.readCnt;

        winston.debug('FS More Receive  %s, %s', leftLen, rcvCommand)
        if (rcvData.length > leftLen) {
            // 읽을 데이터 보다 더 들어 왔다.
            rcvCommand.data = Buffer.concat([rcvCommand.data, rcvData.slice(0, leftLen)]);
            rcvCommand.addReadCount(leftLen);

            receiveCmdProc(rcvCommand);
            rcvData = rcvData.slice(leftLen);
            winston.debug('>>>>>>> AsIs Cmd Left rcvData %s', rcvData.toString('hex'))
        } else {
            // 필요한 데이터가 딱맞거나 작다면 그냥 다읽고 끝낸다.
            rcvCommand.data = Buffer.concat([rcvCommand.data, rcvData]);
            rcvCommand.addReadCount(rcvData.length);

            if (rcvCommand.readCnt >= rcvCommand.getResponseLength()) {
                
                if (rcvCommand.readCnt > rcvCommand.getResponseLength()) winston.info('>> FS OVER READ !!! %s, %s',rcvData.length, rcvCommand); 
                // 제대로 다 읽었다면 Cmd 처리    
                receiveCmdProc(rcvCommand);
            } 
            
            // 더 받을게 남았았음으로 다음에 오는 데이터를 받도록 넘어간다.
            return;
        }
    }

    winston.debug('FS More Read Datas........ %s', rcvData.length);
    receiveDatasProc(rcvData)
};

/**
 * 서버로 해당 Command를 보냅니다.
 *
 * @param {CommandHeader} cmdHeader 
 * @param {Buffer} dataBuf 
 */
function writeCommand(cmdHeader, dataBuf = null, logging=false) {
    rcvCommand = null;
    global.FS_SEND_COMMAND = null;
    // Header Buffer
    var codeBuf = Buffer.alloc(4);
    var sizeBuf = Buffer.alloc(4);

    if (!dataBuf)
        dataBuf = Buffer.alloc(0);

    // Full Data Buffer
    var cmdBuf = Buffer.concat([codeBuf, sizeBuf, dataBuf]);
    //cmdBuf = adjustBufferMultiple4(cmdBuf);

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

    if (logging) winston.debug("write FS Command : %s", global.FS_SEND_COMMAND);
 };

module.exports = {
    connectFS: connect,
    writeCommandFS: writeCommand,
    close: close
};