import React, { useEffect, useState } from "react";
import MessageContent from "./MessageContent";
import { useDispatch, useSelector } from "react-redux";
import MessageFiles from "./MessageFiles";
import { deleteMessage } from "../../../common/ipcCommunication/ipcMessage";
import { setMessageList } from "../../../redux/actions/message_actions";
import { messageInputModalStyle, delay } from "../../../common/util";
import Modal from "react-modal";
import MessageInputModal from "../../../common/components/Modal/MessageInputModal";
import moment from "moment";

function RightPanel() {
  const dispatch = useDispatch();

  const { message, messageLists, currentMessageListType } = useSelector(
    (state) => state.messages
  );

  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [replyTarget, setReplyTarget] = useState([]);
  const [initialTitle, setInitialTitle] = useState(``);

  const onDeleteMessageClick = () => {
    deleteMessage(currentMessageListType, [message.msg_key]).then(() => {
      dispatch(
        setMessageList(
          messageLists.filter((v) => v.msg_key !== message.msg_key)
        )
      );
    });
  };

  const handleReply = () => {
    setReplyTarget([message?.msg_send_id]);
    setInitialTitle(`Re: ${message?.msg_subject}`);
    setMessageModalVisible(true);
  };

  const handleReplyAll = () => {
    setReplyTarget(message?.msg_recv_ids.split(`|`));
    setInitialTitle(`Re: ${message?.msg_subject}`);
    setMessageModalVisible(true);
  };

  const handleDelivery = () => {
    setReplyTarget([]);
    setInitialTitle(`Fwd: ${message?.msg_subject}`);
    setMessageModalVisible(true);
  };

  useEffect(() => {
    console.log(message);
  });

  const initialContent = `
  <br/><br/> ---------------> original message <--------------- <br/>
  > 발신인: ${message?.msg_send_name} <br/>
  > 발신일시: ${moment(message?.msg_send_date, `YYYYMMDDHHmm`).format(
    `YYYY. MM. DD. hh:mm a`
  )} <br/>
  > 제목: ${message?.msg_subject} <br/>
  > 수신인: ${message?.msg_recv_name}
  <br/>

  ${message?.msg_content}
  `;

  return (
    <main className="message-main-wrap">
      <div className="message-title-wrap">
        <h4 className="message-title-single">
          {message && message.msg_subject}
        </h4>
        <div className="message-action-wrap">
          <div
            className="message-action reply"
            title="답장"
            onClick={handleReply}
          ></div>
          <div
            className="message-action reply-all"
            title="전체답장"
            onClick={handleReplyAll}
          ></div>
          <div
            className="message-action foward"
            title="전달"
            onClick={handleDelivery}
          ></div>
          <div className="message-action write-new" title="새쪽지쓰기"></div>
          <div className="message-action go-to-chat" title="채팅"></div>
          <div className="message-action download" title="다운로드"></div>
          <div className="message-action print" title="인쇄"></div>
          <div
            className="message-action remove"
            title="삭제"
            onClick={() => onDeleteMessageClick()}
          ></div>
        </div>
      </div>

      <Modal
        isOpen={messageModalVisible}
        onRequestClose={() => {
          setMessageModalVisible(false);
        }}
        style={messageInputModalStyle}
      >
        <MessageInputModal
          closeModalFunction={() => {
            setMessageModalVisible(false);
          }}
          selectedNode={replyTarget}
          initialTitle={initialTitle}
          initialContent={initialContent}
        />
      </Modal>

      <MessageContent />

      <MessageFiles />
    </main>
  );
}

Modal.setAppElement("#root");

export default RightPanel;
