const logger = require('../../logger');
const fs = require('fs');

const CommandHeader = require('./command-header');
const CmdCodes = require('./command-code');
const CmdConst = require('./command-const');
const CryptoUtil = require('../utils/utils-crypto');
const BufUtil = require('../utils/utils-buffer');
const fsAPI = require('../net-core/network-fs-core');
const ResData = require('../ResData');
const { ENCODE_TYPE_OTS, SESSION_KEY } = require('./command-const');
const { downloadFile } = require('./file-downloader');
const { send } = require('../ipc/ipc-cmd-sender');

const defaultFileCmdLength = 8+4+CmdConst.BUF_LEN_FILEDATA; // header(8) + gubun(4) + data(4096)

String.prototype.insert = function(index, string) {
    if (index > 0) {
        return this.substring(0, index) + string + this.substr(index);
    }

    return string + this;
};

async function reqDownloadFile(serverIp, serverPort, serverFileName, saveFilePath) {

    // 같은 파일이 있다면 뒤에 숫자를 붙여준다.
    let sameFileCnt = 1;

    let tmpFilePath = saveFilePath;
    while (fs.existsSync(tmpFilePath)) {
        tmpFilePath = saveFilePath.insert(saveFilePath.lastIndexOf('.'), `(${sameFileCnt++})`)
    }

    return downloadFile(serverIp, serverPort, serverFileName, tmpFilePath,
        function (serverFileName, downloadLength, fileLength) {
            // UI에서 진행률을 처리할수 있도록 전송되는 정보를 보내준다.
            send('download-file-progress', serverFileName, downloadLength, fileLength)
        }, 
        function(error) {
            logger.err('downloadFile error', serverFileName, tmpFilePath, error);
        });
}

/**
 * 파일을 업로드 합니다.
 * 무조건 OTS로 암호화 합니다.
 * @param {String} uploadKey  // Rander에서 업로드 정보를 수신할때 구분할수 있는키
 * @param {String} filePath   // 업로드 파일
 * @returns {ResData} data에 ServerFileName이 있음
 */
async function reqUploadFile(uploadKey, filePath) {

    try {

        let fileLength = fs.statSync(filePath).size;

        logger.info('1. UploadFile Start %s, %s, %s',uploadKey, filePath, fileLength);

        let res = await fsAPI.connectFS();

        if (!res.resCode) {
            // could not Connect! check file Server
            return new ResData(false, 'Can not Connect to FS.');
        }

        // 1. fs login
        res = await loginReady(global.USER.userId);
        if (!res.resCode) {
            close();
            return new ResData(false, res);
        }

        logger.info('2. UploadFile loginReady completed.', res);

        // 2. upload check
        let fileBaseName = require("path").basename(filePath);
        res = await uploadCheck(fileBaseName, fileLength);
        if (!res.resCode) {
            close();
            return new ResData(false, res);
        }

        logger.info('3. UploadFile uploadCheck completed.', res);

        // 3. 암호키를 전송한다.
        res = await setUploadFileEncKey();
        if (!res.resCode) {
            close();
            return new ResData(false, res);
        }

        logger.info('4. UploadFile setUploadFileEncKey completed.', res);

        // 4. 파일을 전송한다.
        res = await uploadFileStream(uploadKey, filePath);
        if (!res.resCode) {
            close();
            return new ResData(false, res);
        }
        logger.info('5. UploadFile uploadFileStream completed.', res);

        // 5. 파일 전송 완료        
        res = await endUploadFile(fileBaseName, fileLength);
        if (!res.resCode) {
            close();
            return new ResData(false, res);
        }

        logger.info('6. UploadFile completed.', res);
        
        // 서버 파일명이 온다.
        return res;
    } catch (err) {
        logger.error('Upload File Fail! %s %s %s', uploadKey, filePath, err);
        return new ResData(false, err);
    }
}

/**
 * 연결을 종료합니다.
 */
function close() {
    logout(); // 로그아웃 후 닫는다.
    fsAPI.close();
}

/**
 * 로그아웃을 요청합니다.
 */
function logout() {
    var gubunBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);
    gubunBuf.writeInt32LE(1);

    fsAPI.writeCommandFS(new CommandHeader(CmdCodes.FS_ERROR, 0), Buffer.concat([gubunBuf, Buffer.alloc(CmdConst.BUF_LEN_FILEDATA)]));
}

/**
 * 1. 파일서버 로그인 요청
 * @param {String} userId 
 */
