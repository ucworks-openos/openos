import React, { useState, useEffect } from "react";
import "./ChatPage.css";
import LeftPanel from "./LeftSections/LeftPanel";
import RightPanel from "./RightSections/RightPanel";
import { useDispatch, useSelector } from "react-redux";
import {
  emptyChatMessages,
  moveToClickedChatRoom,
  addChatRoomFromOrganization,
  setCurrentChatRoomFromNoti,
} from "../../redux/actions/chat_actions";
import moment from "moment";
import { writeDebug, writeError } from "../../common/ipcCommunication/ipcLogger";
import { getChatRoomByRoomKey } from "../../common/ipcCommunication/ipcMessage";
import { getChatUserIds } from "../../common/util";

function ChatPage(props) {
  const dispatch = useDispatch();
  const { remote } = window.require("electron")

  const loginUser = remote.getGlobal('USER');
  const roomKey = props.match.params["roomKey"];
  const orgMembers = props.match.params["orgMembers"];

  useEffect(() => {
      if (roomKey) {
          getChatRoomByRoomKey(roomKey).then((resData) => {
              let roomInfo = resData.data;
              writeDebug('moveToClickedChatRoom. RoomKey:%s', roomKey,  roomInfo)   
              
              let selectedUsers = getChatUserIds(roomInfo.chat_entry_ids)
              const chatRoomBody = {
                  selected_users: selectedUsers,
                  user_counts: selectedUsers.length,
                  chat_entry_ids: roomInfo.chat_entry_ids,
                  chat_entry_names: roomInfo.chat_entry_names,
                  unread_count: 0,
                  room_key: roomKey,
                  chat_contents: roomInfo.chat_contents,
                  chat_send_name: roomInfo.chat_send_name,
                  create_room_date: moment().format("YYYYMMDDHHmm"),
                  chat_send_id: loginUser.userId,
                  last_line_key: '9999999999999999'
              }
              dispatch(moveToClickedChatRoom(chatRoomBody));  
          }).catch((err) => {
              writeError('getChatRoomByRoomKey fail!', err)
          });
      }

  }, [roomKey]);

  useEffect(() => {

    writeDebug('ChatPage From Organization', );

    if (orgMembers) {
      setTimeout(() => {
        dispatch(addChatRoomFromOrganization(orgMembers));
      }, 300);
    }
  }, [orgMembers]);

  return (
    <div className="contents-wrap-chat">
      <LeftPanel />
      <RightPanel />
    </div>
  );
}

export default ChatPage;
