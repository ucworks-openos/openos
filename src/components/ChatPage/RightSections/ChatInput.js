import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addChatMessage } from "../../../redux/actions/chat_actions";
import Alert from "react-bootstrap/Alert";
import { getUserInfos } from "../../../common/ipcCommunication/ipcOrganization";
import { arrayLike } from "../../../common/util";

function ChatInput() {
  const dispatch = useDispatch();
  const currentChatRoom = useSelector((state) => state.chats.currentChatRoom);
  const [inputValue, setInputValue] = useState("");
  const [isAlreadyTyped, setIsAlreadyTyped] = useState(false);
  const [isAlreadyRoomSelected, setIsAlreadyRoomSelected] = useState(false);
  const inputRef = useRef(null);
  const loggedInUser = useSelector((state) => state.users.loggedInUser);
  const onInputValueChange = (e) => {
    setInputValue(e.currentTarget.value);
  };

  const getUserNames = async (userIds) => {
    const {
      data: {
        items: { node_item: userSchemaMaybeArr },
      },
    } = await getUserInfos(userIds);
    // *  사용자 상세 정보가 하나일 경우를 가정하여 배열로 감쌈.
    const userSchema = arrayLike(userSchemaMaybeArr);
    // * 가져온 정보를 가공. 이 때 selectedKeys 유저가 Favorite 유저와 중복됟 시 중복 표기 해 줌.
    const result = userSchema.map((v) => v.user_name.value).join(`, `);
    console.log(result);
    return result;
  };

  const handleFocusInput = () => {
    console.log(`focus input!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
    inputRef.current.focus();
  };

  const onSubmit = async (event) => {
    let userNames;
    if (!currentChatRoom.chat_entry_names) {
      userNames = await getUserNames(
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
        false,
        currentChatRoom.room_key,
        loggedInUser.user_name.value,
        loggedInUser.user_id.value
      )
    );
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

      <div className="chat-input-area">
        <div className="chat-input-wrap" onClick={handleFocusInput}>
          <input
            ref={inputRef}
            className="chat-input"
            onKeyDown={(e) => {
              e.keyCode === 13 && onSubmit();
            }}
            value={inputValue}
            onChange={onInputValueChange}
            placeholder="채팅 내용을 입력해주세요."
          ></input>
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
          <div className="input-action btn-emoticon" title="이모티콘"></div>
          <div className="input-action btn-emoji" title="이모지"></div>
          <div className="input-action btn-add-file" title="파일전송"></div>
          <div className="input-action btn-call" title="통화"></div>
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
          <div className="input-action btn-save-chat" title="대화저장"></div>
        </div>
      </div>
    </>
  );
}

export default ChatInput;
