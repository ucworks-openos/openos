import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { writeDebug } from "../../../common/ipcCommunication/ipcLogger";
import {
  delay,
  getChatUserIds,
  getDispUserNames,
  lineKeyParser,
} from "../../../common/util";
import {
  getChatRoomName,
  getChatRoomNameAsync,
} from "../../../common/util/chatUtil";
import { updateChatRoom } from "../../../redux/actions/chat_actions";

const electron = window.require("electron");

function ChatRoom(props) {
  const dispatch = useDispatch();
  //const chatRoom = props.chatRoom;
  const [chatRoom, setChatRoom] = useState({});
  const [chatRoomName, setChatRoomName] = useState("");
  const [chatUserIds, setChatUserIds] = useState([]);

  let initCompleted = false;

  useEffect(() => {
    writeDebug(
      "useEffect-- props.chatRoom     ASIS:%s    NEW:%s",
      chatRoom?.room_key,
      props.chatRoom.room_key
    );

    // 방 정보가 바뀌었다면 이름을 새로 가져온다.
    if (!chatRoom 
          || chatRoom.room_key !== props.chatRoom.room_key
          || chatRoom.last_line_key !== props.chatRoom.last_line_key) {
      initChatRoom(props.chatRoom);
    }
  }, [props.chatRoom]);

  useEffect(() => {
    if (!initCompleted) {
      initChatRoom(props.chatRoom);
    }
  }, []);

  const getChatRoomNameA = async (userIds) => {

    initCompleted = true;

    writeDebug(
      "ChatRoom-- getChatRoomNameA req",
      chatRoom.chat_entry_names,
      userIds
    );

    //let roomName = await getDispUserNames(userIds, 3);
    await delay(500 * props.key)

    let roomName = await getChatRoomNameAsync(chatRoom.chat_entry_names, userIds);

    const upChatRoom = {
      ...chatRoom,
      chat_entry_names: roomName,
    };

    writeDebug(
      "ChatRoom-- getChatRoomNameA",
      roomName,
      upChatRoom.chat_entry_names,
      upChatRoom
    );

    // 기존방 변경
    dispatch(updateChatRoom(upChatRoom));

    // 현재방 변경
    setChatRoomName(roomName);
    
  };

  const initChatRoom = () => {

    setChatRoom(props.chatRoom);

    let userIds = getChatUserIds(props.chatRoom.chat_entry_ids);
    setChatUserIds(userIds);
    getChatRoomNameA(userIds);

    // 방이름 정보가 없다면 요청해서 받아온다.
    if (props.chatRoom.chat_entry_names.startsWith("UCWARE_CHAT_ROOM_TITLE") ) {
      writeDebug(
        "ChatRoom-- chat_entry_names",
        props.chatRoom.chat_entry_names,
        props.chatRoom
      );
      setChatRoomName(getChatRoomName(props.chatRoom.chat_entry_names));
    } else {
      //setChatRoomName(currentChatRoom.chat_entry_names?getChatRoomName(currentChatRoom.chat_entry_names): await getDispUserNames(userIds))
      getChatRoomNameA(userIds);
    }
  };

  return (
    <li
      className={`chat-list-single  ppl-1 ${
        props.isSelected ? "current-chat" : ""
      }`}
      key={chatRoom.room_key}
      onClick={() => props.onChatRoomClick(chatRoom.room_key)}
    >
      <div className="list-info-area">
        <div className="list-row 1">
          <div className="chat-ppl-num">{chatUserIds?.length}</div>
          <div className="chat-room-name">
            <span>{chatRoomName}</span>
          </div>
          {/* {room.unread_count && room.unread_count !== "0" && (
            <div className="chat-counter unread">{room.unread_count}</div>
          )} */}
        </div>
        <div className="list-row 2">
          <div className="last-chat">
            {chatRoom.chat_contents && chatRoom.chat_contents}
          </div>
          <div className="icon-chat-noti on"></div>
        </div>
        <div className="list-row 3">
          <div className="last-chat-from sub1"> {chatRoom.chat_send_name}</div>
          <div className="last-chat-time sub1">
            {lineKeyParser(chatRoom.last_line_key, `YYYY. MM. DD. HH:mm`)}
          </div>
        </div>
      </div>
    </li>
  );
}

export default ChatRoom;
