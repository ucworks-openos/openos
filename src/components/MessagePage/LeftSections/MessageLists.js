import React from 'react'
import userThumbnail from "../../../assets/images/img_user-thumbnail.png";
import {
    getMessageHo,
    setCurrentMessage,
    getMoreMessages
} from "../../../redux/actions/message_actions";
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

function MessagesLists() {
    const dispatch = useDispatch();
    const page = useSelector(state => state.messages.page)
    const messageCounts = useSelector(state => state.messages.messageCounts)
    const messageDefaultCounts = useSelector(state => state.messages.messageDefaultCounts)
    const messageLists = useSelector(state => state.messages.messageLists)
    const currentMessage = useSelector(state => state.messages.currentMessage)
    const currentMessageListType = useSelector(state => state.messages.currentMessageListType)    

    const onMessageClick = (messageId) => {
        dispatch(getMessageHo(messageId))
        dispatch(setCurrentMessage(messageId))
    }

    const onLoadMoreClick = () => {
        dispatch(getMoreMessages(currentMessageListType, page, messageDefaultCounts))
    }

    const renderMessageLists = () => (
        messageLists && messageLists.map((message, index) => {
            const isCurrentMessage = message.msg_key === currentMessage ? "current" : "";
            let receieveNames = message.msg_recv_name.split('|')
            const renderDestInfo = receieveNames.map(user => {
                if (currentMessageListType === 'SEND') {
                    return  <div className="message-title">To :<span key={uuidv4()}> {user}{" "}</span></div>
                } else {
                    return  <div className="message-title">From :<span key={uuidv4()}> {message.msg_send_name}{" "}</span></div>
                }
            })

            const renderSubInfo = receieveNames.map(user => {
                if (currentMessageListType === 'SEND') {
                    return  <div className="message-from sub1">From :{message.msg_send_name}{" "}</div>
                } else {
                    return  <div className="message-from sub1">to :{user}{" "}</div>
                }
            })
            
            return (
                <li className={`message-list-single  ${isCurrentMessage}`} key={uuidv4()} onClick={() => onMessageClick(message.msg_key)}>
                    <div className="list-info-area">
                        <div className="list-row 1">
                            {renderDestInfo}
                        </div>
                        <div className="list-row 2">
                            <div className="message-summary">
                                <div dangerouslySetInnerHTML={{ __html: message.msg_subject }} />
                            </div>
                        </div>
                        <div className="list-row 3">
                            <div className="message-from-wrap">
                                <div className="user-pic-wrap">
                                    <img src={userThumbnail} alt="user-profile-picture" />
                                </div>
                                
                                {renderSubInfo}
                                <div className="ppl-position sub1"></div>
                            </div>
                            <div className="receive-time sub1">
                                {moment(message.msg_send_date, "YYYYMMDDHHmm").format("YYYY년 M월 D일 H시 m분")}
                            </div>
                        </div>
                    </div>
                </li>
            )
        })
    )

    return (
        <div>
            {renderMessageLists()}
            {
                page * messageDefaultCounts <= messageCounts &&
                <div style={{ textAlign: 'center' }}>
                    <button onClick={onLoadMoreClick} style={{ border: '1px solid black', padding: '1rem' }} >더보기</button>
                </div>
            }
        </div>
    )
}

export default MessagesLists



