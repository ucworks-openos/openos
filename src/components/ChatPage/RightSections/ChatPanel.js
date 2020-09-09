import React from 'react'
import ChatMessages from './ChatMessages';
// import { useDispatch, useSelector } from 'react-redux';

function ChatPanel() {
    // const dispatch = useDispatch();
    // const chats = useSelector(state => state.chats)

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
            <ChatMessages />
        </div>
    )
}

export default ChatPanel
