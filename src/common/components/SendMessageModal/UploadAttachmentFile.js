import React, { useState, useEffect} from 'react';
import { writeDebug } from '../../ipcCommunication/ipcLogger';
import { formatBytes, getTransFileData } from '../../util/fileUtil';
import DragAndDropSupport from '../DragAndDropSupport';

function UploadAttachmentFile(prop) {

    /**
     * File Select
     */
    const handleSelectFile = (e) => {
        writeDebug('handleSelectFile', Object.create(e.target.files));
        addAttachmentFiles(e.target.files);
    }

    /**
     * File Delete
     */
    const removeAttachFile = (filePath) => {
        writeDebug('removeAttachFile', filePath);
        prop.setAttachmentFiles(prop.attachmentFiles.filter((file) => file.path !== filePath))
    }

    /**
     * DragDrop
     */
    const handleDrop = (dropFiles) => {
        writeDebug('handleDrop', Object.create(dropFiles));
        addAttachmentFiles(dropFiles);
    }

    /**
     * Add Attachment File
     */
    const addAttachmentFiles = (files) => {
        let fileList = []
        for (var i = 0; i < files.length; i++) {
          if (!files[i].name) return
          fileList.push(getTransFileData(files[i]))
        }

        writeDebug('addAttachmentFiles', prop.attachmentFiles, fileList);
        prop.setAttachmentFiles(prop.attachmentFiles.concat(fileList));
    }

    return (
        <DragAndDropSupport handleDrop={handleDrop} >
            <div class="write-row add-file-wrap">
                <div class="add-file-title">첨부파일({prop.attachmentFiles.length})</div>
                <label for="btn-add-file" class="label-add-file btn-solid-s">첨부하기</label>
                <input type="file" multiple="multiple" id="btn-add-file" class="btn-add-file" onChange={handleSelectFile} />
            </div>

            <div class="attatched-file-wrap">
                {writeDebug('attFileRander', prop.attachmentFiles)}
                {prop.attachmentFiles.map((file, index) => {
                    return (
                        <div class="attatched-file-row" key={index}>
                            <i class="icon-attatched-file"></i>
                            <div class="label-attatched-file-name">{file.name} ({formatBytes(file.size)}) {file.progress}</div>
                            {/* <div class="label-attatched-file-name">{file.name} ({formatBytes(file.size)}) {file.progress?'['+file.progress+']':''}</div> */}
                            <div class="btn-attatched-file-name-remove" onClick={() => {removeAttachFile(file.path)}}>&nbsp;삭제</div>
                        </div>
                    );
                })}
            </div>
        </DragAndDropSupport>
    )
}

export default UploadAttachmentFile
