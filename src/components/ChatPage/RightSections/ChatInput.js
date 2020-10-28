import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addChatMessage,
  setCurrentEmoticon,
  setEmojiVisible,
  setEmoticonVisible,
} from "../../../redux/actions/chat_actions";
import Alert from "react-bootstrap/Alert";
import { getUserInfos } from "../../../common/ipcCommunication/ipcOrganization";
import { arrayLike } from "../../../common/util";
import EmojiPicker from "emoji-picker-react";
import Modal from "react-modal";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import "./EmojiMartCustom.css";
import EmoticonSelector from "../../../common/components/Editor/EmoticonSelector";
import { getDispUserNames } from "../../../common/util/userUtil";
import styled from "styled-components";

function ChatInput() {
  const dispatch = useDispatch();
  const {
    currentChatRoom,
    emojiVisible,
    emoticonVisible,
    currentEmoticon,
  } = useSelector((state) => state.chats);
  const [inputValue, setInputValue] = useState("");
  const [isAlreadyTyped, setIsAlreadyTyped] = useState(false);
  const [isAlreadyRoomSelected, setIsAlreadyRoomSelected] = useState(false);

  const inputRef = useRef(null);
  const loggedInUser = useSelector((state) => state.users.loggedInUser);

  useEffect(() => {
    const electron = window.require("electron");
    electron.ipcRenderer.on(
      "upload-file-progress",
      (event, uploadKey, uploadedLength, fileLength) => {
        console.log(
          uploadKey,
          ((uploadedLength / fileLength) * 100).toFixed(0) + "%"
        );
      }
    );
    console.log(`file monitoring start...`);
    return () => {
      electron.ipcRenderer.removeAllListeners("upload-file-progress");
      dispatch(setEmojiVisible(false));
      dispatch(setEmoticonVisible(false));
      dispatch(setCurrentEmoticon(``));
    };
  }, []);

  const handleSelectFile = (e) => {
    console.log(`file selected: `, e.target.files);
  };

  const onInputValueChange = (e) => {
    setInputValue(e.currentTarget.value);
  };

  const handleNewLine = (e) => {
    const {
      which,
      nativeEvent: { shiftKey },
    } = e;

    if (which === 13 && !shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const handleEmojiVisible = () => {
    dispatch(setEmojiVisible(false));
  };

  const handleFocusInput = () => {
    inputRef.current.focus();
  };

  const handleEmoticonPick = () => {
    dispatch(setEmojiVisible(false));
    dispatch(setEmoticonVisible(!emoticonVisible));
  };

  const handleEmojiPick = () => {
    dispatch(setEmoticonVisible(false));
    dispatch(setEmojiVisible(!emojiVisible));
  };

  const handleEmojiClick = (emoji, event) => {
    setInputValue(inputValue + emoji.native);
    dispatch(setEmojiVisible(false));
  };

  const onSubmit = async (event) => {
    let userNames;
    if (!currentChatRoom.chat_entry_names) {
      userNames = await getDispUserNames(
        currentChatRoom?.chat_entry_ids?.split("|")
      );
    } else {
      userNames = currentChatRoom.chat_entry_names;
    }
    if (inputValue.trim().length === 0) {
      setIsAlreadyTyped(true);
      setTimeout(() => {
        setIsAlreadyTyped(false);
      }, 2000);
      return;
    }
    if (!currentChatRoom) {
      setIsAlreadyRoomSelected(true);
      setTimeout(() => {
        setIsAlreadyRoomSelected(false);
      }, 2000);
      return;
    }

    setInputValue("");
    dispatch(
      addChatMessage(
        currentChatRoom.chat_entry_ids,
        userNames,
        inputValue,
        currentEmoticon ? currentEmoticon : `맑은 고딕`,
        false,
        currentChatRoom.room_key,
        loggedInUser.user_name.value,
        loggedInUser.user_id.value
      )
    );
    dispatch(setEmojiVisible(false));
    dispatch(setEmoticonVisible(false));
    dispatch(setCurrentEmoticon(``));
  };

  return (
    <>
      {isAlreadyTyped && (
        <div
          style={{
            position: "absolute",
            left: "0",
            bottom: "187px",
            width: "100%",
          }}
        >
          <Alert variant="danger">먼저 글자를 입력해주세요.</Alert>
        </div>
      )}
      {isAlreadyRoomSelected && (
        <div
          style={{
            position: "absolute",
            left: "0",
            bottom: "187px",
            width: "100%",
          }}
        >
          <Alert variant="danger">먼저 방을 선택해주세요.</Alert>
        </div>
      )}

      <div>
        <Picker
          showPreview={false}
          showSkinTones={false}
          emojiTooltip={true}
          onClick={handleEmojiClick}
          style={{
            display: emojiVisible ? `block` : `none`,
          }}
        />
        <Hover emojiVisible={emojiVisible} onClick={handleEmojiVisible}>
          <CloseButton />
        </Hover>
      </div>
      <EmoticonSelector visible={emoticonVisible ? true : false} />
      <div className="chat-input-area">
        <div className="chat-input-wrap" onClick={handleFocusInput}>
          <textarea
            ref={inputRef}
            className="chat-input"
            value={inputValue}
            onChange={onInputValueChange}
            placeholder="채팅 내용을 입력해주세요."
            onKeyDown={handleNewLine}
          ></textarea>
          <button
            onClick={onSubmit}
            type="submit"
            style={{ width: "78px", height: "48px" }}
            className="btn-ghost-m"
          >
            전송
          </button>
        </div>

        <div className="input-action-wrap">
          <div
            className="input-action btn-txt"
            title="텍스트 (글꼴, 크기, 색상,표)"
          ></div>
          <div
            className="input-action btn-emoticon"
            title="이모티콘"
            onClick={handleEmoticonPick}
          ></div>
          <div
            className="input-action btn-emoji"
            title="이모지"
            onClick={handleEmojiPick}
          ></div>
          <div class="input-action-file-wrapper">
            <label for="btn-add-file">
              <div className="input-action btn-add-file" title="파일전송"></div>
            </label>
            <input
              type="file"
              multiple="multiple"
              id="btn-add-file"
              class="btn-add-file"
              onChange={handleSelectFile}
            />
          </div>

          {/* <div className="input-action btn-call" title="통화"></div>
          <div className="input-action btn-remote" title="원격제어"></div>
          <div
            className="input-action btn-shake-window"
            title="상대창 흔들기"
          ></div>
          <div className="input-action btn-send-capture" title="캡처전송"></div>
          <div
            className="input-action btn-send-survey"
            title="설문보내기"
          ></div>
          <div className="input-action btn-save-chat" title="대화저장"></div> */}
        </div>
      </div>
    </>
  );
}

const Hover = styled.div`
  display: ${(props) => (props.emojiVisible ? `block` : `none`)};
  position: absolute;
  bottom: 480px;
  right: 10px;
  padding: 5px 10px;
  border-radius: 50%;
  &:hover {
    background-color: #dfe2e8;
    cursor: pointer;
  }
`;

const CloseButton = styled.div`
  background-image: url(./images/btn_close.png);
  width: 10px;
  height: 20px;
  background-repeat: no-repeat;
  background-position: 0px center;
`;

export default ChatInput;
