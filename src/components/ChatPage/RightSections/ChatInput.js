import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {
    addChatMessage
} from '../../../redux/actions/chat_actions';

function ChatInput() {
    const dispatch = useDispatch();
    const currentChatRoom = useSelector(state => state.chats.currentChatRoom)
    const [inputValue, setInputValue] = useState("")

    const onInputValueChange = (e) => {
        setInputValue(e.currentTarget.value)
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim().length === 0) {
            alert("먼저 글자를 입력하세요 ~~")
            return;
        }
        dispatch(addChatMessage(currentChatRoom.chat_entry_ids, inputValue, false, currentChatRoom.room_key))
        setInputValue("")
    }

    return (
        <div className="chat-input-area">
            <div className="chat-input-wrap">
                <textarea className="chat-input" value={inputValue} onChange={onInputValueChange} placeholder="채팅 내용을 입력해주세요."></textarea>
                <button onClick={onSubmit} type="submit" style={{ background: "blue", color: 'white' }} className="btn-ghost-m" >전송</button>
            </div>
            <div className="input-action-wrap">
                <div className="input-action btn-txt" title="텍스트 (글꼴, 크기, 색상,표)"></div>
                <div className="input-action btn-emoticon" title="이모티콘"></div>
                <div className="input-action btn-emoji" title="이모지"></div>
                <div className="input-action btn-add-file" title="파일전송"></div>
                <div className="input-action btn-call" title="통화"></div>
                <div className="input-action btn-remote" title="원격제어"></div>
                <div className="input-action btn-shake-window" title="상대창 흔들기"></div>
                <div className="input-action btn-send-capture" title="캡처전송"></div>
                <div className="input-action btn-send-survey" title="설문보내기"></div>
                <div className="input-action btn-save-chat" title="대화저장"></div>
            </div>
        </div>
    )
}

export default ChatInput
