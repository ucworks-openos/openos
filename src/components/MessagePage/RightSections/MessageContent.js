import React, { useEffect } from "react";
import userThumbnail from "../../../assets/images/img_user-thumbnail.png";
import { useDispatch, useSelector } from 'react-redux';
import {
    getMessageHo
} from "../../../redux/actions/message_actions";

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
                <div style={{ overflow: 'scroll', padding: 16 }}>

                    <h4>보낸 사람</h4>
                    {content.msg_send_name}
                    <h4>받는 사람</h4>
                    {content.msg_recv_name}
                    <h4>title:</h4>
                    {content.msg_subject}
                    <h4>구분:</h4>
                    {content.gubun}
                    <h4>보낸날짜:</h4>
                    {content.msg_send_date}
                    <h4>메시지 파일 리스트</h4>
                    {content.msg_file_list ? content.msg_file_list : "파일 없음"}

                    <h4>내용</h4>
                    <div dangerouslySetInnerHTML={{ __html: content.msg_content }} />

                </div>
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
