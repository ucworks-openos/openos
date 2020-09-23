import React from 'react'
import ChatMessages from './ChatMessages';
// import { useDispatch, useSelector } from 'react-redux';

function ChatPanel() {
    // const dispatch = useDispatch();
    // const chats = useSelector(state => state.chats)

    return (
        <div className="chat-area">
            {/* <div className="divider-wrap no-more-chat">
                <div className="divider-txt">이전 대화가 없습니다</div>
                <div className="divider"></div>
            </div>
            <div className="divider-wrap speech-date">
                <div className="divider-txt">2020-08-21-금</div>
                <div className="divider"></div>
            </div> */}
            <ChatMessages />
        </div>
    )
}

export default ChatPanel
