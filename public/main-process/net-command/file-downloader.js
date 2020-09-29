const winston = require('../../winston');
const fs = require('fs');

const CommandHeader = require('./command-header');
const CmdCodes = require('./command-code');
const CmdConst = require('./command-const');
const CryptoUtil = require('../utils/utils-crypto')
const BufUtil = require('../utils/utils-buffer')

const ResData = require('../ResData');

const { send } = require('../ipc/ipc-cmd-sender');
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
    winston.info('>> downloadFile', serverIp, serverPort, serverFileName, saveFilePath);

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
        
            winston.debug("File Download Command Send: %s", sndCommand);
        };

        // 받은 데이터 처리
        let receiveCommandProc = function (resCmd) {
            rcvCommand = null; // 처리시간동안 수신데이터가 오면 엉킴
            sndCommand = null;

            winston.debug('receiveCommandProc -  RCV_CMD: %s', resCmd);
            let gubun;
            let readChunckLength = 0;

            // 요청에 의한 응답
            if (resCmd.sendCmd) {
                switch(resCmd.sendCmd.cmdCode) {
                    case CmdCodes.FS_LOGINREADY:
                        // FS_LOGINREADY
                        switch(resCmd.cmdCode) {
                            case CmdCodes.FS_LOGINREADY:
                                // 2. download check 파일다운로드 정보를 전달
                                winston.debug('2. downloadCheck',serverFileName);
                                gubunBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);
                                gubunBuf.writeInt32LE(1);

                                fileDataBuf = Buffer.alloc(CmdConst.BUF_LEN_FILEDATA)
                                fileDataBuf.write(serverFileName, global.ENC);

                                cmd = new CommandHeader(CmdCodes.FS_DOWNLOADFILE, 0);
                                cmd.setResponseLength(fileCmdSize);
                                writeCommand(cmd, Buffer.concat([gubunBuf, fileDataBuf]));

                                break;
                            default:
                                winston.error('FS_LOGINREADY  Response Fail! -  ', resCmd.cmdCode);
                                resolve(new ResData(false, 'FS_LOGINREADY  Response Fail! -  '+ resCmd.cmdCode));
                                break;
                        }
                        break;
            
                    case CmdCodes.FS_DOWNLOADFILE:
                        switch(resCmd.cmdCode) {
                            case CmdCodes.FS_DOWNLOADREADY:
                                gubun = resCmd.data.readInt32LE(0);
                                let lengthStr = BufUtil.getStringWithoutEndOfString(resCmd.data, 4);
                                fileLength = Number(lengthStr) - 140;

                                // 3. encKey Reqeust
                                winston.debug('3. encKey Reqeust', fileLength);
                                let gubunBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);
                                gubunBuf.writeInt32LE(1);

                                // 일단 기존 파일 지워 버린다.
                                try {
                                    fs.unlinkSync(saveFilePath);
                                } catch (err) {
                                    // handle the error
                                }
                                cmd = new CommandHeader(CmdCodes.FS_DOWNLOADSEND, 0);
                                cmd.setResponseLength(fileCmdSize);
                                writeCommand(cmd, Buffer.concat([gubunBuf, Buffer.alloc(CmdConst.BUF_LEN_FILEDATA)]));

                                break;
                            default:
                                winston.error('FS_DOWNLOADFILE  Response Fail! -  ', resCmd.cmdCode);
                                resolve(new ResData(false, 'FS_DOWNLOADFILE  Response Fail! -  '+ resCmd.cmdCode));
                                break;
                            }
                        break;
            
                    case CmdCodes.FS_DOWNLOADSEND:
                        // 인코딩 정보를 처리하기전에 데이터 수신을 방지하기 위해 
                        
                        
                        //암호화 정보는 사용하지 않음으로 버린다.
                        gubun = resCmd.data.readInt32LE(0);
                        let encData = BufUtil.getStringWithoutEndOfString(resCmd.data, 4);
                        
                        winston.debug('file encKey %s', {encData:encData});
                        // let spliterInx = encData.lastIndexOf(CmdConst.SEP_PIPE);
                        // let encKey = encData.substring(0, spliterInx-1);
                        // let cipherTxt = encData.substring(spliterInx+1);
                        // fileEncKey =  CryptoUtil.decryptMessage(encKey, cipherTxt);

                        // try {
                        //     // UI에서 진행률을 처
                        //     chunk = resCmd.data.subarray(4);
                        //     readChunckLength = writeToFile(chunk, resCmd.size);
                        //     downloadedSize += readChunckLength

                        //     handleProgress(serverFileName, downloadedSize, fileLength)
                        //     winston.debug('FS_DOWNLOADSEND Downloading...%s  %s  %s', readChunckLength, downloadedSize, fileLength);
                        
                        // } catch (err) {
                        //     winston.error('file write error %s', err)
                        //     resolve(new ResData(false, err));
                        //     break;
                        // }
                        
                        //winston.debug('FS_DOWNLOADSEND ENC', encData, encKey, cipherTxt, fileEncKey);
                        resolve(new ResData(true));
                        break;
                    default :
                        let rcvBuf = Buffer.from(resCmd.data);
                        let dataStr = rcvBuf.toString('utf-8', 0);
                        
                        winston.error('FS_DOWNLOADSEND  Response Fail! - %s Data:%s', resCmd.cmdCode, dataStr);
                        resolve(new ResData(false, 'FS_DOWNLOADSEND  Response Fail! -  '+ resCmd.cmdCode));
                        break;
                }
            } else {
                // 서버에서 보낸 파일정보를 수신한다.
                switch(resCmd.cmdCode) {
                    case CmdCodes.FS_DOWNLOADSEND:
                        try {
                            // UI에서 진행률을 처
                            chunk = resCmd.data.subarray(4);
                            readChunckLength = writeToFile(chunk, resCmd.size);
                            downloadedSize += readChunckLength

                            handleProgress(serverFileName, downloadedSize, fileLength)
                            winston.debug('FS_DOWNLOADSEND Downloading...%s %s %s', readChunckLength, downloadedSize, fileLength);
                        
                        } catch (err) {
                            winston.error('file write error %s', err)
                            resolve(new ResData(false, err));
                            break;
                        }

                        resolve(new ResData(true));

                        break;

                    case CmdCodes.FS_DOWNLOADEND:
                        try {
                            
                            chunk = resCmd.data.subarray(4);
                            let readLen = fileLength - downloadedSize; // 마지막 남은 사이즈를 받는다.
                            readChunckLength = writeToFile(chunk, readLen);
                            downloadedSize += readChunckLength

                            // UI에서 진행률을 처리하기 위해
                            handleProgress(serverFileName, downloadedSize, fileLength)
                            winston.debug('FS_DOWNLOADEND End Download %s %s %s', readChunckLength, downloadedSize, fileLength);
                        
                        } catch (err) {
                            winston.error('file write error  %s', err)
                            resolve(new ResData(false, err));
                            break;
                        }

                        resolve(new ResData(true));
                        break;

                    default:
                        winston.error('File Receive  Response Fail! -  %s', resCmd.cmdCode);
                        resolve(new ResData(false, 'File Receive Fail! -  '+ resCmd.cmdCode));
                        break;
                }
            }
        }

        let receiveDatasProc = function(rcvData){
             winston.debug('Received Data: %s',rcvData.length);

             if (!rcvCommand){
                let dataLen = fileCmdSize;
                if (sndCommand) {
                    dataLen = sndCommand.getResponseLength();
                }

                // 수신된 CommandHeader가 없다면 헤더를 만든다.
                let cmdLeft = BufUtil.getCommandHeader(rcvData, dataLen);
                rcvCommand = cmdLeft.command;
                rcvData = cmdLeft.leftBuf;

                if (sndCommand) {
                    rcvCommand.sendCmd = sndCommand
                }

                if (rcvCommand.readCnt == rcvCommand.getResponseLength()) {
                    receiveCommandProc(rcvCommand);
                } else if (rcvCommand.readCnt > dataLen) {
                    winston.info('>>  OVER READ !!! %s  %s', dataLen, rcvCommand)
                }

                // 남는거 없이 다 읽었다면 끝낸다.
                if (!rcvData || rcvData.length == 0) return;

            } else {

                
                // 또 받을 데이터 보다 더 들어 왔다면 자르고 남는것을 넘긴다.
                let leftLen = rcvCommand.getResponseLength() - rcvCommand.readCnt;

                winston.debug('More Receive  %s, %s', leftLen, rcvCommand)
                if (rcvData.length > leftLen) {
                    // 읽을 데이터 보다 더 들어 왔다.
                    rcvCommand.data = Buffer.concat([rcvCommand.data, rcvData.slice(0, leftLen)]);
                    rcvCommand.addReadCount(leftLen);

                    receiveCommandProc(rcvCommand);
                    rcvData = rcvData.slice(leftLen);
                } else {
                    // 필요한 데이터가 딱맞거나 작다면 그냥 다읽고 끝낸다.
                    rcvCommand.data = Buffer.concat([rcvCommand.data, rcvData]);
                    rcvCommand.addReadCount(rcvData.length);

                    if (rcvCommand.readCnt >= rcvCommand.getResponseLength()) {
                        
                        if (rcvCommand.readCnt > rcvCommand.getResponseLength()) winston.info('>>  OVER READ !!! %s, %s',rcvData.length, rcvCommand); 
                        // 제대로 다 읽었다면 Cmd 처리    
                        receiveCommandProc(rcvCommand);
                    } 
                    
                    // 더 받을게 남았았음으로 다음에 오는 데이터를 받도록 넘어간다.
                    return;
                }
            }

            winston.debug('More Read Datas........ %s', rcvData.length);
            receiveDatasProc(rcvData)
        };

        /** 지정 길이만큼 파일에 쓰고 길이를 반환한다. */
        let writeToFile = function(fileBuf, dataLength) {
            chunk = fileBuf.subarray(0, dataLength)
            winston.debug('writeToFile buf %s', {len:chunk.length, buf:chunk});
            //chunk = CryptoUtil.decryptBufferRC4(CmdConst.SESSION_KEY, chunk);
            
            try {
                fs.appendFileSync(saveFilePath, chunk);
            } catch (err) {
                winston.error('file write error %s', err)
            }

            return chunk.length;
        }

        //
        // Connection to file server
        try {
            fsSock = await createSock(SVR.ip, SVR.port);
            isConnected = true;
        } catch (err) {
            winston.error('SERVER CONNECT FAIL! %s, %s', SVR, err)
            
            if (handleOnError) handleOnError(err)
            return false;
        }
    
        // listen for incoming data
        fsSock.on("data", function(data) {
            receiveDatasProc(data)
        });                                                                                                 

        // 접속이 종료됬을때 메시지 출력
        fsSock.on('end', function(){
            winston.warn('File Download Disconnected!');
            isConnected = false;
        });
        // close
        fsSock.on('close', function(hadError){
            winston.warn("File Download Close. hadError: " + hadError);
            isConnected = false;
        });
        // 에러가 발생할때 에러메시지 화면에 출력
        fsSock.on('error', function(err){
            if (HandleOnClose) HandleOnClose(err);
            
            winston.error("File Download error.  %s", err);
            // 연결이 안되었는데 에러난것은 연결시도중 발생한 에러라 판당한다.
            isConnected = false;
        });
        
        // connection에서 timeout이 발생하면 메시지 출력
        fsSock.on('timeout', function(){
            if (handleOnErr) handleOnErr(new Error('time out'));

            winston.warn('time out');
            isConnected = false;
        });


        try {
            // 1. download ready (login)
            // 2. download check
            // 3. encKey Reqeust & DownloadStream
            // 4. download end

            // 1. Download Ready를 하면 응답에 따라 완료까지 모두 진행이 된다.
            winston.debug('1. download ready (login) %s',global.USER.userId);
            gubunBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);
            gubunBuf.writeInt32LE(1);
            fileDataBuf = Buffer.alloc(CmdConst.BUF_LEN_FILEDATA);
            fileDataBuf.write(global.USER.userId);
        
            cmd = new CommandHeader(CmdCodes.FS_LOGINREADY, 0);
            cmd.setResponseLength(fileCmdSize);
            writeCommand(cmd, Buffer.concat([gubunBuf, fileDataBuf]));

        } catch (err) {
            winston.error('Download File Fail! %s %s %s %s %s', serverIp, serverPort, serverFileName, saveFilePath, err);
            resolve(new ResData(false, err));
        }
    });
}



module.exports = {
    downloadFile: downloadFile
  }
