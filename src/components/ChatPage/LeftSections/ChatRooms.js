import React from 'react'
import userThumbnail from "../../../assets/images/img_user-thumbnail.png";
import {
    getInitialChatMessages,
    setCurrentChatRoom
} from "../../../redux/actions/chat_actions";
import { useDispatch, useSelector } from 'react-redux';

function ChatRooms() {
    const dispatch = useDispatch();
    const chats = useSelector(state => state.chats.chatRooms)

    const onChatRoomClick = (roomId) => {
        dispatch(getInitialChatMessages(roomId))
        dispatch(setCurrentChatRoom(roomId))
    }

    const renderChatRoom = () => (
        chats && chats.map(room => {
            return (
                <li class="chat-list-single  ppl-1x2" key={room.id} onClick={() => onChatRoomClick(room.id)}>
                    <div class="list-thumb-area">
                        <div class="user-pic-wrap">
                            <img src={userThumbnail} alt="user-profile-picture" />
                        </div>
                        <div class="user-pic-wrap">
                            <img src={userThumbnail} alt="user-profile-picture" />
                        </div>
                    </div>
                    <div class="list-info-area">
                        <div class="list-row 1">
                            <div class="chat-ppl-num">
                                {room.peopleCount}
                            </div>
                            <div class="chat-room-name">
                                {room.mainPerson}<span class="ppl-position">과장 (개발팀)</span>,
                            김하나<span class="ppl-position">과장 (개발팀)</span>
                            </div>
                            <div class="chat-counter unread">
                                {room.unread}
                            </div>
                        </div>
                        <div class="list-row 2">
                            <div class="last-chat">
                            {room.content}
                        </div>
                            <div class="icon-chat-noti on"></div>
                        </div>
                        <div class="list-row 3">
                            <div class="last-chat-from sub1">
                                {room.mainPerson}
                            </div>
                            <div class="last-chat-time sub1">
                                {room.createdAt}
                            </div>
                        </div>
                    </div>
                </li>
            )
        })
    )

    return (
        <div>
            {renderChatRoom()}
        </div>
    )
}

export default ChatRooms



