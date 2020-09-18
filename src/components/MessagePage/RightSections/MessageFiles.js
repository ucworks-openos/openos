import React from 'react'

function MessageFiles() {
    return (
        <div class="attatched-file-area">
            <div class="attatched-file-header-wrap">
                <div class="attatched-file-title">첨부파일(5)</div>
                <div class="attatched-file-action open-folder">
                    <input type="checkbox" id="open-folder-inner" />
                    <label for="open-folder-inner" >다운로드 후 저장 폴더 열기</label>
                </div>
                <div class="attatched-file-action download-all">전체 다운로드</div>
            </div>
            <div class="attatched-file-wrap">
                <div class="attatched-file-row already-downloaded">
                    <i class="icon-attatched-file"></i>
                    <div class="label-attatched-file-name">01_산출물전체이미지.zip (100Mb)</div>
                    <div class="btn-attatched-file-save-other-name">다른 이름으로 저장</div>
                    <div class="btn-attatched-file-open">열기</div>
                </div>
                <div class="attatched-file-row">
                    <i class="icon-attatched-file"></i>
                    <div class="label-attatched-file-name">02_asset_bmp.zip (100Mb)</div>
                    <div class="btn-attatched-file-name-save">저장</div>
                </div>
                <div class="attatched-file-row">
                    <i class="icon-attatched-file"></i>
                    <div class="label-attatched-file-name">03_asset_android.zip (100Mb)</div>
                    <div class="btn-attatched-file-name-save">저장</div>
                </div>
                <div class="attatched-file-row">
                    <i class="icon-attatched-file"></i>
                    <div class="label-attatched-file-name">04_asset_ios.zip (100Mb)</div>
                    <div class="btn-attatched-file-name-save">저장</div>
                </div>
                <div class="attatched-file-row">
                    <i class="icon-attatched-file"></i>
                    <div class="label-attatched-file-name">05_디자인설명.pptx (100Mb)</div>
                    <div class="btn-attatched-file-name-save">저장</div>
                </div>
            </div>
        </div >
    )
}

export default MessageFiles
