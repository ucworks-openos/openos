import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { writeDebug } from "../../../common/ipcCommunication/ipcLogger";
import {
    getMessageHo
} from "../../../redux/actions/message_actions";
import MessageInfo from "./MessageInfo";

function MessageContent(prop) {
    const message = prop.message //useSelector(state => state.messages.message)

    if (message) {
        return (
            <div className="message-wrapper">
                <MessageInfo message={prop.message}/>
                <div className="message-area">
                    <div dangerouslySetInnerHTML={{ __html: message.msg_content }} />
                </div>
                {/* 
                    <h4>메시지 파일 리스트</h4>
                    {message.msg_file_list ? message.msg_file_list : "파일 없음"} 
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
