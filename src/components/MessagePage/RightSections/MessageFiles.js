import React, {useState,useEffect} from 'react'
import { downloadFile } from '../../../common/ipcCommunication/ipcFile';
import { writeDebug, writeInfo, writeWarn } from '../../../common/ipcCommunication/ipcLogger'
import { delay } from '../../../common/util';
import { formatBytes } from '../../../common/util/fileUtil';

const electron = window.require("electron");
const { remote } = window.require("electron")

function MessageFiles(prop) {

    const [attachmentFiles, setAttachmentFiles] = useState([]);

    const downloadPath = remote.getGlobal('DOWNLOAD_PATH')
    writeDebug('MESSAGE FILE', downloadPath, prop.msgFiles);

    useEffect(() => {
        sessionStorage.setItem('attachmentFiles', JSON.stringify(attachmentFiles));
    }, [attachmentFiles])
    
    // 파일전송 모니터링
    electron.ipcRenderer.removeAllListeners('download-file-progress')
    electron.ipcRenderer.on('download-file-progress', (event, svrName, downloadLength, fileLength) => {
        writeDebug('download-file-progress', svrName, downloadLength, fileLength)

        fileDownloadProgress(svrName, ((downloadLength/fileLength)*100).toFixed(0) + '%');
    });
    
    if (prop.attachmentFiles) {
        let fileList = [];

        let fileInfoPieces = prop.msgFiles.split('|');
        for(let i=0; i < fileInfoPieces.length;) {
            let serverInfos = fileInfoPieces[i++].split(';');
            fileList.push({
                serverIp:serverInfos[0],
                serverPort: parseInt(serverInfos[1]),
                name: fileInfoPieces[i++],
                size: fileInfoPieces[i++],
                svrName: fileInfoPieces[i++],
              })
        }
   
        setAttachmentFiles(attachmentFiles.concat(fileList));
    }

    const saveAll = async () => {
        for (let i = 0; i < attachmentFiles.length; i++) {

            if (attachmentFiles[i].isCompleted) continue;

            let fullPath = downloadPath + '/' + attachmentFiles[i].name;
            writeDebug('downloadAttFile Before', attachmentFiles[i])
            let resData = await downloadFile(attachmentFiles[i].serverIp, attachmentFiles[i].serverPort, attachmentFiles[i].svrName, fullPath)
            writeInfo('file Download completed!', attachmentFiles[i].name, resData)
            fileDownloadProgress(attachmentFiles[i].svrName, 100, resData.data)

            delay(500)
        }
    }

    const downloadAttFile = (svrName) => {
        let attFile = attachmentFiles.filter((file) => file.svrName === svrName);

        if (attFile) {
            writeDebug('downloadAttFile Before', attFile)
            downloadFile(attFile.serverIp, attFile.serverPort, attFile.svrName, downloadPath + '/' + attFile.name).then((resData) => {
                fileDownloadProgress(attFile.svrName, 100, resData.data)
            })

        } else {
            writeWarn('Can Not Find File.', svrName, attachmentFiles);
        } 
    }

    const executeFile = () => {

    }

    const openFolder = () => {
        
    }

    function fileDownloadProgress(svrName, percentage, fullPath = '') {
        writeInfo('fileDownloadProgress!', svrName, percentage)
        let updateFileInfos = JSON.parse(sessionStorage.getItem('attachmentFiles'));

        updateFileInfos = updateFileInfos.map((file) => {
            if (file.path === svrName) {
                const updateItem = {
                    ...file,
                    progress: percentage,
                    fullPath: fullPath,
                    isCompleted: percentage === 100,
                }
                return updateItem;
            }
            return file;
        })
        setAttachmentFiles(updateFileInfos);
    }



    return (
        <div className="attatched-file-area">
            <div className="attatched-file-header-wrap">
                <div className="attatched-file-title">첨부파일({attachmentFiles.length})</div>
                <div className="attatched-file-action open-folder">
                    <input type="checkbox" id="open-folder-inner" />
                    <label htmlFor="open-folder-inner" >다운로드 후 저장 폴더 열기</label>
                </div>
                <div className="attatched-file-action download-all" onClick={() => {saveAll()}}>전체 다운로드</div>
            </div>
            <div className="attatched-file-wrap">
                {prop.attachmentFiles.map((file, index) => {

                    return (
                        <div className="attatched-file-row already-downloaded">
                            <i className="icon-attatched-file"></i>
                            <div className="label-attatched-file-name">{file.name} ({formatBytes(file.size)})</div>

                            {file.isCompleted?
                                <div >
                                   {/* <div className="btn-attatched-file-save-other-name" onClick={() => {saveAs(file.svrName)}}>다른 이름으로 저장</div> */}
                                    <div className="btn-attatched-file-open" onClick={() => {downloadAttFile(file.svrName)}}>저장</div>
                                </div>
                            :
                                <div >
                                    <div className="btn-attatched-file-save-other-name" onClick={() => {executeFile(file.svrName)}}>열기</div>
                                    <div className="btn-attatched-file-open" onClick={() => {openFolder(file.svrName)}}>폴더열기</div>
                                </div>
                            }
                            
                        </div>
                    );
                })}
            </div>
        </div >
    )
}

export default MessageFiles
