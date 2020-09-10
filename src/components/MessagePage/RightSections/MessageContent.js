import React, { useEffect } from "react";
import userThumbnail from "../../../assets/images/img_user-thumbnail.png";
import { useDispatch, useSelector } from 'react-redux';
import {
    getMessage
} from "../../../redux/actions/message_actions";

function MessageContent() {
    const dispatch = useDispatch();
    const content = useSelector(state => state.messages.message)
    const currentMessage = useSelector(state => state.messages.currentMessage)
    useEffect(() => {
        dispatch(getMessage(currentMessage))
    }, [currentMessage])

    return (
        <div className="message-wrapper">
            <div style={{ height: 150, overflowY: 'scroll', marginTop: 10 }}>
                {content &&
                    <div dangerouslySetInnerHTML={{ __html: content.content }} />
                }
            </div>
        </div>
    )
}

export default MessageContent
