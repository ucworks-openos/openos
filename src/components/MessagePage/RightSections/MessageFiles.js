import React, {useState,useEffect} from 'react'
import { pathToFileURL } from 'url';
import { downloadFile } from '../../../common/ipcCommunication/ipcFile';
import { writeDebug, writeInfo, writeWarn } from '../../../common/ipcCommunication/ipcLogger'
import { shellOpenFolder, shellOpenItem } from '../../../common/ipcCommunication/ipcUtil';
import { delay } from '../../../common/util';
import { formatBytes } from '../../../common/util/fileUtil';

const electron = window.require("electron");
const { remote } = window.require("electron")

function MessageFiles(prop) {

    /**
     * 이곳에서 attfile 정보를 만들러 Randering 할려고 했으나 
     * 랜더링이 무한루프로 빠져버려.
     * 
     * 상위에서 파일 정보를 만들어 처리하도록만 한다.
     */
    const downloadPath = remote.getGlobal('DOWNLOAD_PATH')

    const [isDownloadFolderOpen, setIsDownloadFolderOpen] = useState(true);
    
    useEffect(() => {
        writeDebug('file download path:', downloadPath);
        writeDebug('attachment file:', prop.attachmentFiles);
        
        // 파일전송 모니터링
        electron.ipcRenderer.removeAllListeners('download-file-progress')
        electron.ipcRenderer.on('download-file-progress', (event, svrName, downloadLength, fileLength) => {
            let percentage = ((downloadLength/fileLength)*100).toFixed(0);

            fileDownloadProgress(svrName, percentage + '%', downloadPath);
        });
     }, []);

     useEffect(() => {
        // ipc 이벤트로 넘어오면 state가 공유되지 않음으로 sessionStorage에서 관리한다.
        sessionStorage.setItem('sessionDnAttFiles', JSON.stringify(prop.attachmentFiles));
     }, [prop.attachmentFiles])

    const saveAll = async () => {
        for (let i = 0; i < prop.attachmentFiles.length; i++) {

            if (prop.attachmentFiles[i].isCompleted) continue;

            let fullPath = downloadPath + '/' + prop.attachmentFiles[i].name;
            let resData = await downloadFile(prop.attachmentFiles[i].serverIp, prop.attachmentFiles[i].serverPort, prop.attachmentFiles[i].svrName, fullPath)
            writeInfo('file Download completed!', prop.attachmentFiles[i].name, resData)
            fileDownloadProgress(prop.attachmentFiles[i].svrName, 100, resData.data, true)

            delay(500)
        }

        if (isDownloadFolderOpen) shellOpenFolder(downloadPath);
    }

    const downloadAttFile = (svrName) => {
        let attFile = prop.attachmentFiles.filter((file) => file.svrName === svrName);

        if (attFile?.length > 0) {
            attFile = attFile[0];
            downloadFile(attFile.serverIp, attFile.serverPort, attFile.svrName, downloadPath + '/' + attFile.name).then((resData) => {
                writeInfo('file Download completed!', attFile.name, resData)
                fileDownloadProgress(attFile.svrName, 100, resData.data, true)

                if (isDownloadFolderOpen) shellOpenFolder(resData.data, true);
            })
        } else {
            writeWarn('Can Not Find File.', svrName, prop.attachmentFiles);
        } 
    }

    const executeFile = (svrName) => {
        let attFile = prop.attachmentFiles.filter((file) => file.svrName === svrName);

        if (attFile?.length > 0) {
            attFile = attFile[0];
            shellOpenItem(attFile.fullPath);
        }
    }

    const openFolder = (svrName) => {
        let attFile = prop.attachmentFiles.filter((file) => file.svrName === svrName);

        if (attFile?.length > 0) {
            attFile = attFile[0];
            shellOpenFolder(attFile.fullPath, true);
        }
    }

    function fileDownloadProgress(svrName, percentage, fullPath = '', isCompleted = false) {
        let fileList = JSON.parse(sessionStorage.getItem('sessionDnAttFiles'));

        fileList = fileList.map((file) => {
            if (file.svrName === svrName) {

                if (!file.isCompleted) {
                    let updateItem = {
                        ...file,
                        progress: percentage,
                        fullPath: fullPath,
                        isCompleted: isCompleted,
                    }

                    return updateItem;
                }
            }
            return file;
        });
        prop.setAttachmentFiles(fileList);
    }

    return (
        <div className="attatched-file-area">
            <div className="attatched-file-header-wrap">
                <div className="attatched-file-title">첨부파일({prop.attachmentFiles.length})</div>
                <div className="attatched-file-action open-folder">
                    <input type="checkbox" id="open-folder-inner" checked={isDownloadFolderOpen} onClick={()=>{setIsDownloadFolderOpen((prev) => !prev)}} />
                    <label htmlFor="open-folder-inner" >다운로드 후 저장 폴더 열기</label>
                </div>
                <div className="attatched-file-action download-all" onClick={()=>{saveAll()}}>전체 다운로드</div>
            </div>
            <div className="attatched-file-wrap">
                {prop.attachmentFiles?.map((file, index) => {

                    return (
                        <div className="attatched-file-row already-downloaded">
                            <i className="icon-attatched-file"></i>
                            <div className="label-attatched-file-name">{file.name} ({formatBytes(file.size)})  {file.progress}</div>

                            {file.isCompleted?
                                <div >
                                    <div className="btn-attatched-file-save-other-name" onClick={() => {executeFile(file.svrName)}}>&nbsp;&nbsp;열기</div>
                                    <div className="btn-attatched-file-open" onClick={() => {openFolder(file.svrName)}}>&nbsp;&nbsp;폴더열기</div>
                                </div>
                            :
                                <div >
                                   {/* <div className="btn-attatched-file-save-other-name" onClick={() => {saveAs(file.svrName)}}>&nbsp;&nbsp;다른 이름으로 저장</div> */}
                                    <div className="btn-attatched-file-open" onClick={() => {downloadAttFile(file.svrName)}}>&nbsp;&nbsp;저장</div>
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
