import React from 'react'
import { writeDebug } from '../../common/ipcCommunication/ipcLogger';
import { getGlobalUserConfig } from '../../common/util/commonUtil';
import { ExternalURLs } from '../../enum/external';
const { remote } = window.require("electron")

function TeamSpacePage() {

    // `http://27.96.131.93:8090/ucweb/notice/list?sendID=${remote.getGlobal('USER').userId}&lang=korean`;
    const url = ExternalURLs.BAND_FRONT_BASE + ExternalURLs.BAND_PAGE + `?accessToken=${getGlobalUserConfig('bandLoginToken')}`;;
    const iframe = `<iframe src=${url} ></iframe>`;

    // let accessToken = getGlobalUserConfig('bandLoginToken')
    // let iframe = '<P>Team Space에 로그인 할수 없습니다.</P>'
    // if (accessToken) {
    //     // http://27.96.131.93/?accessToken=eyJhbGciOiJIUzI1NiJ9.MjMxNDM.EbU8L-1KnU_G03Z2FT5dnQmKEUoqemrp6N842CObkb4
    //     let url = ExternalURLs.BAND_FRONT_BASE + ExternalURLs.BAND_PAGE + `?accessToken=${accessToken}`;
    //     iframe = `<iframe src=${url} ></iframe>`;

    //     writeDebug('NoticePage  ', url)
    // }

    writeDebug('TeamSpacePage  ', url)
    return (
        <div dangerouslySetInnerHTML={{ __html: iframe }} />
    )
}

export default TeamSpacePage
