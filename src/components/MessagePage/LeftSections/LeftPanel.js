import React, { useState } from 'react'
import MessageLists from './MessageLists';
import { useDispatch, useSelector } from 'react-redux';
import {
    setCurrentMessageListsType,
} from "../../../redux/actions/message_actions";
import Modal from "react-modal";
import MessageInputModal from '../../../common/components/Modal/MessageInputModal';

function LeftPanel() {
    const [isOpenMessageInputModal, setIsOpenMessageInputModal] = useState(false)
    const dispatch = useDispatch();
    const currentMessageListType = useSelector(state => state.messages.currentMessageListType)
    const onChangeMessageListsTypeClick = () => {
        dispatch(setCurrentMessageListsType(currentMessageListType === 'MSG_RECV' ? 'MSG_SEND' : 'MSG_RECV'))
    }
    const onOpenMessageInputModalClick = () => {
        setIsOpenMessageInputModal(true)
    }
    const MessageInputModalClose = () => {
        setIsOpenMessageInputModal(false)
    }

    return (
        <div className="list-area">
            <div className="chat-page-title-wrap">
                <h4 className="page-title">쪽지
                    <button style={{ margin: '0 10px', padding: '4px', border: '1px solid black' }} onClick={onChangeMessageListsTypeClick}>
                        {currentMessageListType === 'MSG_RECV' ? "받은 쪽지" : "보낸 쪽지"}
                    </button>

                    <button style={{ margin: '0 10px', padding: '4px', border: '1px solid black' }} onClick={onOpenMessageInputModalClick}>
                        메시지 보내기
                    </button>
                </h4>
                <div className="chat-list-action-wrap">
                    <div className="chat-list-action add" title="대화 추가"></div>
                    <div className="chat-list-action search" title="대화방 검색">
                        <input type="checkbox" id="chat-list-search-toggle-check" />
                        <label className="chat-list-search-toggle" htmlFor="chat-list-search-toggle-check"></label>
                        <div className="chat-list-search-wrap">
                            <input type="text" className="chat-list-search" placeholder="대화방 명, 참여자명, 대화내용 검색" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="chat-list-wrap">
                <ul>
                    <MessageLists />
                </ul>
            </div>

            <Modal
                isOpen={isOpenMessageInputModal}
                onRequestClose={MessageInputModalClose}
                style={CustomStyles}
            >
                <MessageInputModal
                    closeModalFunction={MessageInputModalClose}
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
Modal.setAppElement("#root");
