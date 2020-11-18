import React, { useState, useEffect, useRef } from "react";
import ChatRooms from "./ChatRoom";
import Modal from "react-modal";
import ChatInvitationModal from "../../../common/components/Modal/ChatInvitationModal";
import { useDispatch, useSelector } from "react-redux";
import { getInitialChatRooms, setCurrentChatRoom, setEmojiVisible, setEmoticonVisible } from "../../../redux/actions/chat_actions";
import ChatRoom from "./ChatRoom";

function LeftPanel() {
  const dispatch = useDispatch();
  const { chatRooms, currentChatRoom, unreadChatRoomKeys } = useSelector(
    (state) => state.chats
  );

  const [isOpenChatInputModal, setIsOpenChatInputModal] = useState(false);
  const searchbarRef = useRef(null);

  useEffect(() => {
    dispatch(getInitialChatRooms());
  }, []);

  const onOpenChatInputModalClick = () => {
    setIsOpenChatInputModal(true);
  };
  const ChatInputModalClose = () => {
    setIsOpenChatInputModal(false);
  };
  const handleClickSearchbar = () => {
    searchbarRef.current.focus();
  };

  const onChatRoomClick = (roomKey) => {
    dispatch(setCurrentChatRoom(roomKey, chatRooms));
    dispatch(setEmojiVisible(false));
    dispatch(setEmoticonVisible(false));
  };

  
  return (
    <div className="chat-list-area">
      <div className="chat-page-title-wrap">
        <h4 className="page-title">대화</h4>
        <div className="chat-list-action-wrap">
          <div
            className="chat-list-action add"
            title="대화 추가"
            onClick={onOpenChatInputModalClick}
          ></div>
          <div className="chat-list-action search" title="대화방 검색">
            <input type="checkbox" id="chat-list-search-toggle-check" />
            <label
              className="chat-list-search-toggle"
              htmlFor="chat-list-search-toggle-check"
            ></label>
            <div
              className="chat-list-search-wrap"
              onClick={handleClickSearchbar}
            >
              <input
                type="text"
                placeholder="대화방 명, 참여자 명, 대화 내용"
                ref={searchbarRef}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="chat-list-wrap">
        <ul>
          <div>

          {chatRooms?.map((chatRoom, index) => {
            return <ChatRoom chatRoom={chatRoom} 
                      onChatRoomClick={onChatRoomClick} 
                      isSelected={chatRoom.room_key === currentChatRoom?.room_key} 
                      key={index}/>
          })}

          </div>
        </ul>
      </div>

      <Modal
        isOpen={isOpenChatInputModal}
        onRequestClose={ChatInputModalClose}
        style={CustomStyles}
      >
        <ChatInvitationModal closeModalFunction={ChatInputModalClose} />
      </Modal>
    </div>
  );
}

export default LeftPanel;
const CustomStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
  overlay: { zIndex: 1000 },
};
