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
import MemberTooltip from "../../../common/components/Tooltip/MemberTooltip";
import styled from "styled-components";
import Modal from "react-modal";
import ChangeChatRoomModal from "../ChangeChatRoomNameModal";
import { commonModalStyles, messageInputModalStyle } from "../../../common/styles";
import { getChatRoomName, getChatUserIds, getDispUserNames } from "../../../common/util";
import ChatInvitationModal from "../../../common/components/Modal/ChatInvitationModal";

function RightPanel() {
  const dispatch = useDispatch();

  const loggedInUser = useSelector((state) => state.users.loggedInUser);
  const { currentChatRoom, chatRooms } = useSelector((state) => state.chats);

  const [isHamburgerButtonClicked, setIsHamburgerButtonClicked] = useState(
    false
  );
  const [searchbarVisible, setSearchbarVisible] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [changeRoomNameModalVisible, setChangeRoomNameModalVisible] = useState(false);
  const [inviteUserModalVisible, setInviteUserModalVisible] = useState(false);

  const [chatRoomName, setChatRoomName] = useState('');
  const [chatUserIds, setChatUserIds] = useState([]);
  

  useEffect(() => {
    async function fetchData() {
      if (currentChatRoom) {
        let userIds = await getChatUserIds(currentChatRoom?.chat_entry_ids);
        setChatRoomName(currentChatRoom.chat_entry_names?getChatRoomName(currentChatRoom.chat_entry_names): await getDispUserNames(chatUserIds))
        setChatUserIds(chatUserIds)
      }
    }
    
    fetchData();
  }, [currentChatRoom]);

  const toggleTooltip = () => {
    setTooltipVisible(!tooltipVisible);
  };

  const closeTooltip = () => {
    setTooltipVisible(false);
  };

  const clickHamburgerButton = () => {
    setIsHamburgerButtonClicked(!isHamburgerButtonClicked);
  };

  /**
   * handleExitChatRoom
   */
  const handleExitChatRoom = () => {
    const rest = chatRooms.filter(
      (v) => v.room_key !== currentChatRoom.room_key
    );

    // 퇴장하는 아이디가 필요없다면 뺀다.
    let userIdList = getChatUserIds(currentChatRoom.chat_entry_ids);
    userIdList = userIdList.filter((id) => id !== loggedInUser.user_id.value);

    exitChatRoom(currentChatRoom.room_key, userIdList);
    dispatch(setChatRooms(rest));
    dispatch(setCurrentChatRoom(rest[0].room_key, rest));
  };

  /**
   * handleInviteUser
   */
  const handleInviteUser = () => {

  }

  /**
   * handleChangeRoomName
   */
  const handleChangeRoomName = () => {

  }

  return (
    <main className="chat-main-wrap">
      <div className="chat-title-wrap">
        <div className="chat-title-left-wrap">
          <div
            className="btn-chat-ppl-info"
            onClick={toggleTooltip}
            onBlur={closeTooltip}
            tabIndex={1}
          >
            {chatUserIds.length}
            {tooltipVisible && (
              <MemberTooltipWrapper>
                <MemberTooltip
                  userIds={chatUserIds}
                  type="chat"
                />
              </MemberTooltipWrapper>
            )}
          </div>
          <div className="chat-name" title={chatRoomName}>
            {chatRoomName}
          </div>
        </div>
        <div className="chat-action-wrap">
          <div
            className="chat-action-search"
            title="검색"
            onClick={() => {
              setSearchbarVisible((prev) => !prev);
            }}
          />
          {/* <div className="chat-action drawer" title="모아보기"></div> */}
          {/* <div className="chat-action voice-talk" title="보이스톡"></div> */}
          {/* <div className="chat-action face-talk" title="페이스톡"></div> */}
          {/* <div className="chat-action chat-favorite-toggle" title="즐겨찾기">
            <input type="checkbox" id="chat-favorite-toggle-check" />
            <label
              className="chat-favorite-toggle-inner"
              htmlFor="chat-favorite-toggle-check"
              title="즐겨찾기"
            ></label>
          </div> */}
          <div className="chat-action chat-noti-toggle" title="대화방 알림">
            <input type="checkbox" id="chat-noti-toggle-check" />
            <label
              className="chat-noti-toggle-inner"
              htmlFor="chat-noti-toggle-check"
              title="대화방 알림"
            ></label>
          </div>
          <div className="lnb" title="더보기">
            <HamburgerButton
              active={isHamburgerButtonClicked}
              clicked={isHamburgerButtonClicked}
              propsFunction={clickHamburgerButton}
              closeFunction={() => {
                setIsHamburgerButtonClicked(false);
              }}
            />
            <ul
              className={
                isHamburgerButtonClicked
                  ? "lnb-menu-wrap"
                  : "lnb-menu-wrap-hide"
              }
            >
              <li className="lnb-menu-item" onMouseDown={handleInviteUser}>
                <h6>대화상대 초대</h6>
              </li>
              <li className="lnb-menu-item" onMouseDown={handleChangeRoomName}>
                <h6>대화방 설정</h6>
              </li>
              {/* <li className="lnb-menu-item">
                <h6>현재 대화 화면 캡처</h6>
              </li>
              <li className="lnb-menu-item">
                <h6>대화 저장</h6>
              </li>
              <li className="lnb-menu-item">
                <h6>대화내용 모두 삭제</h6>
              </li> */}
              <li className="lnb-menu-item" onMouseDown={handleExitChatRoom}>
                <h6>대화방 삭제</h6>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {searchbarVisible && (
        <div className="chat-info-area">
          <div className="chat-local-search-wrap">
            <input
              type="text"
              className="chat-local-search"
              placeholder="대화 검색"
            />
          </div>
        </div>
      )}
      {currentChatRoom&&
        <div>
          <Modal
            isOpen={changeRoomNameModalVisible}
            onRequestClose={() => {
              setChangeRoomNameModalVisible(false);
            }}
            style={commonModalStyles}
          >
            
            <ChangeChatRoomModal
              closeModalFunction={() => {
                setChangeRoomNameModalVisible(false);
              }}
              chatRoomKey={currentChatRoom.room_key}
              asIsRoomName={chatRoomName}
            />
          </Modal>

          <Modal
            isOpen={inviteUserModalVisible}
            onRequestClose={() => {
              setInviteUserModalVisible(false);
            }}
            style={messageInputModalStyle}
          >
            <ChatInvitationModal
              closeModalFunction={() => {
                setInviteUserModalVisible(false);
              }}

              chatRoomKey={currentChatRoom.room_key}
              chatUserIds = {chatUserIds}
              roomName = {chatRoomName}
            />
          </Modal>
        </div>
      }

      <ChatMessages />
      <ChatInput />
    </main>
  );
}

const MemberTooltipWrapper = styled.div`
  position: absolute;
  top: 45px;
`;
export default RightPanel;
