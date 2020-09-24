const { sendLog, send } = require('../ipc/ipc-cmd-sender');
const fs = require('fs');

const CommandHeader = require('./command-header');
const CmdCodes = require('./command-code');
const CmdConst = require('./command-const');
const CryptoUtil = require('../utils/utils-crypto')
const BufUtil = require('../utils/utils-buffer')

const ResData = require('../ResData');

const { createSock } = require('../utils/utils-net');
const { adjustBufferMultiple4 } = require('../utils/utils-buffer');

/**
 * 파일을 다운로드 합니다.
 * 무조건 OTS로 암호화 합니다.
 * 
 * 파일마다 서버가 다르기 때문에 다운로드 서버 정보를 직접 입력 받습니다.
 * 
 * 
 * @param {String} serverFileName  // 서버에 저장된 파일명, Rander에서 업로드 정보를 수신할때 구분할수 있는키
 * @param {String} filePath   // 경로
 * @param {String} fileName   // 원하는 파일명. 없다면 빈값
 */
function downloadFile(serverIp, serverPort, serverFileName, saveFilePath, handleProgress, handleOnError) {
    sendLog('>> downloadFile', serverIp, serverPort, serverFileName, saveFilePath);

    return new Promise(async function(resolve, reject) {   

        // 파일전문은 헤더의 길이에 다른정보들을 담음으로 실제 데이터 길이를 알수 없다.
        // 또한 실제 데이터의 길이와 파일 전문의 실제 길이는 다르다. 그래서 읽을 길이를 고정할수 있도록 한다.......쩝.....  ㅜㅜ
        let fileCmdSize = 8+4+CmdConst.BUF_LEN_FILEDATA; // 


        // 파일 다운로드는 파일마다 다른세션을 가진다. 
        let fileEncKey;
        let fileLength = 0;
        let downloadedSize = 0

        let gubunBuf;
        let fileDataBuf;
        let cmd;

        let chunk; // 읽은 파일 데이터

        let SVR = {ip:serverIp, port:serverPort};
        let isConnected = false;

        // member
        let sndCommand;
        let rcvCommand;
        let fsSock;

        // Request Command를 보낸다.
        let writeCommand = function(cmdHeader, dataBuf = null){
            rcvCommand = null;
            sndCommand = null;
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
            sndCommand = cmdHeader
        
            console.log("File Download Command Send: ", sndCommand);
            console.log('-------------------------- \r\n');
        };

        // 받은 데이터 처리
        let receiveCommandProc = function (resCmd) {
            var procCmd = rcvCommand;
            rcvCommand = null; // 처리시간동안 수신데이터가 오면 엉킴
            sndCommand = null;

            //sendLog('File Download Response -  RES_CMD: ' + resCmd.cmdCode);
            let gubun;

            // 요청에 의한 응답
            if (resCmd.sendCmd) {
                switch(resCmd.sendCmd.cmdCode) {
                    case CmdCodes.FS_LOGINREADY:
                        // FS_LOGINREADY
                        switch(resCmd.cmdCode) {
                            case CmdCodes.FS_LOGINREADY:
                                // 2. download check 파일다운로드 정보를 전달
                                sendLog('2. downloadCheck',serverFileName);
                                gubunBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);
                                gubunBuf.writeInt32LE(1);

                                fileDataBuf = Buffer.alloc(CmdConst.BUF_LEN_FILEDATA)
                                fileDataBuf.write(serverFileName, global.ENC);

                                cmd = new CommandHeader(CmdCodes.FS_DOWNLOADFILE, 0);
                                cmd.setResponseLength(fileCmdSize);
                                writeCommand(cmd, Buffer.concat([gubunBuf, fileDataBuf]));

                                break;
                            default:
                                sendLog('FS_LOGINREADY  Response Fail! -  ', resCmd.cmdCode);
                                resolve(new ResData(false, 'FS_LOGINREADY  Response Fail! -  '+ resCmd.cmdCode));
                                break;
                        }
                        break;
            
                    case CmdCodes.FS_DOWNLOADFILE:
                        switch(resCmd.cmdCode) {
                            case CmdCodes.FS_DOWNLOADREADY:
                                gubun = resCmd.data.readInt32LE(0);
                                let lengthStr = BufUtil.getStringWithoutEndOfString(resCmd.data, 4);
                                fileLength = Number(lengthStr)

                                // 3. encKey Reqeust
                                sendLog('3. encKey Reqeust', fileLength);
                                let gubunBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);
                                gubunBuf.writeInt32LE(1);

                                cmd = new CommandHeader(CmdCodes.FS_DOWNLOADSEND, 0);
                                cmd.setResponseLength(fileCmdSize);
                                writeCommand(cmd, Buffer.concat([gubunBuf, Buffer.alloc(CmdConst.BUF_LEN_FILEDATA)]));

                                break;
                            default:
                                sendLog('FS_DOWNLOADFILE  Response Fail! -  ', resCmd.cmdCode);
                                resolve(new ResData(false, 'FS_DOWNLOADFILE  Response Fail! -  '+ resCmd.cmdCode));
                                break;
                            }
                        break;
            
                    case CmdCodes.FS_DOWNLOADSEND:
                        // 인코딩 정보를 처리하기전에 데이터 수신을 방지하기 위해 
                        fsSock.push(); 
                        let temp = Buffer.from(resCmd.data);
                        console.log('FS_DOWNLOADSEND ENC -- ', temp);
                        console.log('FS_DOWNLOADSEND ENC -- ', temp.toString(global.ENC));

                        gubun = resCmd.data.readInt32LE(0);
                        let encData = BufUtil.getStringWithoutEndOfString(resCmd.data, 4);
                        
                        let spliterInx = encData.lastIndexOf(CmdConst.SEP_PIPE);
                        let encKey = encData.substring(0, spliterInx-1);
                        let cipherTxt = encData.substring(spliterInx+1);
                        fileEncKey =  CryptoUtil.decryptMessage(encKey, cipherTxt);
                        
                        console.log('FS_DOWNLOADSEND ENC', encData, encKey, cipherTxt, fileEncKey);
                        
    
                        fsSock.resume(); // 다시 수신을 한다.
                        break;
                    default :
                        let rcvBuf = Buffer.from(resCmd.data);
                        let dataStr = rcvBuf.toString('utf-8', 0);
                        
                        sendLog('FS_DOWNLOADSEND  Response Fail! - ' + resCmd.cmdCode + ' Data:' + dataStr);
                        resolve(new ResData(false, 'FS_DOWNLOADSEND  Response Fail! -  '+ resCmd.cmdCode));
                        break;
                }
            } else {
                // 서버에서 보낸 파일정보를 수신한다.
                switch(resCmd.cmdCode) {
                    case CmdCodes.FS_DOWNLOADSEND:
                        chunk = Buffer.from( resCmd.data, 4);
                        chunk = CryptoUtil.decryptBufferRC4(fileEncKey, chunk);
                        downloadedSize += chunk.length;

                        // UI에서 진행률을 처리할수 있도록 전송되는 정보를 보내준다.
                        handleProgress(serverFileName, downloadedSize, fileLength)

                        //sendLog('FS_DOWNLOADEND   Downloading...', chunkSize, downloadedSize, fileLength);

                        try {
                            fs.appendFileSync(saveFilePath, chunk);
                        } catch (err) {
                            sendLog('file write error', )
                        }

                        break;

                    case CmdCodes.FS_DOWNLOADEND:
                        let chunkSize = resCmd.size - (8+4) // 헤더+gubun 사이즈를 뺴고 데이터 사이즈를 가져온다.
                        chunk = Buffer.from(resCmd.data, 4, chunkSize);
                        chunk = CryptoUtil.decryptBufferRC4(fileEncKey, chunk);
                        downloadedSize += chunk.length;

                        sendLog('FS_DOWNLOADEND End Download', chunkSize, downloadedSize, fileLength);

                        try {
                            fs.appendFileSync(saveFilePath, chunk);
                        } catch (err) {
                            sendLog('file write error', )
                            resolve(new ResData(false, err))
                        }

                        resolve(new ResData(true))
                        break;

                    default:
                        sendLog('File Receive  Response Fail! -  ', resCmd.cmdCode);
                        resolve(new ResData(false, 'File Receive Fail! -  '+ resCmd.cmdCode));
                        break;
                    
                    break;
                }
            }
        }

        let receiveDatasProc = function(rcvData){
            console.log('\r\n++++++++++++++++++++++++++++++++++');
            console.log('FS rcvData:', rcvData.length);
            console.log('\r\n');
    
            if (!rcvCommand){
                // 수신된 CommandHeader가 없다면 헤더를 만든다.
                rcvCommand = new CommandHeader(rcvData.readInt32LE(0), rcvData.readInt32LE(4));
    
                rcvCommand.data = rcvData.subarray(8);
                if (sndCommand) {
                    rcvCommand.sendCmd = sndCommand
    
                    // 파일서버의 경우 헤더에 전문길이를 주지않는 경우 있음 ㅜㅜ FS_UPLOADFILE
                    // 요청 커맨드에서 원하는 응답길이가 있다면 해당 응답길이만큼 받을수 있도록 한다.
                    // if (sndCommand.getResponseLength() > 0) {
                    //     rcvCommand.setResponseLength(sndCommand.getResponseLength());
                    // }
                    rcvCommand.setResponseLength(fileCmdSize);
                }
            } else {
                // 헤더가 있다면 데이터 길이만큼 다 받았는지 확인한 후 처리로 넘긴다.
                rcvCommand.data = Buffer.concat([rcvCommand.data, rcvData]);        
            }
    
            if (!rcvCommand.readCnt) {
                rcvCommand.readCnt = 0;
            }
    
            rcvCommand.readCnt += rcvData.length;
            //console.log('Recive Command Data :', rcvCommand);

            if (rcvCommand.getResponseLength() < rcvCommand.readCnt) {
                // 더 많이 받았다면 쪼개야 한다....
                
            }
    
            if (rcvCommand.getResponseLength() <= rcvCommand.readCnt) {
                // 데이터를 모두 다 받았다.
                var procCmd = rcvCommand;
                rcvCommand = null; // 처리시간동안 수신데이터가 오면 엉킴
                sndCommand = null;
    
                receiveCommandProc(procCmd)
            }                                                                                                       
        };


        //
        // Connection to file server
        try {
            fsSock = await createSock(SVR.ip, SVR.port);
            isConnected = true;
        } catch (err) {
            sendLog('SERVER CONNECT FAIL!', SVR, err)
            
            if (handleOnError) handleOnError(err)
            return false;
        }
    
        // listen for incoming data
        fsSock.on("data", function(data) {
            receiveDatasProc(data)
        });                                                                                                 

        // 접속이 종료됬을때 메시지 출력
        fsSock.on('end', function(){
            sendLog('File Download Disconnected!');
            isConnected = false;
        });
        // close
        fsSock.on('close', function(hadError){
            sendLog("File Download Close. hadError: " + hadError);
            isConnected = false;
        });
        // 에러가 발생할때 에러메시지 화면에 출력
        fsSock.on('error', function(err){
            if (HandleOnClose) HandleOnClose(err);
            
            // 연결이 안되었는데 에러난것은 연결시도중 발생한 에러라 판당한다.
            isConnected = false;
        });
        
        // connection에서 timeout이 발생하면 메시지 출력
        fsSock.on('timeout', function(){
            if (handleOnErr) handleOnErr(new Error('time out'));
            isConnected = false;
        });


        try {
            // 1. download ready (login)
            // 2. download check
            // 3. encKey Reqeust & DownloadStream
            // 4. download end

            // 1. Download Ready를 하면 응답에 따라 완료까지 모두 진행이 된다.
            sendLog('1. download ready (login)',global.USER.userId);
            gubunBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);
            gubunBuf.writeInt32LE(1);
            fileDataBuf = Buffer.alloc(CmdConst.BUF_LEN_FILEDATA);
            fileDataBuf.write(global.USER.userId);
        
            cmd = new CommandHeader(CmdCodes.FS_LOGINREADY, 0);
            cmd.setResponseLength(fileCmdSize);
            writeCommand(cmd, Buffer.concat([gubunBuf, fileDataBuf]));

        } catch (err) {
            sendLog('Download File Fail!', serverIp, serverPort, serverFileName, saveFilePath, err);
            resolve(new ResData(false, err));
        }
    });
}

// function getCommandHeader(dataBuf, cmdSize = 0) {
//     if (dataBuf.length < 8) return dataBuf;

//     let cmd = new CommandHeader(dataBuf.readInt32LE(0), dataBuf.readInt32LE(4));
    
//     // 수신사이즈를 모른다면 헤더 정보를 활용한다.
//     if (cmdSize <= 0) cmdSize = cmd.size;

//     cmd.setResponseLength(cmdSize);
//     let leftBuf;
//     if (dataBuf.length < cmdSize) {
//         cmd.data = dataBuf.slice(8);
//         leftBuf = Buffer.alloc(0);
//     } else {
//         cmd.data = dataBuf.slice(8, cmdSize - 8);
//         leftBuf = dataBuf.slice(cmdSize);
//     }

//     cmd.addReadCount(cmdSize);
//     console.log('Recive Command Data :', cmd);
//     return {command:cmd, leftBuf:leftBuf}
// }

module.exports = {
    downloadFile: downloadFile
  }
