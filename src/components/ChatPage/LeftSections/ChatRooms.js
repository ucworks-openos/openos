import React, { useEffect } from "react";
import { setCurrentChatRoom } from "../../../redux/actions/chat_actions";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { getInitialChatRooms } from "../../../redux/actions/chat_actions";

const electron = window.require("electron");

function ChatRooms(props) {
  const dispatch = useDispatch();
  const chatRooms = useSelector((state) => state.chats.chatRooms);
  const currentChatRoom = useSelector((state) => state.chats.currentChatRoom);
  useEffect(() => {
    dispatch(getInitialChatRooms());
  }, []);

  const onChatRoomClick = (roomKey) => {
    dispatch(setCurrentChatRoom(roomKey, chatRooms));
  };

  const renderChatRoom = () =>
    chatRooms &&
    chatRooms.map((room) => {
      let receieveIds = room && room.chat_entry_ids.split("|");
      let receievePeopleCounts = receieveIds && receieveIds.length;
      let renderSendTo;

      if (room.chat_entry_names) {
        renderSendTo = <span key={uuidv4()}>{room.chat_entry_names} </span>;
      } else {
        renderSendTo = receieveIds?.map((user) => {
          return <span key={uuidv4()}>{user} </span>;
        });
      }
      const isCurrentChatRoom =
        room && room.room_key === currentChatRoom.room_key
          ? "current-chat"
          : "";
      // ${receievePeopleCounts >= 4 ? "n" : receievePeopleCounts}

      return (
        <li
          className={`chat-list-single  ppl-1 ${isCurrentChatRoom}`}
          key={room.room_key}
          onClick={() => onChatRoomClick(room.room_key)}
        >
          {/* <div className="list-thumb-area">
                        <div className="user-pic-wrap">
                            <img src={userThumbnail} alt="user-profile-picture" />
                        </div>
                    </div> */}
          <div className="list-info-area">
            <div className="list-row 1">
              <div className="chat-ppl-num">{receievePeopleCounts}</div>
              <div className="chat-room-name">{renderSendTo}</div>
              {/* {room.unread_count && room.unread_count !== "0"
                                &&
                                <div className="chat-counter unread">
                                    {room.unread_count}
                                </div>
                            } */}
            </div>
            <div className="list-row 2">
              <div className="last-chat">
                {room.chat_contents && room.chat_contents}
              </div>
              <div className="icon-chat-noti on"></div>
            </div>
            <div className="list-row 3">
              <div className="last-chat-from sub1"> {room.chat_send_name}</div>
              <div className="last-chat-time sub1">
                {moment(room.create_room_date, "YYYYMMDDHHmm").format(
                  "YYYY. MM. DD. h:mm a"
                )}
              </div>
            </div>
          </div>
        </li>
      );
    });

  if (chatRooms === undefined || (chatRooms && chatRooms[0] === undefined)) {
    return <div></div>;
  } else {
    return <div>{renderChatRoom()}</div>;
  }
}

export default ChatRooms;

{
  /* <li class="chat-list-single  ppl-1x2">
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
</li> */
}

// const [chatRoomsWithUserInfos, setChatRoomsWithUserInfos] = useState([])

// useEffect(() => {
//     (chatRooms &&
//         getChatRoomsWithUserInfos()
//     )
// }, [chatRooms])

// const getChatRoomsWithUserInfos = async () => {
//     let newChatRooms = [];
//     for (let index = 0; index < chatRooms.length; index++) {
//         const chatRoomEl = chatRooms[index];
//         const memberIds = chatRoomEl.chat_entry_ids.split('|')
//         let userInfos = [];
//         winston.info('  index', index)

//         for (let index = 0; index < memberIds.length; index++) {
//             const memberEl = memberIds[index];
//             winston.info(' memberIds index', index, memberIds[index])
//             let userInfoResult = await getUserInfos(memberEl)

//             // userInfos.push(userInfoResult.data.items !== undefined ? userInfoResult.data.items.node_item : userInfoResult)
//         }
//         chatRoomEl.userInfo = userInfos
//         newChatRooms.push(chatRoomEl)
//         // winston.info('chatrooms.lenfksm', chatRooms.length)
//         // winston.info('chatROoms', index)
//     }
//     setChatRoomsWithUserInfos(newChatRooms)
// }
