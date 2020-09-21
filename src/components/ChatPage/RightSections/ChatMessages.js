import React, { useEffect } from 'react'
import userThumbnail from "../../../assets/images/img_user-thumbnail.png";
import { useDispatch, useSelector } from 'react-redux';
import {
    getInitialChatMessages
} from "../../../redux/actions/chat_actions";

function ChatMessages() {
    const dispatch = useDispatch();
    const chats = useSelector(state => state.chats.chatMessages)
    const currentChatRoom = useSelector(state => state.chats.currentChatRoom)

    useEffect(() => {
        dispatch(getInitialChatMessages(currentChatRoom))
    }, [currentChatRoom])

    const renderChatMessages = () => (
        chats && chats.map(message => {
            return (
                <div className="speech-row speech-others" key={message.id} >
                    <div className="user-pic-wrap">
                        <img src={userThumbnail} alt="user-profile-picture" />
                    </div>
                    <div className="speach-content-wrap">
                        <div className="speaker-info-wrap">
                            {message.person}
                        </div>
                        <div className="speech-inner-wrap">
                            <div className="speech-content">
                                {message.content}
                            </div>
                            <div className="speech-info">
                                <span className="unread-ppl read-all">{message.unread}</span>
                                <span className="time">{message.createdAt}</span>
                            </div>
                        </div>
                    </div>
                </div >
            )
        })
    )

    return (
        <div>
            {renderChatMessages()}
        </div>
    )
}

export default ChatMessages
