import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addChatMessage,
  addFileSkeleton,
  getChatMessages,
} from "../../../redux/actions/chat_actions";
import { EchatType } from "../../../enum";
import { delay, getDispUserNames, lineKeyParser } from "../../../common/util";
import { uploadFile } from "../../../common/ipcCommunication/ipcFile";
import DragAndDropSupport from "../../../common/components/DragAndDropSupport";
import useIntersectionObserver from "../../../hooks/useIntersectionObserver";
import ChatMessage from "./ChatMessage";

const { remote } = window.require("electron");

export default function ChatMessages() {
  const dispatch = useDispatch();
  const rootRef = useRef(null);
  const targetRef = useRef(null);
  const messageEndRef = useRef(null);
  const anchorRef = useRef(null);
  const {
    currentChatRoom,
    chatMessages,
    emojiVisible,
    emoticonVisible,
    currentEmoticon,
    chatAnchor,
    lastReceivedChatMessages,
  } = useSelector((state) => state.chats);

  useEffect(() => {
    if (currentChatRoom) {
      //새로 만든 채팅방(전 데이터가 데이테베이스에 없는)은 아직 데이터베이스에서 없기 때문에
      //데이터 베이스에서 메시지를 가져오면 안됨.
      //근데  채팅을 몇번 하고 난 후에 다시 들어올때도  last_line_key가  undefined이기에 ...
      //채팅 리스트들을 없앤다 .. 어떻게 해야 하나 ...?
      dispatch(getChatMessages(currentChatRoom.room_key));
    }
  }, [currentChatRoom]);

  // * chatAnchor === true : scroll이 anchorRef에 걸림. (인피니티 스크롤 시 true로 설정)
  // * chatAnchor === false : scroll이 messageEndRef에 걸림. (채팅페이지 진입, 채팅방 이동, 메세지 입력 시 false로 설정)
  useEffect(() => {
    if (!chatAnchor) {
      if (messageEndRef.current) {
        messageEndRef.current.scrollIntoView();

        // * 스크롤이 끝까지 안내려가는 현상이 있으므로 0.1초 뒤에 다시 스크롤을 내림
        setTimeout(() => {
          if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView();
          }
        }, 100);
      }
    } else {
      if (anchorRef.current) {
        anchorRef.current.scrollIntoView();
      }
    }
  }, [chatMessages]);

  useIntersectionObserver({
    root: rootRef.current,
    target: targetRef.current,
    handleIntersect: ([{ isIntersecting }]) => {
      // * 마지막으로 받은 채팅이 50의 배수 갯수이면 서버에 잔여 데이터가 남아있을수도 있으므로 요청.
      if (
        isIntersecting &&
        currentChatRoom &&
        lastReceivedChatMessages?.length === 50
      ) {
        dispatch(
          getChatMessages(currentChatRoom.room_key, chatMessages?.[0].line_key)
        );
      }
    },
  });

  const loginUser = remote.getGlobal("USER");

  const handleDrop = async (files) => {
    if (!currentChatRoom) return;

    for (let i = 0; i < files.length; i++) {
      console.log(`file drop: `, files[i]);
      dispatch(
        addFileSkeleton(files[i].name, loginUser.userName, loginUser.userId)
      );
      const resData = await uploadFile(files[i].path, files[i].path);
      console.log(`file upload complete: `, resData.data);

      const fileInfo = `${files[i].name}|${files[i].size}|SAVE_SERVER|${
        remote.getGlobal("SERVER_INFO").FS.pubip
      };${remote.getGlobal("SERVER_INFO").FS.port}|${resData.data}|`;

      let userNames;
      if (!currentChatRoom.chat_entry_names) {
        userNames = await getDispUserNames(
          currentChatRoom?.chat_entry_ids?.split("|")
        );
      } else {
        userNames = currentChatRoom.chat_entry_names;
      }

      dispatch(
        addChatMessage(
          currentChatRoom.chat_entry_ids,
          userNames,
          fileInfo,
          currentEmoticon ? currentEmoticon : `맑은 고딕`,
          false,
          currentChatRoom.room_key,
          loginUser.userName,
          loginUser.userId,
          EchatType.file.toString()
        )
      );

      await delay(500);
    }
  };

  // const [chatMessagesWithUserInfos, setChatMessagesWithUserInfos] = useState([])

  return (
    <DragAndDropSupport handleDrop={handleDrop}>
      <div
        className="chat-area"
        style={{ bottom: (emojiVisible || emoticonVisible) && `520px` }}
        ref={rootRef}
      >
        <div ref={targetRef} />
        <div style={{ height: `100px` }} />
        <div ref={anchorRef} />
        <>
          {chatMessages?.map((chat, index, list) => {
            if (
              (chat.chat_contents?.trim().length === 0 &&
                chat.chat_type === EchatType.chat.toString()) ||
              chat.chat_contents === chat.chat_entry_ids
            ) {
              return null;
            }

            return (
              <>
                {/* 이전 인덱스와 현재 인덱스의 lineKey로 날짜를 알아내서, 날짜가 다르면 (혹은 이전 데이터가 없으면) divide */}
                {lineKeyParser(list[index - 1]?.line_key) !==
                  lineKeyParser(chat.line_key) && (
                  <div class="divider-wrap speech-date">
                    <div class="divider-txt">
                      {lineKeyParser(chat.line_key, `YYYY년 MM월 DD일`)}
                    </div>
                    <div class="divider" />
                  </div>
                )}

                <ChatMessage
                  chat={chat}
                  isMine={
                    chat.chat_send_id === sessionStorage.getItem("loginId")
                  }
                />
              </>
            );
          })}
        </>
        <div ref={messageEndRef} />
      </div>
    </DragAndDropSupport>
  );
}
