import React, { useEffect } from 'react'
import userThumbnail from "../../../assets/images/img_user-thumbnail.png";
import { useDispatch, useSelector } from 'react-redux';
import {
    getInitialChatMessages
} from "../../../redux/actions/chat_actions";
import moment from 'moment';

function ChatMessages() {
    const dispatch = useDispatch();
    const chatMessages = useSelector(state => state.chats.chatMessages)
    const currentChatRoom = useSelector(state => state.chats.currentChatRoom)
    useEffect(() => {
        (currentChatRoom &&
            dispatch(getInitialChatMessages(currentChatRoom.room_key, currentChatRoom.last_line_key))
        )
    }, [currentChatRoom])

    const renderChatMessages = () => (
        chatMessages && chatMessages.map((chat, index) => {
            return (
                <div className="speech-row speech-others" key={index} >
                    <div className="user-pic-wrap">
                        <img src={userThumbnail} alt="user-profile-picture" />
                    </div>
                    <div className="speach-content-wrap">
                        <div className="speaker-info-wrap">
                            {chat.chat_send_name}
                        </div>
                        <div className="speech-inner-wrap">
                            <div className="speech-content">
                                {chat.chat_contents}
                            </div>
                            <div className="speech-info">
                                <span className="unread-ppl read-all">{chat.read_count}</span>
                                <span className="time">
                                    {moment(chat.chat_send_date, "YYYYMMDDHHmm").format("YYYY년 M월 D일 H시 m분")}
                                </span>
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
