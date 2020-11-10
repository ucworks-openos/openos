import React, { useEffect } from "react";
import { Img } from "react-image";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { downloadFile } from "../../../common/ipcCommunication/ipcFile";
import { formatBytes, lineKeyParser } from "../../../common/util";
import { EchatType } from "../../../enum";
import { setChatMessages } from "../../../redux/actions/chat_actions";
import path from "path";
import {
  shellOpenFolder,
  shellOpenItem,
} from "../../../common/ipcCommunication/ipcUtil";
import { CHAT_FONT_SEP } from "../../../enum/chatCommand";

export default function ChatMessage({ chat, isMine }) {
  const { remote } = window.require("electron");
  const fs = remote.require("fs");
  const downloadPath = remote.getGlobal("DOWNLOAD_PATH");

  const dispatch = useDispatch();
  const { chatMessages } = useSelector((state) => state.chats);

  const download = async (
    serverIp,
    serverPort,
    serverFileName,
    fileName,
    key
  ) => {
    await downloadFile(
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

  switch (chat.chat_type) {
    case EchatType.emoticon.toString(): {
      // const emoTab = chat.chat_font_name?.split(` `)?.[1];
      // const emoName = chat.chat_font_name?.split(` `)?.[2];
      const emoTab = chat.chat_font_name?.split(CHAT_FONT_SEP)?.[1];
      const emoName = chat.chat_font_name?.split(CHAT_FONT_SEP)?.[2];

      return (
        <div className={`speech-row ${isMine ? `speech-my` : `speech-others`}`}>
          {!isMine && (
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
          )}
          <div
            className={`${
              isMine ? `speech-content-wrap-mine` : `speech-content-wrap-his`
            }`}
          >
            {!isMine && (
              <div className="speaker-info-wrap">{chat.chat_send_name}</div>
            )}
            <div className={`speech-info-wrap ${isMine && `speech-my`}`}>
              <Img
                src={[
                  `./Emoticons/${emoTab}/${emoName}`,
                  `./images/no_image.jpg`,
                ]}
                alt={`./Emoticons/${emoTab}/${emoName}`}
              />
              <div className="speech-info">
                {/* <span className="unread-ppl">{chat.read_count}</span> */}
                <span className="time">
                  {" "}
                  {lineKeyParser(chat.line_key, `HH:mm`)}
                </span>
              </div>
            </div>
            <div className="speech-inner-wrap">
              {chat.chat_contents && (
                <>
                  <div className="speech-content">
                    <pre>{chat.chat_contents}</pre>
                  </div>
                  <div className="speech-info">
                    {/* <span className="unread-ppl">{chat.read_count}</span> */}
                    <span className="time">
                      {" "}
                      {lineKeyParser(chat.line_key, `HH:mm`)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      );
    }
    case EchatType.file.toString(): {
      let composed = chat.chat_contents.split(`|`);
      let fileName;
      let fileSize;
      let serverIp;
      let serverPort;
      let serverFileName;

      if (composed.length > 3) {
        fileName = composed[0];
        fileSize = formatBytes(composed[1], 0);
        serverIp = composed[3].split(`;`)[0];
        serverPort = composed[3].split(`;`)[1];
        serverFileName = composed[4];
      }
      return (
        <div className={`speech-row ${isMine ? `speech-my` : `speech-others`}`}>
          {!isMine && (
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
          )}
          <div
            className={`${
              isMine ? `speech-content-wrap-mine` : `speech-content-wrap-his`
            }`}
          >
            {!isMine && (
              <div className="speaker-info-wrap">{chat.chat_send_name}</div>
            )}
            <div className="speech-inner-wrap">
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
              <div className="speech-info">
                {/* <span className="unread-ppl">{chat.read_count}</span> */}
                <span className="time">
                  {" "}
                  {lineKeyParser(chat.line_key, `HH:mm`)}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    case EchatType.chat.toString(): {
      return (
        <div className={`speech-row ${isMine ? `speech-my` : `speech-others`}`}>
          {!isMine && (
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
          )}
          <div
            className={`${
              isMine ? `speech-content-wrap-mine` : `speech-content-wrap-his`
            }`}
          >
            {!isMine && (
              <div className="speaker-info-wrap">{chat.chat_send_name}</div>
            )}
            <div className="speech-inner-wrap">
              <div className="speech-content">
                <pre>{chat.chat_contents}</pre>
              </div>
              <div className="speech-info">
                {/* <span className="unread-ppl">{chat.read_count}</span> */}
                <span className="time">
                  {" "}
                  {lineKeyParser(chat.line_key, `HH:mm`)}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    case EchatType.fileSkeleton.toString(): {
      return (
        <div className={`speech-row ${isMine ? `speech-my` : `speech-others`}`}>
          {!isMine && (
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
          )}
          <div
            className={`${
              isMine ? `speech-content-wrap-mine` : `speech-content-wrap-his`
            }`}
          >
            {!isMine && (
              <div className="speaker-info-wrap">{chat.chat_send_name}</div>
            )}
            <div className="speech-inner-wrap">
              <FileInfo>
                <div>
                  <div>{chat.chat_contents}</div>
                  <div>{chat.file_status}</div>
                </div>
                <div>
                  <img src="./images/icon_attatched_file.png" />
                </div>
              </FileInfo>
              <div className="speech-info">
                {/* <span className="unread-ppl">{chat.read_count}</span> */}
                <span className="time">
                  {" "}
                  {lineKeyParser(chat.line_key, `HH:mm`)}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    default:
      return <></>;
  }
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