{/* <li class="chat-list-single  ppl-1x2">
<div class="list-thumb-area">
    <div class="user-pic-wrap">
        <img src={userThumbnail} alt="user-profile-picture" />
    </div>
    <div class="user-pic-wrap">
        <img src={userThumbnail} alt="user-profile-picture" />
    </div>
</div>
<div class="list-info-area">
    <div class="list-row 1">
        <div class="chat-ppl-num">
            3
        </div>
        <div class="chat-room-name">
            김철수<span class="ppl-position">과장 (개발팀)</span>, 김하나<span class="ppl-position">과장 (개발팀)</span>
        </div>
        <div class="chat-counter unread">
            3
        </div>
    </div>
    <div class="list-row 2">
        <div class="last-chat">
            (사진)
        </div>
        <div class="icon-chat-noti on"></div>
    </div>
    <div class="list-row 3">
        <div class="last-chat-from sub1">
            김철수
        </div>
        <div class="last-chat-time sub1">
            오전 10:55
        </div>
    </div>
</div>
</li>
<li class="chat-list-single  ppl-1x3">
<div class="list-thumb-area">
    <div class="user-pic-wrap">
        <img src={userThumbnail} alt="user-profile-picture" />
    </div>
    <div class="user-pic-wrap">
        <img src={userThumbnail} alt="user-profile-picture" />
    </div>
    <div class="user-pic-wrap">
        <img src={userThumbnail} alt="user-profile-picture" />
    </div>
</div>
<div class="list-info-area">
    <div class="list-row 1">
        <div class="chat-ppl-num">
            4
        </div>
        <div class="chat-room-name">
            김철수<span class="ppl-position">과장 (개발팀)</span>, 김하나<span class="ppl-position">과장 (개발팀)</span>, 이두리<span class="ppl-position">과장 (개발팀)</span>
        </div>
        <div class="chat-counter unread">
            999+
        </div>
    </div>
    <div class="list-row 2">
        <div class="last-chat">
            (이모티콘)
        </div>
        <div class="icon-chat-noti on"></div>
    </div>
    <div class="list-row 3">
        <div class="last-chat-from sub1">
            이두리
        </div>
        <div class="last-chat-time sub1">
            오전 10:00
        </div>
    </div>
</div>
</li>
<li class="chat-list-single  ppl-1xn">
<div class="list-thumb-area">
    <div class="user-pic-wrap">
        <img src={userThumbnail} alt="user-profile-picture" />
    </div>
    <div class="user-pic-wrap">
        <img src={userThumbnail} alt="user-profile-picture" />
    </div>
    <div class="user-pic-wrap">
        <img src={userThumbnail} alt="user-profile-picture" />
    </div>
    <div class="user-pic-wrap">
        <img src={userThumbnail} alt="user-profile-picture" />
    </div>
</div>
<div class="list-info-area">
    <div class="list-row 1">
        <div class="chat-ppl-num">
            5
        </div>
        <div class="chat-room-name">
            김철수<span class="ppl-position">과장 (개발팀)</span>, 김하나<span class="ppl-position">과장 (개발팀)</span>, 이두리<span class="ppl-position">과장 (개발팀)</span>, 최서이<span class="ppl-position">주임 (개발팀)</span>
        </div>
        <div class="chat-counter unread">
            999+
        </div>
    </div>
    <div class="list-row 2">
        <div class="last-chat">
            네~ 그리고 다음주 미팅 끝나고 식사는 어딜로 예약할까요? 선호하시는 메뉴 있으시면 말씀해주세요
        </div>
        <div class="icon-chat-noti off"></div>
    </div>
    <div class="list-row 3">
        <div class="last-chat-from sub1">
            김하나
        </div>
        <div class="last-chat-time sub1">
            2020-08-23
        </div>
    </div>
</div>
</li>
<li class="chat-list-single  ppl-1xn current-chat">
<div class="list-thumb-area">
    <div class="user-pic-wrap">
        <img src={userThumbnail} alt="user-profile-picture" />
    </div>
    <div class="user-pic-wrap">
        <img src={userThumbnail} alt="user-profile-picture" />
    </div>
    <div class="user-pic-wrap">
        <img src={userThumbnail} alt="user-profile-picture" />
    </div>
    <div class="user-pic-wrap">
        <img src={userThumbnail} alt="user-profile-picture" />
    </div>
</div>
<div class="list-info-area">
    <div class="list-row 1">
        <div class="chat-ppl-num">
            6
        </div>
        <div class="chat-room-name">
            tf팀
        </div>
        <div class="chat-counter">
            0
        </div>
    </div>
    <div class="list-row 2">
        <div class="last-chat">
            네~ 그리고 다음주 미팅 끝나고 식사는 어딜로 예약할까요? 선호하시는 메뉴 있으시면 말씀해주세요
        </div>
        <div class="icon-chat-noti on"></div>
    </div>
    <div class="list-row 3">
        <div class="last-chat-from sub1">
            김하나
        </div>
        <div class="last-chat-time sub1">
            2020-08-23
        </div>
    </div>
</div>
</li>
<li class="chat-list-single  ppl-1x1 my">
<div class="list-thumb-area">
    <div class="user-pic-wrap">
        <img src={userThumbnail} alt="user-profile-picture" />
    </div>
</div>
<div class="list-info-area">
    <div class="list-row 1">
        <div class="chat-ppl-num">
            2
        </div>
        <div class="chat-room-name">
            홍길동<span class="ppl-position">과장 (개발팀)</span>
        </div>
        <div class="chat-counter">
            MY
        </div>
    </div>
    <div class="list-row 2">
        <div class="last-chat">
            (파일: 지출결의서.xls)
        </div>
        <div class="icon-chat-noti on"></div>
    </div>
    <div class="list-row 3">
        <div class="last-chat-from sub1">
            나
        </div>
        <div class="last-chat-time sub1">
            2020-08-22
        </div>
    </div>
</div>
</li>
<li class="chat-list-single  ppl-1x1">
<div class="list-thumb-area">
    <div class="user-pic-wrap">
        <img src={userThumbnail} alt="user-profile-picture" />
    </div>
</div>
<div class="list-info-area">
    <div class="list-row 1">
        <div class="chat-ppl-num">
            2
        </div>
        <div class="chat-room-name">
            김철수<span class="ppl-position">과장 (개발팀)</span>
        </div>
        <div class="chat-counter">
            0
        </div>
    </div>
    <div class="list-row 2">
        <div class="last-chat">
            네 알겠습니다
        </div>
        <div class="icon-chat-noti off"></div>
    </div>
    <div class="list-row 3">
        <div class="last-chat-from sub1">
            김철수
        </div>
        <div class="last-chat-time sub1">
            오전 11:00
        </div>
    </div>
</div>
</li>
<li class="chat-list-single  ppl-1x1">
<div class="list-thumb-area">
    <div class="user-pic-wrap">
        <img src={userThumbnail} alt="user-profile-picture" />
    </div>
</div>
<div class="list-info-area">
    <div class="list-row 1">
        <div class="chat-ppl-num">
            2
        </div>
        <div class="chat-room-name">
            김철수<span class="ppl-position">과장 (개발팀)</span>
        </div>
        <div class="chat-counter">
            0
        </div>
    </div>
    <div class="list-row 2">
        <div class="last-chat">
            네 알겠습니다
        </div>
        <div class="icon-chat-noti off"></div>
    </div>
    <div class="list-row 3">
        <div class="last-chat-from sub1">
            김철수
        </div>
        <div class="last-chat-time sub1">
            오전 11:00
        </div>
    </div>
</div>
</li>
<li class="chat-list-single  ppl-1x1">
<div class="list-thumb-area">
    <div class="user-pic-wrap">
        <img src={userThumbnail} alt="user-profile-picture" />
    </div>
</div>
<div class="list-info-area">
    <div class="list-row 1">
        <div class="chat-ppl-num">
            2
        </div>
        <div class="chat-room-name">
            김철수<span class="ppl-position">과장 (개발팀)</span>
        </div>
        <div class="chat-counter">
            0
        </div>
    </div>
    <div class="list-row 2">
        <div class="last-chat">
            네 알겠습니다
        </div>
        <div class="icon-chat-noti off"></div>
    </div>
    <div class="list-row 3">
        <div class="last-chat-from sub1">
            김철수
        </div>
        <div class="last-chat-time sub1">
            오전 11:00
        </div>
    </div>
</div>
</li>
<li class="chat-list-single  ppl-1x1">
<div class="list-thumb-area">
    <div class="user-pic-wrap">
        <img src={userThumbnail} alt="user-profile-picture" />
    </div>
</div>
<div class="list-info-area">
    <div class="list-row 1">
        <div class="chat-ppl-num">
            2
        </div>
        <div class="chat-room-name">
            김철수<span class="ppl-position">과장 (개발팀)</span>
        </div>
        <div class="chat-counter">
            0
        </div>
    </div>
    <div class="list-row 2">
        <div class="last-chat">
            네 알겠습니다
        </div>
        <div class="icon-chat-noti off"></div>
    </div>
    <div class="list-row 3">
        <div class="last-chat-from sub1">
            김철수
        </div>
        <div class="last-chat-time sub1">
            오전 11:00
        </div>
    </div>
</div>
</li>
<li class="chat-list-single  ppl-1x1">
<div class="list-thumb-area">
    <div class="user-pic-wrap">
        <img src={userThumbnail} alt="user-profile-picture" />
    </div>
</div>
<div class="list-info-area">
    <div class="list-row 1">
        <div class="chat-ppl-num">
            2
        </div>
        <div class="chat-room-name">
            김철수<span class="ppl-position">과장 (개발팀)</span>
        </div>
        <div class="chat-counter">
            0
        </div>
    </div>
    <div class="list-row 2">
        <div class="last-chat">
            네 알겠습니다
        </div>
        <div class="icon-chat-noti off"></div>
    </div>
    <div class="list-row 3">
        <div class="last-chat-from sub1">
            김철수
        </div>
        <div class="last-chat-time sub1">
            오전 11:00
        </div>
    </div>
</div>
</li>
<li class="chat-list-single  ppl-1x1">
<div class="list-thumb-area">
    <div class="user-pic-wrap">
        <img src={userThumbnail} alt="user-profile-picture" />
    </div>
</div>
<div class="list-info-area">
    <div class="list-row 1">
        <div class="chat-ppl-num">
            2
        </div>
        <div class="chat-room-name">
            김철수<span class="ppl-position">과장 (개발팀)</span>
        </div>
        <div class="chat-counter">
            0
        </div>
    </div>
    <div class="list-row 2">
        <div class="last-chat">
            네 알겠습니다
        </div>
        <div class="icon-chat-noti off"></div>
    </div>
    <div class="list-row 3">
        <div class="last-chat-from sub1">
            김철수
        </div>
        <div class="last-chat-time sub1">
            오전 11:00
        </div>
    </div>
</div>
</li> */}