function loginReady(userId) {
    logger.info('loginReady %s',userId);
    return new Promise(async function(resolve, reject) {

        var gubunBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);
        gubunBuf.writeInt32LE(1);
        var userIdBuf = Buffer.alloc(CmdConst.BUF_LEN_FILEDATA);
        userIdBuf.write(userId);
    
        let dataBuf = Buffer.concat([gubunBuf, userIdBuf]);

        let cmd = new CommandHeader(CmdCodes.FS_LOGINREADY, 0, function(resData){
            resolve(resData);
        });
        cmd.setResponseLength(defaultFileCmdLength) // 파일 커맨드는 Read Length 가 고정된다.
        fsAPI.writeCommandFS(cmd, dataBuf);
    });
}

//
// upload functions
//#region FILE UPLOAD ...

/**
 * 2. 파일서버 업로드 준비 요청
 * UploadFileRequest - UploadReadyResponse
 * @param {String} fileBaseName 
 */
function uploadCheck(fileBaseName, fileLength) {
    logger.info('uploadCheck %s',fileBaseName);
    return new Promise(async function(resolve, reject) {

        let fileCmd = CmdCodes.FS_UPLOADFILE;
        
        if (fileLength > global.BigFileLimit) {
            fileCmd = CmdCodes.FS_BIGUPLOADFILE;
        }

        let gubunBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);
        gubunBuf.writeInt32LE(1);

        let fileNameBuf = Buffer.alloc(CmdConst.BUF_LEN_FILEDATA)
        fileNameBuf.write(fileBaseName, global.ENC);

        let dataBuf = Buffer.concat([gubunBuf, fileNameBuf]);

        let cmd = new CommandHeader(fileCmd, 0, function(resData){
            resolve(resData);
        });
        cmd.setResponseLength(defaultFileCmdLength) // 파일 커맨드는 Read Length 가 고정된다.
        fsAPI.writeCommandFS(cmd, dataBuf);
    });
}

/** 
 * 3. 암호화 키 전송 
 * UploadFileSendRequest - 
 */
function setUploadFileEncKey() {
    return new Promise(async function(resolve, reject) {
        // gubun ENCODE_TYPE_NO_SERVER => 3
        let gubunBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);
        gubunBuf.writeInt32LE(1);

        // encInfo
        let encInfo = CryptoUtil.encryptText(ENCODE_TYPE_OTS, SESSION_KEY)
        let encKey = encInfo.encKey + CmdConst.SEP_PIPE + encInfo.cipherContent;
        let encKeyBuf = Buffer.alloc(CmdConst.BUF_LEN_FILEDATA)

        encKeyBuf.write(encKey, global.ENC);
        logger.info('setUploadFileEncKey %s', encKey);

        let dataBuf = Buffer.concat([gubunBuf, encKeyBuf]);
        fsAPI.writeCommandFS(new CommandHeader(CmdCodes.FS_UPLOADSEND, 140), dataBuf);
        resolve(new ResData(true, encInfo));
    });
}

/** 4. 파일 데이터 전송 */
function uploadFileStream(uploadKey, filePath) {

    logger.info('uploadFileStream %s %s',uploadKey, filePath);
    return new Promise(async function(resolve, reject) {
        

        /* 문자열을 라인별로 읽거나 전체를 읽는것을 제외하고
         Binary형태 Buffer로 받을려면 readFile()로는 한번에 파일 전체를 읽어 메모리 낭비가 생긴다.
         이를 방지하기 위해 Stream으로 읽어 처리
        */
        let fileLength = fs.statSync(filePath).size;
        let uploadedLength = 0;

        const readStream = fs.createReadStream(filePath, {highWaterMark: CmdConst.BUF_LEN_FILEDATA});

        let readBuf = Buffer.alloc(0);
        readStream.on('data', (chunk) => {
            //readFileLength = chunk.length;

            // 단순히 세션키로 암호화 한다.
            //chunk = CryptoUtil.encryptBufferRC4(CmdConst.SESSION_KEY, chunk);

            // 파일데이터가 남았음에도 highWaterMark 만큼 읽지 않는 파일이 있다. ex)pptx
            // 따라서 보낼 버퍼만큼 다 채워서 보내야 한다. 

            // 이전에 보내고 남은 버퍼를 같이 처리한다.
            readBuf = Buffer.concat([readBuf, chunk]);

            // 읽은 데이터가 BUF_LEN_FILEDATA를 넘는다면 해당 길이만큼 보내고 남긴다.
            while(readBuf.length >= CmdConst.BUF_LEN_FILEDATA) {
                chunk = readBuf.slice(0, CmdConst.BUF_LEN_FILEDATA);
                readBuf = readBuf.slice(CmdConst.BUF_LEN_FILEDATA);

                uploadedLength += chunk.length;
                uploadData(uploadKey, fileLength, uploadedLength, chunk)
            }

            // 남은 데이터를 보니 파일을 다 읽은 거라면 빈 버퍼를 채워 보내고 끝낸다.
            if (uploadedLength + readBuf.length >= fileLength) {
                uploadedLength += readBuf.length;
                uploadData(uploadKey, fileLength, uploadedLength, readBuf);
                readBuf = Buffer.alloc(0);
            }
        });
        
        readStream.on('end', () => {
            logger.info('file transger end! file length:%s, uploaded:%s', fileLength, uploadedLength);
            resolve(new ResData(true, 'file upload stream completed.'))
        })

        readStream.on('error', (err) => {
            // Exception을 만들지 않는다..
            logger.error('uploadFileStream err %s', err)
            resolve(new ResData(false, err));
        })
    });
}

