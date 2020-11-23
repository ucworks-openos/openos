const logger = require('../../logger')

const CommandHeader = require('../net-command/command-header');
const ResData = require('../ResData');
const CmdConst = require('../net-command/command-const');
const CmdCodes = require('../net-command/command-code');

const { responseCmdProc } = require('../net-command/command-ps-res');
const { adjustBufferMultiple4 } = require('../utils/utils-buffer');

var psSock;
var rcvCommand;

const psNetLog = true;

/**
 * PS는 연결 비유지형으로 요청후 원하는 응답을 받으면 끊어 버린다.
 * 단, 응답이 오지 않는것도 있음으로 주의
 */

 /**
  * 서버 접속
  */
function connect () {
    
    if (psSock) {
        psSock.destroy();
    }
    
    logger.info("Conncect MAIN_PS to " + JSON.stringify(global.SITE_CONFIG, null, 0))

    return new Promise(function(resolve, reject){
        var tcpSock = require('net');  
        var client  = new tcpSock.Socket;  

        try {
            psSock = client.connect(global.SERVER_INFO.PS.port, global.SERVER_INFO.PS.pubip, function() {
                logger.info("Conncect MAIN_PS Completed to " + JSON.stringify(global.SERVER_INFO.PS, null, 0))
                global.SERVER_INFO.PS.isConnected = true;
        
                resolve(new ResData(true));
            });  
        } catch (err) {
            resolve(new ResData(false, err));
        }
    
        // listen for incoming data
        psSock.on("data", function(data){
            readDataStream(data);
        })
    
        // 접속이 종료됬을때 메시지 출력
        psSock.on('end', function(){
            logger.warn('PS Disconnected!');
            global.SERVER_INFO.PS.isConnected = false;
        });
        // 
        psSock.on('close', function(hadError){
            logger.warn("PS Close. hadError: " + hadError);
            global.SERVER_INFO.PS.isConnected = false;
        });
        // 에러가 발생할때 에러메시지 화면에 출력
        psSock.on('error', function(err){
            logger.error("PS Error: " + JSON.stringify(err));
            
            // 연결이 안되었는데 에러난것은 연결시도중 발생한 에러라 판당한다.
            if (!global.SERVER_INFO.PS.isConnected) {
                reject(err);
            } else {
                global.SERVER_INFO.PS.isConnected = false;
            }
            
        });
        // connection에서 timeout이 발생하면 메시지 출력
        psSock.on('timeout', function(){
            logger.warn('PS Connection timeout.');
            global.SERVER_INFO.PS.isConnected = false;
        });
    });
};

/**
 * 종료
 */
function close() {
    if (psSock) {
        psSock.destroy();
    }
}

/**
 * 수신된 데이터를 Command형식으로 변환 합니다.
 * @param {Buffer}} rcvData 
 */
function readDataStream(rcvData){  
    if (psNetLog) {
        logger.info('++++++++++++++++++++++++++++++++++');
        logger.info('PS rcvData:', rcvData.length, rcvData);
    }
    

    if (!rcvCommand){
        // 수신된 CommandHeader가 없다면 헤더를 만든다.

        rcvCommand = new CommandHeader(rcvData.readInt32LE(0), rcvData.readInt32LE(4));
        rcvCommand.readCnt = 8; // headerSize

        if (global.PS_SEND_COMMAND) {
            rcvCommand.sendCmd = global.PS_SEND_COMMAND
        }
        

        logger.info('PS Command Header Create:', rcvCommand);

        // 데이터 까지 같이 받았다면
        if (rcvData.length > 8) {
            let dataBuf = rcvData.subarray(8);
            let leftSize = rcvCommand.size - rcvCommand.readCnt;
            if (psNetLog) logger.info('PS Command recvDataLen:%s,  leftDataLen:%s', dataBuf.length, leftSize);
            
            if (dataBuf.length < leftSize) {
                // 덜 받았다면 더받을수 있도록 넘긴다.
                rcvCommand.data = dataBuf;
                rcvCommand.readCnt += dataBuf.length;

                if (psNetLog) logger.info('PS Command need to more data... leftCnt:', rcvCommand.size-rcvCommand.readCnt, rcvCommand);
                return;
            } else {

                let leftBuf;
                if (dataBuf.length > leftSize) {
                    // 받을 데이터 보다 더 받았다.
                    rcvCommand.data = dataBuf.subarray(0, leftSize);
                    leftBuf = dataBuf.subarray(leftSize)
                } else {
                    rcvCommand.data = dataBuf;
                }

                rcvCommand.readCnt += leftSize;
                 let procCmd = rcvCommand;
                 rcvCommand = null; // 처리시간동안 수신데이터가 오면 엉킴
                 global.PS_SEND_COMMAND = null;
         
                 if (!responseCmdProc(procCmd, psNetLog)) {
                     logger.info('Revceive PS Data Proc Fail! :', rcvData.toString('utf-8', 0));
                 }

                 // 남은 데이터가 있다면 넘긴다.
                 if (leftBuf) {
                     // 남은 데이터를 더 받도록 넘긴다.
                    readDataStream(leftBuf);
                 }
            }
        }
       
    } else {
        // 데이터가 부족하여 더 받았다.

        if (!rcvCommand.data) rcvCommand.data = Buffer.alloc(0);

        let leftSize = rcvCommand.size - rcvCommand.readCnt;
        if (psNetLog) logger.info('PS Command MoreRead...  recvLen:%s,  leftLen:%s', rcvData.length, leftSize, rcvCommand);

        if (rcvData.length < leftSize) {
            // 데이터를 추가적으로 더 받았는데 아직 부족하다면 더 받도록 한다.
            rcvCommand.data = Buffer.concat([rcvCommand.data, rcvData]);
            rcvCommand.readCnt += rcvData.length;

            if (psNetLog) logger.info('PS Command need to more data... leftCnt:', rcvCommand.size-rcvCommand.readCnt, rcvCommand);
            return;
        } else {

            let leftBuf;
            if (rcvData.length > rcvCommand.size) {
                // 받을 데이터 보다 더 받았다.
                rcvCommand.data = Buffer.concat([rcvCommand.data, rcvData.subarray(0, leftSize)]);
                leftBuf = rcvData.subarray(leftSize);
            } else {
                rcvCommand.data = Buffer.concat([rcvCommand.data, rcvData]);
            }
            rcvCommand.readCnt += leftSize;

            let procCmd = rcvCommand;
            rcvCommand = null; // 처리시간동안 수신데이터가 오면 엉킴
            global.PS_SEND_COMMAND = null;
    
            if (!responseCmdProc(procCmd, psNetLog)) {
                logger.info('Revceive PS Data Proc Fail! :', rcvData.toString('utf-8', 0));
            }

            // 남은 데이터가 있다면 넘긴다.
            if (leftBuf) {
                // 남은 데이터를 더 받도록 넘긴다.
                readDataStream(leftBuf);
            }
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
        global.PS_SEND_COMMAND = null;
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

        psSock.write(cmdBuf);
        global.PS_SEND_COMMAND = cmdHeader;

        logger.info("write PS Command : ", global.PS_SEND_COMMAND);
    // } catch (exception) {
    //     logger.info("write PS Command FAIL! CMD: " + cmdHeader.cmdCode + " ex: " + exception);
    // }
 };

module.exports = {
    connectPS: connect,
    writeCommandPS: writeCommand,
    close: close
};