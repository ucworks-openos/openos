import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addChatMessage,
  getChatMessages,
  setChatAnchor,
  setChatMessages,
} from "../../../redux/actions/chat_actions";
import moment from "moment";
import { EchatType } from "../../../enum";
import styled from "styled-components";
import {
  delay,
  formatBytes,
  getDispUserNames,
  lineKeyParser,
} from "../../../common/util";
import {
  downloadFile,
  uploadFile,
} from "../../../common/ipcCommunication/ipcFile";
import path from "path";
import {
  shellOpenFolder,
  shellOpenItem,
} from "../../../common/ipcCommunication/ipcUtil";
import { Img } from "react-image";
import DragAndDropSupport from "../../../common/components/DragAndDropSupport";
import useIntersectionObserver from "../../../hooks/useIntersectionObserver";

const { remote } = window.require("electron");
const fs = remote.require("fs");
const downloadPath = remote.getGlobal("DOWNLOAD_PATH");

function ChatMessages() {
  const dispatch = useDispatch();
  const rootRef = useRef(null);
  const targetRef = useRef(null);
  const messageEndRef = useRef(null);
  const dummyRef = useRef(null);
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

  useEffect(() => {
    console.log(`chatAnchor: `, chatAnchor);
    if (!chatAnchor) {
      if (messageEndRef.current) {
        messageEndRef.current.scrollIntoView({
          behavior: `smooth`,
          inline: `start`,
          block: `end`,
        });
      }
    } else {
      dummyRef.current.scrollIntoView();
    }
  }, [chatMessages]);

  useIntersectionObserver({
    root: rootRef.current,
    target: targetRef.current,
    handleIntersect: ([{ isIntersecting }]) => {
      // * 메세지 개수가 50의 배수이면 서버에 남은 데이터가 있을 지도 모르므로 다시 요청, 50의 배수가 아니면 모두 받았으므로 요청하지 않음
      if (isIntersecting && lastReceivedChatMessages?.length === 50) {
        console.log(`loading chat...`);
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

  const download = async (
    serverIp,
    serverPort,
    serverFileName,
    fileName,
    key
  ) => {
    const resData = await downloadFile(
      serverIp,
      serverPort,
      serverFileName,
      downloadPath + "/" + fileName
    );

    const progressed = [...chatMessages].map((v) => {
      if (v.chat_type === EchatType.file.toString() && v.line_key === key) {
        return {
          ...v,
          fileExist: true,
        };
      } else {
        return v;
      }
    });

    dispatch(setChatMessages(progressed));
  };

  const renderChatMessages = () =>
    chatMessages &&
    chatMessages.map((chat, index, list) => {
      /**
       * 이모티콘 정보는 fontName에 있으며 chatData(contents)도 포함되는 경우도 있다. (chatData: 'bslee|kitt1' : 참여자 아이디가 들어 있음)
       *   fontName: 'EMOTICON \r tab_02 \r 3.gif\r맑은 고딕 Semilight'
       */
      const chatType = chat.chat_type;

      if (
        (!chat.chat_contents?.trim().length &&
          chatType === EchatType.chat.toString()) ||
        chat.chat_contents === chat.chat_entry_ids
      ) {
        return null;
      }

      const hasEmoticon = chat.chat_font_name?.startsWith("EMOTICON");
      const emoTab = chat.chat_font_name?.split(` `)?.[1];
      const emoName = chat.chat_font_name?.split(` `)?.[2];

      let composed = chat.chat_contents.split(`|`);
      let fileName;
      let fileSize;
      let serverIp;
      let serverPort;
      let serverFileName;
      if (chatType === EchatType.file.toString() && composed.length > 3) {
        fileName = composed[0];
        fileSize = formatBytes(composed[1], 0);
        serverIp = composed[3].split(`;`)[0];
        serverPort = composed[3].split(`;`)[1];
        serverFileName = composed[4];
      }

      const contents =
        chat.chat_type === `U`
          ? chat.chat_contents
          : chat.chat_contents.split(`|`)[0];

      const myChat =
        chat.chat_send_id === `${sessionStorage.getItem("loginId")}`;

      const divider = (lineKey) => {
        if (!lineKey) return <></>;
        return (
          <div class="divider-wrap speech-date">
            <div class="divider-txt">
              {lineKeyParser(lineKey, `YYYY년 MM월 DD일`)}
            </div>
            <div class="divider" />
          </div>
        );
      };

      const fileInfo = () => (
        <FileInfo>
          <div>
            <div>{fileName}</div>
            <div>{`용량: ${fileSize}`}</div>
            {fs.existsSync(path.join(downloadPath, fileName)) ||
            chat.fileExist ? (
              <div>
                <div
                  onClick={() => {
                    shellOpenItem(path.join(downloadPath, fileName));
                  }}
                >
                  열기
                </div>
                <div
                  onClick={() => {
                    shellOpenFolder(downloadPath);
                  }}
                >
                  폴더 열기
                </div>
              </div>
            ) : (
              <div>
                <div
                  onClick={() => {
                    download(
                      serverIp,
                      serverPort,
                      serverFileName,
                      fileName,
                      chat.line_key
                    );
                  }}
                >
                  저장
                </div>
              </div>
            )}
          </div>
          <div>
            <img src="./images/icon_attatched_file.png" />
          </div>
        </FileInfo>
      );

      const speechInfo = () => (
        <div className="speech-info">
          {/* <span className="unread-ppl">{chat.read_count}</span> */}
          <span className="time"> {lineKeyParser(chat.line_key, `HH:mm`)}</span>
        </div>
      );

      if (myChat) {
        return (
          <>
            {index === 0
              ? divider(chat.line_key)
              : lineKeyParser(list[index - 1].line_key) !==
                  lineKeyParser(chat.line_key) && divider(chat.line_key)}
            <div key={index} className="speech-row speech-my">
              <div className="speech-content-wrap-mine">
                {chatType === EchatType.emoticon.toString() && hasEmoticon && (
                  <>
                    <div className="speech-info-wrap">
                      {!contents && speechInfo()}
                      <Img
                        src={[
                          `./Emoticons/${emoTab}/${emoName}`,
                          `./images/no_image.jpg`,
                        ]}
                        alt={`./Emoticons/${emoTab}/${emoName}`}
                      />
                    </div>
                  </>
                )}

                {chatType === EchatType.file.toString() ? (
                  <div className="speech-inner-wrap">
                    {fileInfo()}
                    {speechInfo()}
                  </div>
                ) : contents ? (
                  <div className="speech-inner-wrap">
                    <div className="speech-content">
                      <pre>{contents}</pre>
                    </div>
                    {speechInfo()}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </>
        );
      } else {
        return (
          <>
            {index === 0
              ? divider(chat.line_key)
              : lineKeyParser(list[index - 1].line_key) !==
                  lineKeyParser(chat.line_key) && divider(chat.line_key)}
            <div className="speech-row speech-others" key={index}>
              <div className="user-pic-wrap">
                <img
                  src={
                    chat.user_picture_pos &&
                    /^http/.test(chat.user_picture_pos.value)
                      ? chat.user_picture_pos.value
                      : "./images/img_imgHolder.png"
                  }
                  alt="user-profile-picture"
                />
              </div>
              <div className="speech-content-wrap-his">
                <div className="speaker-info-wrap">{chat.chat_send_name}</div>
                {chatType === EchatType.emoticon.toString() && hasEmoticon && (
                  <>
                    <div className="speech-info-wrap">
                      <Img
                        src={[
                          `./Emoticons/${emoTab}/${emoName}`,
                          `./images/no_image.jpg`,
                        ]}
                        alt={`./Emoticons/${emoTab}/${emoName}`}
                        loading="lazy"
                      />
                      {!contents && speechInfo()}
                    </div>
                  </>
                )}
                {chatType === EchatType.file.toString() ? (
                  <div className="speech-inner-wrap">
                    {fileInfo()}
                    {speechInfo()}
                  </div>
                ) : contents ? (
                  <div className="speech-inner-wrap">
                    <div className="speech-content">
                      <pre>{contents}</pre>
                    </div>
                    {speechInfo()}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </>
        );
      }
    });

  return (
    <DragAndDropSupport handleDrop={handleDrop}>
      <div
        className="chat-area"
        style={{ bottom: (emojiVisible || emoticonVisible) && `520px` }}
        ref={rootRef}
      >
        <div ref={targetRef} />
        <div style={{ height: `300px` }} />
        <div ref={dummyRef} style={{ height: `1px` }} />
        {renderChatMessages()}
        <div ref={messageEndRef} />
      </div>
    </DragAndDropSupport>
  );
}

const FileInfo = styled.div`
  display: flex;
  background-color: #edf0f8;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #d8e0f2;
  justify-content: space-between;
  & > div:nth-child(1) {
    margin-right: 20px;
    width: 180px;
    // 파일명
    & > div:nth-child(1) {
      line-break: anywhere;
      color: black;
    }
    // 파일 용량
    & > div:nth-child(2) {
      font-size: 90%;
      margin: 5px 0;
    }

    & > div:nth-child(3) {
      display: flex;
      // * 저장 or 열기/폴더 열기
      & > div {
        font-size: 90%;
        cursor: pointer;
        color: #11378d;
      }
      & > div:nth-child(2) {
        &:before {
          content: "·";
          margin: 0 5px;
          cursor: default;
        }
      }
    }
  }
  & > div:nth-child(2) {
    background-color: #edf0f8;
    border-radius: 50%;
    padding: 12px;
    border: 1px solid #d8e0f2;
    align-self: flex-start;
    // 다운로드 아이콘
    & > img {
      display: block;
      margin: auto;
      width: 20px;
      height: 20px;
    }
  }
`;

export default ChatMessages;
