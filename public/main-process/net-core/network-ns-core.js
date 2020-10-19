const winston = require('../../winston');

const CommandHeader = require('../net-command/command-header');
const ResData = require('../ResData');
const CmdConst = require('../net-command/command-const');
const CmdCodes = require('../net-command/command-code');
const BufUtil = require('../utils/utils-buffer');
const { receiveCmdProc } = require('../net-command/command-ns-res');

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
    
    winston.info("Conncect MAIN_NS to " + JSON.stringify(global.SITE_CONFIG, null, 0))

    return new Promise(function(resolve, reject){
        var tcpSock = require('net');  
        var client  = new tcpSock.Socket;  
        nsSock = client.connect(global.SERVER_INFO.NS.port, global.SERVER_INFO.NS.pubip, function() {
            winston.info("Conncect MAIN_NS Completed to " + JSON.stringify(global.SERVER_INFO.NS, null, 0))
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
            winston.warn('NS Disconnected!');
            global.SERVER_INFO.NS.isConnected = false;

            // 연결이 종료되면 Connectin Check를 멈춘다.
            clearInterval(global.NS_CONN_CHECK);   
            logout()
        });
        // 
        nsSock.on('close', function(hadError){
            winston.warn("NS Close. hadError: " + hadError);
            global.SERVER_INFO.NS.isConnected = false;
        });
        // 에러가 발생할때 에러메시지 화면에 출력
        nsSock.on('error', function(err){
            winston.error("NS Error: " + JSON.stringify(err));
            
            // 연결이 안되었는데 에러난것은 연결시도중 발생한 에러라 판당한다.
            if (!global.SERVER_INFO.NS.isConnected) {
                reject(err);
            } else {
                global.SERVER_INFO.NS.isConnected = false;
            }
            
        });
        // connection에서 timeout이 발생하면 메시지 출력
        nsSock.on('timeout', function(){
            winston.warn('NS Connection timeout.');
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

    //winston.info('\r\n++++++++++++++++++++++++++++++++++');
    //winston.info('NS rcvData:', rcvData.toString('hex', 0));
    // winston.info('NS rcvData Str:', rcvData.toString('utf-8', 0))
    // winston.info('NS rcvData Hex:', rcvData.toString('hex', 0))

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
    winston.info('recvData:%s dataSize:%s', rcvData.length , dataBuff.length)
    winston.info('rcvCommand ----', rcvCommand)


    // 기존데이터 + 받은 데이터 길이가 사이즈보다 넘는다면, 이후 커맨드까지 같이 받은것이다.
    if (rcvCommand.readCnt + dataBuff.length > rcvCommand.size) {

        let moreReadLen = rcvCommand.size - (rcvCommand.data.length + 8);
        rcvCommand.data = Buffer.concat([rcvCommand.data, dataBuff.subarray(0, moreReadLen)]);
        rcvCommand.readCnt += moreReadLen;
        
        var procCmd = rcvCommand;
        rcvCommand = null; // 처리시간동안 수신데이터가 오면 엉킴
        global.NS_SEND_COMMAND = null;

        //winston.info(' >> Recived NS Command Data more :', procCmd);
        if (!receiveCmdProc(procCmd)) {
            winston.info('Revceive NS Data Proc Fail! :', rcvData.toString('utf-8', 0));
        }

        // 새로 전문을 받는다.
        dataBuff = dataBuff.subarray(moreReadLen)
        readDataStream(dataBuff)
        return;
    } else {
        rcvCommand.data = Buffer.concat([rcvCommand.data, dataBuff]);
        rcvCommand.readCnt += dataBuff.length;
    }    
        
    if (rcvCommand.size <= rcvCommand.readCnt) {
        // 데이터를 모두 다 받았다.
        var procCmd = rcvCommand;
        rcvCommand = null; // 처리시간동안 수신데이터가 오면 엉킴
        global.NS_SEND_COMMAND = null;

        //winston.info(' >> Recived NS Command Data :', procCmd);
        if (!receiveCmdProc(procCmd)) {
            winston.info('Revceive NS Data Proc Fail! :', rcvData.toString('utf-8', 0));
        }
    } else {
        // winston.info('\r\n >> Reading data ..........................');
        // winston.info('NS rcvData:', rcvData);
        // winston.info('NS rcvData toStr:', rcvData.toString('utf-8', 0));
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

        //dataBuf = adjustBufferMultiple4(dataBuf);

        // Full Data Buffer
        var cmdBuf = Buffer.concat([codeBuf, sizeBuf, dataBuf]);
        
        // Command Code
        codeBuf.writeInt32LE(cmdHeader.cmdCode);
        codeBuf.copy(cmdBuf);

        // full Size
        cmdHeader.size = cmdBuf.length;
        sizeBuf.writeInt32LE(cmdHeader.size);
        sizeBuf.copy(cmdBuf, 4, 0);

        nsSock.write(cmdBuf);
        global.NS_SEND_COMMAND = cmdHeader
        cmdHeader = null;
        if (resetConnCheck) startConnectionCheck();
        
        winston.info("write NS Command ------ CMD ", JSON.stringify(global.NS_SEND_COMMAND));
    // } catch (exception) {
    //     winston.info("write NS Command FAIL! CMD: " + cmdHeader.cmdCode + " ex: " + exception);
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

    winston.info('STATR_NS_CONNECTION_CHECK.')
}


module.exports = {
    connectNS: connect,
    writeCommandNS: writeCommand,
    close: close
};