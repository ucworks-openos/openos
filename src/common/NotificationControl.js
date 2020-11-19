import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getChatRoomByRoomKey, showChatNoti } from "./ipcCommunication/ipcMessage";
import { answerCall } from "./ipcCommunication/ipcIpPhone";
import {
  addChatRoom,
  addChatRoomDirect,
  addReceivedChat,
  setCurrentChatRoomFromNoti,
  setUnreadChatRoomKeys,
} from "../redux/actions/chat_actions";
import { writeDebug, writeInfo, writeLog, writeWarn } from "./ipcCommunication/ipcLogger";
import {
  addMessage,
  setCurrentMessage,
  setCurrentMessageListsType,
} from "../redux/actions/message_actions";
import { ChatCommand } from "../enum/chatCommand";
import { getChatUserIds, getDispUserNames } from "./util";

const electron = window.require("electron");

function NotificationControl() {
  const dispatch = useDispatch();

  const { chatRooms } = useSelector((state) => state.chats);

  //알림 수신처리
  useEffect(() => {

    //
    // 대화 메세지 수신
    electron.ipcRenderer.removeAllListeners("chatReceived");
    electron.ipcRenderer.on("chatReceived", (event, chat) => {
      let selectedChatRoomKey = sessionStorage.getItem("chatRoomKey");

      writeLog(
        "chatReceived currentChatRoom:%s chat:%s",
        selectedChatRoomKey,
        chat
      );
      
      // 본인이 보낸 메세지는 무시한다.
      if (chat.sendId === sessionStorage.getItem("loginId")) {
        writeLog("It's my message");
        return;
      }

      switch (chat.chatCmd) {
        case ChatCommand.CHAT_DATA_LINE: // 대화 메세지
        case ChatCommand.CHAT_DATA_NEW_CHAT:
        case ChatCommand.CHAT_RECV_FILE:

          addChatMessageWithChatRoom(chat)

          // 현재 선택된 방이 아니거나 대화 탭이 아니면 알림을 보낸다.
          if (chat.roomKey !== selectedChatRoomKey 
            || window.location.hash.split("/")[1] !== "chat") {
            showChatNoti(chat);
          }
          break;

        case ChatCommand.CHAT_DATA_START_TYPE: // 메세지 입력중
        case ChatCommand.CHAT_CHANGE_TITLE:
        default:
          writeWarn('UNPROCESSED CHAT COMMAND ', chat)
          break;
      }
    });

    //
    // 쪽지 수신
    // 현재 선택된 쪽지 탭 유형을 확인하고, 쪽지 목록화면에 추가해야 함으로 쪽지 컨트롤에서 처리
    electron.ipcRenderer.removeAllListeners("messageReceived");
    electron.ipcRenderer.on("messageReceived", (event, msg) => {
      let currentMessageListType = sessionStorage.getItem(
        "currentMessageListType"
      );
      //let msg = msgData[0];

      // 내가 나에게 보내는 경우가 있으니 모든 경우를 판단한다.
      let destIds = msg.allDestId.split("|");
      let isRecvMsg = destIds.includes(sessionStorage.getItem("loginId"));
      let isSendMsg = msg.sendId === sessionStorage.getItem("loginId");

      // 내가 보고있는 함에 맞는 메세지가 오면 추가.
      if (
        (isSendMsg && currentMessageListType === "SEND") ||
        (isRecvMsg && currentMessageListType === "RECV")
      ) {
        dispatch(
          addMessage(
            msg.key,
            msg.destIds,
            msg.destName,
            msg.subject,
            msg.message.trim().length === 0
              ? `<p>${msg.subject}</>`
              : msg.message,
            msg.sendName
          )
        );
      }
    });

    //
    // 알림창 클릭
    electron.ipcRenderer.removeAllListeners("notiTitleClick"); // 2중 등록 방지
    electron.ipcRenderer.on("notiTitleClick", (event, noti) => {
      writeLog("notiTitleClick", noti);

      switch (noti.notiType) {
        case "NOTI_MESSAGE":
          dispatch(setCurrentMessageListsType("RECV"));
          dispatch(setCurrentMessage(noti.notiId));
          window.location.hash = `#/message`;

          break;
        case "NOTI_CHAT":
          writeLog("chat noti click!--", `#/chat/${encodeURIComponent(noti.notiId)}`);
          // 채팅방 관리 로직을 수정을 해야할거 같다.
          // 현재 목록에 방이 없다면 받아와서 추가하고 
          //  해당방으로 이동시키는 식으로...

          window.location.hash = `#/chat/${encodeURIComponent(noti.notiId)}`;
          dispatch(setCurrentChatRoomFromNoti());

          break;
        case "NOTI_PHONE_CALLED":
          answerCall(noti.notiId)
          break;
        case 'NOTI_ALARM':
          window.location.hash = `#/notice`;
          break;
        default:
          writeLog("Unknown Noti Title Click", noti);
          return;
      }
    });

    //
    // 별칭(대화명) 변경 알림
    electron.ipcRenderer.removeAllListeners("userAliasChanged");
    electron.ipcRenderer.on("userAliasChanged", (event, alias) => {
      writeInfo("userAliasChanged", alias);
    });
  }, []);


  const addChatMessageWithChatRoom = async(chat) => {
    // 메시지 방이 있는지 확인한다.

    let chatRoom = chatRooms?.find(room => room.room_key === chat.roomKey);
        
    // // 방이 없다면 가져온다.
    // if (!chatRoom) {
    //   let resData = await getChatRoomByRoomKey(chat.roomKey);
    //   let roomInfo = resData.data;
    //   writeDebug('moveToClickedChatRoom. RoomKey:%s', chat.roomKey,  roomInfo)   
        
    //   let userIds = getChatUserIds(roomInfo.chat_entry_ids)
    //   let chat_entry_names = roomInfo.chat_entry_names?roomInfo.chat_entry_names: await getDispUserNames(userIds);
      
    //   roomInfo.chat_entry_names = chat_entry_names
    //   addChatRoomDirect(roomInfo)
    // }

    dispatch(addReceivedChat(chat));
  }

  return <div></div>;
}

export default NotificationControl;
