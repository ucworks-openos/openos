import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import {
    getMessageHo
} from "../../../redux/actions/message_actions";
import MessageInfo from "./MessageInfo";

function MessageContent() {
    const dispatch = useDispatch();
    const content = useSelector(state => state.messages.message)
    const currentMessage = useSelector(state => state.messages.currentMessage)
    useEffect(() => {
        dispatch(getMessageHo(currentMessage))
    }, [currentMessage])

    if (content) {
        return (
            <div className="message-wrapper">
                <MessageInfo />
                <div className="message-area">
                    <div dangerouslySetInnerHTML={{ __html: content.msg_content }} />
                </div>
                {/* 
                    <h4>메시지 파일 리스트</h4>
                    {content.msg_file_list ? content.msg_file_list : "파일 없음"} 
                */}
            </div>
        )
    } else {
        return (
            <div>
                Loading...
            </div>
        )
    }

}

export default MessageContent
