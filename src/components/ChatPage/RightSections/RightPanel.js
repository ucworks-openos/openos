import React, { useState, useEffect } from "react";
import HamburgerButton from "../../../common/components/HamburgerButton";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import { useDispatch, useSelector } from "react-redux";
import { exitChatRoom } from "../../../common/ipcCommunication/ipcMessage";
import {
  setChatRooms,
  setCurrentChatRoom,
} from "../../../redux/actions/chat_actions";

function RightPanel() {
  const [isHamburgerButtonClicked, setIsHamburgerButtonClicked] = useState(
    false
  );
  const { currentChatRoom, chatRooms } = useSelector((state) => state.chats);
  const dispatch = useDispatch();
  // winston.info('currentChatRoom', currentChatRoom)
  const clickHamburgerButton = () => {
    setIsHamburgerButtonClicked(!isHamburgerButtonClicked);
  };
  const handleExitChatRoom = () => {
    const rest = chatRooms.filter(
      (v) => v.room_key !== currentChatRoom.room_key
    );
    exitChatRoom(currentChatRoom.room_key);
    dispatch(setChatRooms(rest));
    dispatch(setCurrentChatRoom(rest[0].room_key, rest));
  };

  return (
    <main className="chat-main-wrap">
      <div className="chat-title-wrap">
        <div className="btn-chat-ppl-info">
          {currentChatRoom && currentChatRoom.chat_entry_ids.split("|").length}
        </div>
        {/* <h4 className="chat-name">tf팀</h4> */}
        <div className="chat-local-search-wrap">
          <input
            type="text"
            className="chat-local-search"
            placeholder="대화 검색"
          />
        </div>
        <div className="chat-action-wrap">
          <div className="chat-action drawer" title="모아보기"></div>
          <div className="chat-action voice-talk" title="보이스톡"></div>
          <div className="chat-action face-talk" title="페이스톡"></div>
          <div className="chat-action chat-favorite-toggle" title="즐겨찾기">
            <input type="checkbox" id="chat-favorite-toggle-check" />
            <label
              className="chat-favorite-toggle-inner"
              htmlFor="chat-favorite-toggle-check"
              title="즐겨찾기"
            ></label>
          </div>
          <div className="chat-action chat-noti-toggle" title="대화방 알림">
            <input type="checkbox" id="chat-noti-toggle-check" />
            <label
              className="chat-noti-toggle-inner"
              htmlFor="chat-noti-toggle-check"
              title="대화방 알림"
            ></label>
          </div>
        </div>
        <div className="lnb" title="더보기">
          <HamburgerButton
            active={isHamburgerButtonClicked}
            clicked={isHamburgerButtonClicked}
            propsFunction={clickHamburgerButton}
          />
          <ul
            className={
              isHamburgerButtonClicked ? "lnb-menu-wrap" : "lnb-menu-wrap-hide"
            }
          >
            <li className="lnb-menu-item">
              <h6>대화상대 초대</h6>
            </li>
            <li className="lnb-menu-item">
              <h6>대화방 설정</h6>
            </li>
            <li className="lnb-menu-item">
              <h6>현재 대화 화면 캡처</h6>
            </li>
            <li className="lnb-menu-item">
              <h6>대화 저장</h6>
            </li>
            <li className="lnb-menu-item">
              <h6>대화내용 모두 삭제</h6>
            </li>
            <li className="lnb-menu-item" onMouseDown={handleExitChatRoom}>
              <h6>대화방 삭제</h6>
            </li>
          </ul>
        </div>
      </div>
      <ChatMessages />
      <ChatInput />
    </main>
  );
}

export default RightPanel;
