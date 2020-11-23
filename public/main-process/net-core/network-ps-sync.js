const logger = require('../../logger')

const CommandHeader = require('../net-command/command-header');

const { responseCmdProc } = require('../net-command/command-ps-res');
const { adjustBufferMultiple4 } = require('../utils/utils-buffer');

const psNetLog = false;


/**
 * 서버로 해당 Command를 보냅니다.
 * 
 * 하나의 요청과 응답을 받고 끊어버리는 1Sync 동작을 합니다.
 *
 * @param {CommandHeader} cmdHeader 
 * @param {Buffer} dataBuf 
 */
function writePsCommandSync(reqCmdHeader, dataBuf = null) {

    var psSock;
    var rcvCommand;

    var tcpSock = require('net');  
    var client  = new tcpSock.Socket;  
    

    psSock = client.connect(global.SERVER_INFO.PS.port, global.SERVER_INFO.PS.pubip, function() {
        logger.info("Conncect PS_SYNC Completed to " + JSON.stringify(global.SERVER_INFO.PS, null, 0))

        writeCommand();
    });  

    // listen for incoming data
    psSock.on("data", function(data){
        readDataStream(data);
    })

    // 접속이 종료됬을때 메시지 출력
    psSock.on('end', function(){
        logger.warn('PS_SYNC Disconnected!');
    });
    // 
    psSock.on('close', function(hadError){
        logger.warn("PS_SYNC Close. hadError: " + hadError);
    });
    // 에러가 발생할때 에러메시지 화면에 출력
    psSock.on('error', function(err){
        logger.error("PS_SYNC Error: " + JSON.stringify(err));
        
    });
    // connection에서 timeout이 발생하면 메시지 출력
    psSock.on('timeout', function(){
        logger.warn('PS_SYNC Connection timeout.');
    });


    /******************************
     * Command Process
     *****************************/
        
    /**
     * 수신된 데이터를 Command형식으로 변환 합니다.
     * @param {Buffer}} rcvData 
     */
    let readDataStream = function (rcvData){  
        if (psNetLog) {
            logger.info('++++++++++++++++++++++++++++++++++');
            logger.info('PS_SYNC rcvData:', rcvData.length, rcvData);
        }

        if (!rcvCommand){
            // 수신된 CommandHeader가 없다면 헤더를 만든다.

            rcvCommand = new CommandHeader(rcvData.readInt32LE(0), rcvData.readInt32LE(4));
            rcvCommand.readCnt = 8; // headerSize
            rcvCommand.sendCmd = reqCmdHeader

            logger.info('PS_SYNC Command Header Create:', rcvCommand);

            // 데이터 까지 같이 받았다면
            if (rcvData.length > 8) {
                let dataBuf = rcvData.subarray(8);
                let leftSize = rcvCommand.size - rcvCommand.readCnt;
                if (psNetLog) logger.info('PS_SYNC Command recvDataLen:%s,  leftDataLen:%s', dataBuf.length, leftSize);
                
                if (dataBuf.length < leftSize) {
                    // 덜 받았다면 더받을수 있도록 넘긴다.
                    rcvCommand.data = dataBuf;
                    rcvCommand.readCnt += dataBuf.length;

                    if (psNetLog) logger.info('PS_SYNC Command need to more data... leftCnt:', rcvCommand.size-rcvCommand.readCnt, rcvCommand);
                    return;
                } else {

                    rcvCommand.data = dataBuf;
                    rcvCommand.readCnt += leftSize;
                    if (!responseCmdProc(rcvCommand, psNetLog)) {
                        logger.info('Revceive PS_SYNC Data Proc Fail! :', rcvData.toString('utf-8', 0));
                    }
                    
                    close();
                }
            }
        
        } else {
            // 데이터가 부족하여 더 받았다.

            if (!rcvCommand.data) rcvCommand.data = Buffer.alloc(0);

            let leftSize = rcvCommand.size - rcvCommand.readCnt;
            if (psNetLog) logger.info('PS_SYNC Command MoreRead...  recvLen:%s,  leftLen:%s', rcvData.length, leftSize, rcvCommand);

            if (rcvData.length < leftSize) {
                // 데이터를 추가적으로 더 받았는데 아직 부족하다면 더 받도록 한다.
                rcvCommand.data = Buffer.concat([rcvCommand.data, rcvData]);
                rcvCommand.readCnt += rcvData.length;

                if (psNetLog) logger.info('PS_SYNC Command need to more data... leftCnt:', rcvCommand.size-rcvCommand.readCnt, rcvCommand);
                return;
            } else {

                rcvCommand.data = Buffer.concat([rcvCommand.data, rcvData]);
                rcvCommand.readCnt += leftSize;
        
                if (!responseCmdProc(rcvCommand, psNetLog)) {
                    logger.info('Revceive PS_SYNC Data Proc Fail! :', rcvCommand.data?.toString('utf-8', 0));
                }
                close();
            }
        }
    };

    /**
     * 서버로 해당 Command를 보냅니다.
     */
    let writeCommand = function () {
        // Header Buffer
        var codeBuf = Buffer.alloc(4);
        var sizeBuf = Buffer.alloc(4);

        if (!dataBuf)
            dataBuf = Buffer.alloc(0);

        // Full Data Buffer
        var cmdBuf = Buffer.concat([codeBuf, sizeBuf, dataBuf]);
        cmdBuf = adjustBufferMultiple4(cmdBuf);

        // Command Code
        codeBuf.writeInt32LE(reqCmdHeader.cmdCode);
        codeBuf.copy(cmdBuf);

        // full Size
        reqCmdHeader.size = cmdBuf.length;
        sizeBuf.writeInt32LE(reqCmdHeader.size);
        sizeBuf.copy(cmdBuf, 4, 0);

        psSock.write(cmdBuf);

        logger.info("write PS_SYNC Command : ", reqCmdHeader);
    };

    /**
     * 종료
     */
    let close = function() {
        if (psSock) {
            psSock.destroy();
        }
    }

};

module.exports = {
    writePsCommandSync: writePsCommandSync,
};