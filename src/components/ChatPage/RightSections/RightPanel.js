import React, { useState, useEffect } from "react";
import HamburgerButton from "../../../common/components/HamburgerButton";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import { useDispatch, useSelector } from "react-redux";
import { changeChatRoomName, exitChatRoom } from "../../../common/ipcCommunication/ipcMessage";
import {
  setChatMessages,
  setChatRooms,
  setCurrentChatRoom,
  updateCurrentChatRoom,
} from "../../../redux/actions/chat_actions";
import MemberTooltip from "../../../common/components/Tooltip/MemberTooltip";
import styled from "styled-components";
import Modal from "react-modal";
import ChangeChatRoomModal from "../ChangeChatRoomNameModal";
import { commonModalStyles, messageInputModalStyle } from "../../../common/styles";
import { getChatUserIds, getDispUserNames } from "../../../common/util";
import ChatInvitationModal from "../../../common/components/Modal/ChatInvitationModal";
import { writeError, writeInfo } from "../../../common/ipcCommunication/ipcLogger";
import { getChatRoomName, getChatRoomNameAsync } from "../../../common/util/chatUtil";

function RightPanel() {
  const dispatch = useDispatch();
  const { remote } = window.require("electron")

  const loginUser = remote.getGlobal('USER');
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
        let userIds = getChatUserIds(currentChatRoom.chat_entry_ids);

        writeInfo('Chat RightPanel', {
          room_key:currentChatRoom.room_key,
          room_type:currentChatRoom.room_type,
          chat_entry_ids:currentChatRoom.chat_entry_ids,
          chat_entry_names:currentChatRoom.chat_entry_names});

        
        setChatRoomName(await getChatRoomNameAsync(currentChatRoom.chat_entry_names, userIds, 3));
        setChatUserIds(userIds)
      } else {
        writeInfo('Chat RightPanel  CurrentRoomEmpty!');
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
  const handleExitChatRoom = async () => {

    if (!currentChatRoom) return;

    const newRooms = chatRooms.filter(
      (v) => v.room_key !== currentChatRoom.room_key
    );
    
    // 퇴장하는 아이디가 필요없다면 뺀다.
    let userIdList = getChatUserIds(currentChatRoom.chat_entry_ids);

    // 1:1은 그냥 참여자 ID를 놔둔다. N 대화방에서만 제거해 버린다.
    // room_type:2 -> 1:N
    if ((currentChatRoom.room_type + '') == "2")
      userIdList = userIdList.filter((id) => id !== loginUser.userId);

    let entryUserName = await getDispUserNames(userIdList)

    exitChatRoom(currentChatRoom.room_key, userIdList, entryUserName);
    if (newRooms?.length > 0) {
      dispatch(setChatRooms(newRooms));
      dispatch(setCurrentChatRoom(newRooms[0].room_key, newRooms));
    } else {
      setChatRoomName('');
      setChatUserIds([]);
      dispatch(setChatRooms([]));
      dispatch(setCurrentChatRoom('', []));
      dispatch(setChatMessages([]));
    }
  };

  /**
   * handleInviteUser
   */
  const handleInviteUser = () => {
    setInviteUserModalVisible(true);
  }

  /**
   * handleChangeRoomName
   */
  const handleChangeRoomName = () => {
    setChangeRoomNameModalVisible(true);
  }

  const changeChatRoomNameProc = (newRoomName) => {
    let chatEntryNames = 'UCWARE_CHAT_ROOM_TITLE' + String.fromCharCode(20) + newRoomName;

    changeChatRoomName(currentChatRoom.room_key, chatEntryNames, chatUserIds).then((resData) => {
      if (resData.resCode){
        const upChatRoom = {
          ... currentChatRoom,
          chat_entry_names: chatEntryNames
        }
    
        // 기존방 변경
        dispatch(updateCurrentChatRoom(upChatRoom));
      }
    }).catch((err) => { writeError('changeChatRoomName fail!', currentChatRoom.room_key, chatEntryNames, err) })
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
              chatUserIds={chatUserIds}
              changeChatRoomNameProc={changeChatRoomNameProc}
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

              currRoom={currentChatRoom}
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