{/* <li className="chat-list-single  ppl-1x2">
<div className="list-thumb-area">
    <div className="user-pic-wrap">
        <img src={userThumbnail} alt="user-profile-picture" />
    </div>
    <div className="user-pic-wrap">
        <img src={userThumbnail} alt="user-profile-picture" />
    </div>
</div>
<div className="list-info-area">
    <div className="list-row 1">
        <div className="chat-ppl-num">
            3
        </div>
        <div className="chat-room-name">
            김철수<span className="ppl-position">과장 (개발팀)</span>, 김하나<span className="ppl-position">과장 (개발팀)</span>
        </div>
        <div className="chat-counter unread">
            3
        </div>
    </div>
    <div className="list-row 2">
        <div className="last-chat">
            (사진)
        </div>
        <div className="icon-chat-noti on"></div>
    </div>
    <div className="list-row 3">
        <div className="last-chat-from sub1">
            김철수
        </div>
        <div className="last-chat-time sub1">
            오전 10:55
        </div>
    </div>
</div>
</li>
<li className="chat-list-single  ppl-1x3">
<div className="list-thumb-area">
    <div className="user-pic-wrap">
        <img src={userThumbnail} alt="user-profile-picture" />
    </div>
    <div className="user-pic-wrap">
        <img src={userThumbnail} alt="user-profile-picture" />
    </div>
    <div className="user-pic-wrap">
        <img src={userThumbnail} alt="user-profile-picture" />
    </div>
</div>
<div className="list-info-area">
    <div className="list-row 1">
        <div className="chat-ppl-num">
            4
        </div>
        <div className="chat-room-name">
            김철수<span className="ppl-position">과장 (개발팀)</span>, 김하나<span className="ppl-position">과장 (개발팀)</span>, 이두리<span className="ppl-position">과장 (개발팀)</span>
        </div>
        <div className="chat-counter unread">
            999+
        </div>
    </div>
    <div className="list-row 2">
        <div className="last-chat">
            (이모티콘)
        </div>
        <div className="icon-chat-noti on"></div>
    </div>
    <div className="list-row 3">
        <div className="last-chat-from sub1">
            이두리
        </div>
        <div className="last-chat-time sub1">
            오전 10:00
        </div>
    </div>
</div>
</li>
<li className="chat-list-single  ppl-1xn">
<div className="list-thumb-area">
    <div className="user-pic-wrap">
        <img src={userThumbnail} alt="user-profile-picture" />
    </div>
    <div className="user-pic-wrap">
        <img src={userThumbnail} alt="user-profile-picture" />
    </div>
    <div className="user-pic-wrap">
        <img src={userThumbnail} alt="user-profile-picture" />
    </div>
    <div className="user-pic-wrap">
        <img src={userThumbnail} alt="user-profile-picture" />
    </div>
</div>
<div className="list-info-area">
    <div className="list-row 1">
        <div className="chat-ppl-num">
            5
        </div>
        <div className="chat-room-name">
            김철수<span className="ppl-position">과장 (개발팀)</span>, 김하나<span className="ppl-position">과장 (개발팀)</span>, 이두리<span className="ppl-position">과장 (개발팀)</span>, 최서이<span className="ppl-position">주임 (개발팀)</span>
        </div>
        <div className="chat-counter unread">
            999+
        </div>
    </div>
    <div className="list-row 2">
        <div className="last-chat">
            네~ 그리고 다음주 미팅 끝나고 식사는 어딜로 예약할까요? 선호하시는 메뉴 있으시면 말씀해주세요
        </div>
        <div className="icon-chat-noti off"></div>
    </div>
    <div className="list-row 3">
        <div className="last-chat-from sub1">
            김하나
        </div>
        <div className="last-chat-time sub1">
            2020-08-23
        </div>
    </div>
</div>
</li>
<li className="chat-list-single  ppl-1xn current-chat">
<div className="list-thumb-area">
    <div className="user-pic-wrap">
        <img src={userThumbnail} alt="user-profile-picture" />
    </div>
    <div className="user-pic-wrap">
        <img src={userThumbnail} alt="user-profile-picture" />
    </div>
    <div className="user-pic-wrap">
        <img src={userThumbnail} alt="user-profile-picture" />
    </div>
    <div className="user-pic-wrap">
        <img src={userThumbnail} alt="user-profile-picture" />
    </div>
</div>
<div className="list-info-area">
    <div className="list-row 1">
        <div className="chat-ppl-num">
            6
        </div>
        <div className="chat-room-name">
            tf팀
        </div>
        <div className="chat-counter">
            0
        </div>
    </div>
    <div className="list-row 2">
        <div className="last-chat">
            네~ 그리고 다음주 미팅 끝나고 식사는 어딜로 예약할까요? 선호하시는 메뉴 있으시면 말씀해주세요
        </div>
        <div className="icon-chat-noti on"></div>
    </div>
    <div className="list-row 3">
        <div className="last-chat-from sub1">
            김하나
        </div>
        <div className="last-chat-time sub1">
            2020-08-23
        </div>
    </div>
</div>
</li>
<li className="chat-list-single  ppl-1x1 my">
<div className="list-thumb-area">
    <div className="user-pic-wrap">
        <img src={userThumbnail} alt="user-profile-picture" />
    </div>
</div>
<div className="list-info-area">
    <div className="list-row 1">
        <div className="chat-ppl-num">
            2
        </div>
        <div className="chat-room-name">
            홍길동<span className="ppl-position">과장 (개발팀)</span>
        </div>
        <div className="chat-counter">
            MY
        </div>
    </div>
    <div className="list-row 2">
        <div className="last-chat">
            (파일: 지출결의서.xls)
        </div>
        <div className="icon-chat-noti on"></div>
    </div>
    <div className="list-row 3">
        <div className="last-chat-from sub1">
            나
        </div>
        <div className="last-chat-time sub1">
            2020-08-22
        </div>
    </div>
</div>
</li>
<li className="chat-list-single  ppl-1x1">
<div className="list-thumb-area">
    <div className="user-pic-wrap">
        <img src={userThumbnail} alt="user-profile-picture" />
    </div>
</div>
<div className="list-info-area">
    <div className="list-row 1">
        <div className="chat-ppl-num">
            2
        </div>
        <div className="chat-room-name">
            김철수<span className="ppl-position">과장 (개발팀)</span>
        </div>
        <div className="chat-counter">
            0
        </div>
    </div>
    <div className="list-row 2">
        <div className="last-chat">
            네 알겠습니다
        </div>
        <div className="icon-chat-noti off"></div>
    </div>
    <div className="list-row 3">
        <div className="last-chat-from sub1">
            김철수
        </div>
        <div className="last-chat-time sub1">
            오전 11:00
        </div>
    </div>
</div>
</li>
<li className="chat-list-single  ppl-1x1">
<div className="list-thumb-area">
    <div className="user-pic-wrap">
        <img src={userThumbnail} alt="user-profile-picture" />
    </div>
</div>
<div className="list-info-area">
    <div className="list-row 1">
        <div className="chat-ppl-num">
            2
        </div>
        <div className="chat-room-name">
            김철수<span className="ppl-position">과장 (개발팀)</span>
        </div>
        <div className="chat-counter">
            0
        </div>
    </div>
    <div className="list-row 2">
        <div className="last-chat">
            네 알겠습니다
        </div>
        <div className="icon-chat-noti off"></div>
    </div>
    <div className="list-row 3">
        <div className="last-chat-from sub1">
            김철수
        </div>
        <div className="last-chat-time sub1">
            오전 11:00
        </div>
    </div>
</div>
</li>
<li className="chat-list-single  ppl-1x1">
<div className="list-thumb-area">
    <div className="user-pic-wrap">
        <img src={userThumbnail} alt="user-profile-picture" />
    </div>
</div>
<div className="list-info-area">
    <div className="list-row 1">
        <div className="chat-ppl-num">
            2
        </div>
        <div className="chat-room-name">
            김철수<span className="ppl-position">과장 (개발팀)</span>
        </div>
        <div className="chat-counter">
            0
        </div>
    </div>
    <div className="list-row 2">
        <div className="last-chat">
            네 알겠습니다
        </div>
        <div className="icon-chat-noti off"></div>
    </div>
    <div className="list-row 3">
        <div className="last-chat-from sub1">
            김철수
        </div>
        <div className="last-chat-time sub1">
            오전 11:00
        </div>
    </div>
</div>
</li>
<li className="chat-list-single  ppl-1x1">
<div className="list-thumb-area">
    <div className="user-pic-wrap">
        <img src={userThumbnail} alt="user-profile-picture" />
    </div>
</div>
<div className="list-info-area">
    <div className="list-row 1">
        <div className="chat-ppl-num">
            2
        </div>
        <div className="chat-room-name">
            김철수<span className="ppl-position">과장 (개발팀)</span>
        </div>
        <div className="chat-counter">
            0
        </div>
    </div>
    <div className="list-row 2">
        <div className="last-chat">
            네 알겠습니다
        </div>
        <div className="icon-chat-noti off"></div>
    </div>
    <div className="list-row 3">
        <div className="last-chat-from sub1">
            김철수
        </div>
        <div className="last-chat-time sub1">
            오전 11:00
        </div>
    </div>
</div>
</li>
<li className="chat-list-single  ppl-1x1">
<div className="list-thumb-area">
    <div className="user-pic-wrap">
        <img src={userThumbnail} alt="user-profile-picture" />
    </div>
</div>
<div className="list-info-area">
    <div className="list-row 1">
        <div className="chat-ppl-num">
            2
        </div>
        <div className="chat-room-name">
            김철수<span className="ppl-position">과장 (개발팀)</span>
        </div>
        <div className="chat-counter">
            0
        </div>
    </div>
    <div className="list-row 2">
        <div className="last-chat">
            네 알겠습니다
        </div>
        <div className="icon-chat-noti off"></div>
    </div>
    <div className="list-row 3">
        <div className="last-chat-from sub1">
            김철수
        </div>
        <div className="last-chat-time sub1">
            오전 11:00
        </div>
    </div>
</div>
</li>
<li className="chat-list-single  ppl-1x1">
<div className="list-thumb-area">
    <div className="user-pic-wrap">
        <img src={userThumbnail} alt="user-profile-picture" />
    </div>
</div>
<div className="list-info-area">
    <div className="list-row 1">
        <div className="chat-ppl-num">
            2
        </div>
        <div className="chat-room-name">
            김철수<span className="ppl-position">과장 (개발팀)</span>
        </div>
        <div className="chat-counter">
            0
        </div>
    </div>
    <div className="list-row 2">
        <div className="last-chat">
            네 알겠습니다
        </div>
        <div className="icon-chat-noti off"></div>
    </div>
    <div className="list-row 3">
        <div className="last-chat-from sub1">
            김철수
        </div>
        <div className="last-chat-time sub1">
            오전 11:00
        </div>
    </div>
</div>
</li> */}