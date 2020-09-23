import React, { useEffect, useState, useRef } from 'react'
import userThumbnail from "../../../assets/images/img_user-thumbnail.png";
import { useDispatch, useSelector } from 'react-redux';
import {
    getInitialChatMessages
} from "../../../redux/actions/chat_actions";
import moment from 'moment';
import { getUserInfos } from '../../ipcCommunication/ipcCommon'
function ChatMessages() {
    const dispatch = useDispatch();
    const chatMessages = useSelector(state => state.chats.chatMessages)
    const currentChatRoom = useSelector(state => state.chats.currentChatRoom)
    const [chatMessagesWithUserInfos, setChatMessagesWithUserInfos] = useState([])
    const messagesEndRef = useRef(null)
    console.log('chatMessages', chatMessages)
    console.log('chatMessages', currentChatRoom)

    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    };

    useEffect(() => {
        scrollToBottom()
    }, [chatMessages])

    useEffect(() => {
        (chatMessages &&
            getChatMessagesWithUserInfos()
        )
    }, [chatMessages])

    useEffect(() => {
        if(currentChatRoom) {
            if(currentChatRoom.newChatRoom) {
                setChatMessagesWithUserInfos([])
            } else {
                dispatch(getInitialChatMessages(currentChatRoom.room_key, currentChatRoom.last_line_key))
            }
        }
    }, [currentChatRoom])

    const getChatMessagesWithUserInfos = async () => {
        let newChatMessages = [];
        for (let index = 0; index < chatMessages.length; index++) {
            const element = chatMessages[index];
            // let userInfoResult = await getUserInfos([element.chat_send_id])
            // console.log('userInfoResult.data.items', userInfoResult)
            // element.userInfo = userInfoResult.data.items !== undefined ? userInfoResult.data.items.node_item : userInfoResult
            newChatMessages.push(element)
        }
        setChatMessagesWithUserInfos(newChatMessages)
    }

    const renderChatMessages = () => (
        chatMessagesWithUserInfos && chatMessagesWithUserInfos.map((chat, index) => {
            if (chat.chat_send_id === `${sessionStorage.getItem("loginId")}`) {
                return (
                    <div key={index} className="speech-row speech-my">
                        <div className="speach-content-wrap">
                            <div className="speech-inner-wrap">
                                <div className="speech-content">
                                    {chat.chat_contents}
                                </div>
                                <div className="speech-info">
                                    <span className="unread-ppl">{chat.read_count}</span>
                                    <span className="time">  {moment(chat.chat_send_date, "YYYYMMDDHHmm").format("YYYY년 M월 D일 H시 m분")}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            } else {
                return (
                    <div className="speech-row speech-others" key={index} >
                        <div className="user-pic-wrap">
                            <img src={chat.user_picture_pos && /^http/.test(chat.user_picture_pos.value)
                                ? chat.user_picture_pos.value
                                : `/images/img_imgHolder.png`} alt="user-profile-picture" />
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
            }
        })
    )
    if (chatMessagesWithUserInfos) {
        return (
            <div>
                {renderChatMessages()}
                <div ref={messagesEndRef} />
            </div>
        )
    } else {
        return (
            <div> </div>
        )
    }

}

export default ChatMessages
