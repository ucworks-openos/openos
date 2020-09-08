import React from 'react'

function ChatInput() {
    return (
        <div class="chat-input-area">
            <div class="chat-input-wrap">
                <textarea class="chat-input" placeholder="채팅 내용을 입력해주세요."></textarea>
                <input type="submit" value="전송" class="btn-ghost-m" />
            </div>
            <div class="input-action-wrap">
                <div class="input-action btn-txt" title="텍스트 (글꼴, 크기, 색상,표)"></div>
                <div class="input-action btn-emoticon" title="이모티콘"></div>
                <div class="input-action btn-emoji" title="이모지"></div>
                <div class="input-action btn-add-file" title="파일전송"></div>
                <div class="input-action btn-call" title="통화"></div>
                <div class="input-action btn-remote" title="원격제어"></div>
                <div class="input-action btn-shake-window" title="상대창 흔들기"></div>
                <div class="input-action btn-send-capture" title="캡처전송"></div>
                <div class="input-action btn-send-survey" title="설문보내기"></div>
                <div class="input-action btn-save-chat" title="대화저장"></div>
            </div>
        </div>
    )
}

export default ChatInput
