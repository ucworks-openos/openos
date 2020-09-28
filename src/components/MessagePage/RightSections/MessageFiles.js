import React from 'react'

function MessageFiles() {
    return (
        <div className="attatched-file-area">
            <div className="attatched-file-header-wrap">
                <div className="attatched-file-title">첨부파일(5)</div>
                <div className="attatched-file-action open-folder">
                    <input type="checkbox" id="open-folder-inner" />
                    <label htmlFor="open-folder-inner" >다운로드 후 저장 폴더 열기</label>
                </div>
                <div className="attatched-file-action download-all">전체 다운로드</div>
            </div>
            <div className="attatched-file-wrap">
                <div className="attatched-file-row already-downloaded">
                    <i className="icon-attatched-file"></i>
                    <div className="label-attatched-file-name">01_산출물전체이미지.zip (100Mb)</div>
                    <div className="btn-attatched-file-save-other-name">다른 이름으로 저장</div>
                    <div className="btn-attatched-file-open">열기</div>
                </div>
                <div className="attatched-file-row">
                    <i className="icon-attatched-file"></i>
                    <div className="label-attatched-file-name">02_asset_bmp.zip (100Mb)</div>
                    <div className="btn-attatched-file-name-save">저장</div>
                </div>
                <div className="attatched-file-row">
                    <i className="icon-attatched-file"></i>
                    <div className="label-attatched-file-name">03_asset_android.zip (100Mb)</div>
                    <div className="btn-attatched-file-name-save">저장</div>
                </div>
                <div className="attatched-file-row">
                    <i className="icon-attatched-file"></i>
                    <div className="label-attatched-file-name">04_asset_ios.zip (100Mb)</div>
                    <div className="btn-attatched-file-name-save">저장</div>
                </div>
                <div className="attatched-file-row">
                    <i className="icon-attatched-file"></i>
                    <div className="label-attatched-file-name">05_디자인설명.pptx (100Mb)</div>
                    <div className="btn-attatched-file-name-save">저장</div>
                </div>
            </div>
        </div >
    )
}

export default MessageFiles
