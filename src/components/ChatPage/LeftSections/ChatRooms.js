import React, { useEffect } from "react";
import {
  setCurrentChatRoom,
  setEmojiVisible,
  setEmoticonVisible,
} from "../../../redux/actions/chat_actions";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { getInitialChatRooms } from "../../../redux/actions/chat_actions";
import { getDispUserNames } from "../../../common/util/userUtil";
import { getChatRoomName, getChatUserIds } from "../../../common/util";
import { writeDebug } from "../../../common/ipcCommunication/ipcLogger";

const electron = window.require("electron");

function ChatRooms(props) {
  const dispatch = useDispatch();
  const { chatRooms, currentChatRoom, unreadChatRoomKeys } = useSelector(
    (state) => state.chats
  );
  useEffect(() => {
    dispatch(getInitialChatRooms());
  }, []);

  useEffect(() => {
    console.log(chatRooms, currentChatRoom);
  });

  const onChatRoomClick = (roomKey) => {
    dispatch(setCurrentChatRoom(roomKey, chatRooms));
    dispatch(setEmojiVisible(false));
    dispatch(setEmoticonVisible(false));
  };

	const renderChatRoom = () =>
	chatRooms &&
	chatRooms.map((room) => {
    let chatUserIds = room && getChatUserIds(room.chat_entry_ids);
    let chatUserCount = chatUserIds && chatUserIds.length;
    let roomName = getChatRoomName(room.chat_entry_names, chatUserIds);

    const isCurrentChatRoom = room && room.room_key === currentChatRoom.room_key? "current-chat": "";
		// ${chatUserCount >= 4 ? "n" : chatUserCount}

		const isUnread = unreadChatRoomKeys.find((v) => v === room.room_key);

      return (
        <li
          className={`chat-list-single  ppl-1 ${isCurrentChatRoom}`}
          key={room.room_key}
          onClick={() => onChatRoomClick(room.room_key)}
        >
          <div className="list-info-area">
            <div className="list-row 1">
              <div className="chat-ppl-num">{chatUserCount}</div>
              <div className="chat-room-name"><span key={uuidv4()}>{roomName}</span></div>
              {room.unread_count && room.unread_count !== "0" && (
                <div className="chat-counter unread">{room.unread_count}</div>
              )}
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