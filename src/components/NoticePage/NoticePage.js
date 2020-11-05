import React from 'react'
import { writeDebug } from '../../common/ipcCommunication/ipcLogger';
import { ExternalURLs } from '../../enum/external';
const { remote } = window.require("electron")

function NoticePage() {
    // `http://27.96.131.93:8090/ucweb/notice/list?sendID=${remote.getGlobal('USER').userId}&lang=korean`;
    const url = ExternalURLs.NOTICE_BASE + ExternalURLs.NOTICE_LIST + `?sendID=${remote.getGlobal('USER').userId}&lang=korean`;
    const iframe = `<iframe src=${url} ></iframe>`;

    writeDebug('NoticePage  ', url)

    return (
        <div dangerouslySetInnerHTML={{ __html: iframe }} />
    )
}

export default NoticePage

