import React from 'react'

function MessagePanel() {
    return (
        <div class="chat-area">
            <div class="divider-wrap no-more-chat">
                <div class="divider-txt">이전 대화가 없습니다</div>
                <div class="divider"></div>
            </div>
            <div class="divider-wrap speech-date">
                <div class="divider-txt">2020-08-21-금</div>
                <div class="divider"></div>
            </div>
        </div>
    )
}

export default MessagePanel
