import React, { useState, useEffect } from 'react'
import ChatRooms from './ChatRooms';
import Modal from "react-modal";
import ChatInvitationModal from '../../../common/components/Modal/ChatInvitationModal';

function LeftPanel() {
    const [isOpenChatInputModal, setIsOpenChatInputModal] = useState(false)

    const onOpenChatInputModalClick = () => {
        setIsOpenChatInputModal(true)
    }
    const ChatInputModalClose = () => {
        setIsOpenChatInputModal(false)
    }
    return (
        <div className="list-area">
            <div className="chat-page-title-wrap">
                <h4 className="page-title">대화</h4>
                <div className="chat-list-action-wrap">
                    <div className="chat-list-action add" title="대화 추가" onClick={onOpenChatInputModalClick}></div>
                    <div className="chat-list-action search" title="대화방 검색">
                        <input type="checkbox" id="chat-list-search-toggle-check" />
                        <label className="chat-list-search-toggle" htmlFor="chat-list-search-toggle-check"></label>
                        <div className="chat-list-search-wrap">
                            <input type="text" placeholder="대화방 명, 참여자명, 대화내용 검색" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="chat-list-wrap">
                <ul>
                    <ChatRooms />
                </ul>
            </div>

            <Modal
                isOpen={isOpenChatInputModal}
                onRequestClose={ChatInputModalClose}
                style={CustomStyles}
            >
                <ChatInvitationModal
                    closeModalFunction={ChatInputModalClose}
                />
            </Modal>
        </div>
    )
}

export default LeftPanel
const CustomStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
    }, overlay: { zIndex: 1000 }
};