/**
 * 서버로 파일 바이너리 데이터를 전송한다.
 * @param {String} uploadKey 
 * @param {Number} fileLength 
 * @param {Number} uploadedLength 
 * @param {Array} fileBuf 
 */
function uploadData (uploadKey, fileLength, uploadedLength, fileBuf) {
    let gubunBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);
    gubunBuf.writeInt32LE(1);

    let bufSize = fileBuf.length;

    // file Buffer가 BUF_LEN_FILEDATA보다 작으면 채워서 보내야 한다. 
    if (fileBuf.length < CmdConst.BUF_LEN_FILEDATA) {
        let diffLen = CmdConst.BUF_LEN_FILEDATA - fileBuf.length; // 남은 Buffer를 메운다.
        fileBuf = Buffer.concat([fileBuf, Buffer.alloc(diffLen)]);
    }
        
    let dataBuf = Buffer.concat([gubunBuf, fileBuf])

    // 송신/수신 데이터길이가 다르나, 전문에 길이데이터가 없음으로 따로 설정한다.
    // let cmd = new CommandHeader(CmdCodes.FS_UPLOADSEND, readFileLength);
    // cmd.setResponseLength(defaultFileCmdLength); 
    fsAPI.writeCommandFS(new CommandHeader(CmdCodes.FS_UPLOADSEND, bufSize), dataBuf);

    logger.debug('uploadData file binary. key:%s leng:%s upload:%s Buf:',uploadKey,  fileLength, uploadedLength, dataBuf);

    // UI에서 진행률을 처리할수 있도록 전송되는 정보를 보내준다.
    send('upload-file-progress', uploadKey, uploadedLength, fileLength)
}

/** 5. 파일전송 완료 */
function endUploadFile(fileName, fileSize) {
    logger.info('endUploadFile ')

    return new Promise(async function(resolve, reject) {

        let cmd;
         
        // gubun ENCODE_TYPE_NO_SERVER => 3
         let gubunBuf = Buffer.alloc(CmdConst.BUF_LEN_INT);
         gubunBuf.writeInt32LE(1);

         let fileData = Buffer.alloc(CmdConst.BUF_LEN_FILEDATA);
         
        if (global.USE_FILE2GIGA) {
            // 2G 옵션이 있는경우 fileData에 Size 정보를 넣는다.
            cmd = new CommandHeader(CmdCodes.FS_UPLOADEND, 8+4+CmdConst.BUF_LEN_FILEDATA, function(resData){
                logger.info('endUploadFile resData, %s', resData)
                resolve(resData);
            });

            fileData.write(fileSize+'', global.ENC);
        } else {
            // 2G 옵션이 없는경우 fileData에 FileName 정보를 넣는다.
            cmd = new CommandHeader(CmdCodes.FS_UPLOADEND, fileSize, function(resData){
                logger.info('endUploadFile resData, %s', resData)
                resolve(resData);
            });

            fileData.write(fileName, global.ENC);
        }

        logger.debug('File Upload End.  2G-Option:', global.USE_FILE2GIGA, cmd, BufUtil.getStringWithoutEndOfString(fileData));
        
        let dataBuf = Buffer.concat([gubunBuf, fileData]);
        cmd.setResponseLength(8+4+CmdConst.BUF_LEN_FILEDATA);

        fsAPI.writeCommandFS(cmd, dataBuf);
    });
}

//#endregion FILE UPLOAD ...


module.exports = {
    reqDownloadFile: reqDownloadFile,
    reqUploadFile: reqUploadFile,
    close: close
}
