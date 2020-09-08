import React, { useEffect, useState } from 'react'
import { Alert } from 'react-bootstrap';
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
        if(inputValue.trim().length === 0) {
            alert("먼저 글자를 입력하세요 ~~")
            return;
        }
        const body = {
            "id": 5,
            "roomId": currentChatRoom,
            "person": "누구임?",
            "content": inputValue,
            "unread": 3,
            "createdAt": "202012120313"
        }
        dispatch(addChatMessage(body))
        setInputValue("")
    }

    return (
        <div class="chat-input-area">
            <div class="chat-input-wrap">
                <textarea class="chat-input" value={inputValue} onChange={onInputValueChange} placeholder="채팅 내용을 입력해주세요."></textarea>
                <button onClick={onSubmit} type="submit" class="btn-ghost-m" />
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
