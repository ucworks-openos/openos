import React, { useEffect, useState } from "react";
import MessageContent from "./MessageContent";
import { useDispatch, useSelector } from "react-redux";
import MessageFiles from "./MessageFiles";
import { deleteMessage } from "../../../common/ipcCommunication/ipcMessage";
import {
  getMessageHo,
  setCurrentMessage,
  setMessageList,
} from "../../../redux/actions/message_actions";
import { delay } from "../../../common/util";
import { messageInputModalStyle } from "../../../common/styles";
import Modal from "react-modal";
import MessageInputModal from "../../../common/components/SendMessageModal/MessageInputModal";
import moment from "moment";
import HamburgerButton from "../../../common/components/HamburgerButton";
import { writeDebug } from "../../../common/ipcCommunication/ipcLogger";

function RightPanel() {

  //#region String trim ...
  String.prototype.trimRight = function(trimStr) {
    if (trimStr) {
        const last = [...this].reverse().findIndex(char => char !== trimStr);
        return this.substring(0, this.length - last);
    }
    return this;
  };

  String.prototype.trimLeft = function(trimStr) {
      if (trimStr) {
        // while(this.charAt(0)==charToRemove) {
        //   this = this.substring(1);
        // }

        const first = [...this].findIndex(char => char !== trimStr);
        return this.substring(first);
      }
      return this;
  };
  //#endregion String trim

  const dispatch = useDispatch();

  const { message, currentMessage, messageLists, currentMessageListType } = useSelector(
    (state) => state.messages
  );

  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [replyTarget, setReplyTarget] = useState([]);
  const [initialTitle, setInitialTitle] = useState(``);
  const [isHamburgerButtonClicked, setIsHamburgerButtonClicked] = useState(false);

  const [attachmentFiles, setAttachmentFiles] = useState([]);

  useEffect(() => {
    writeDebug('CurrentMessage --  req getMessageHo ', currentMessage);
    dispatch(getMessageHo(currentMessage));
  }, [currentMessage]);
  
  // 메세지가 변경되면 첨부파일 정보를 설정한다.
  useEffect(() => {
    
    if (message?.msg_file_list) {
      let fileList = [];

      let fileInfoPieces = message?.msg_file_list.trimRight('|').split('|');
      for(let i=0; i < fileInfoPieces.length;) {
          let serverInfos = fileInfoPieces[i++].split(';');
          fileList.push({
              serverIp:serverInfos[0],
              serverPort: parseInt(serverInfos[1]),
              name: fileInfoPieces[i++],
              size: fileInfoPieces[i++],
              svrName: fileInfoPieces[i++],
            })
      }
 
      setAttachmentFiles(fileList);
    } else {
      setAttachmentFiles([]);
    }
    
  }, [message]);

  const onDeleteMessageClick = () => {
    if (!message) return

    deleteMessage(currentMessageListType, [message.msg_key]).then(() => {
      dispatch(
        setMessageList(
          messageLists.filter((v) => v.msg_key !== message.msg_key)
        )
      );
      dispatch(setCurrentMessage(messageLists[0].msg_key));
    });
  };

  const handleReply = () => {
    if (!message) return
    setReplyTarget([message?.msg_send_id]);
    setInitialTitle(`Re: ${message?.msg_subject}`);
    setMessageModalVisible(true);
  };

  const handleReplyAll = () => {
    if (!message) return
    setReplyTarget(message?.msg_recv_ids.split(`|`));
    setInitialTitle(`Re: ${message?.msg_subject}`);
    setMessageModalVisible(true);
  };

  const handleDelivery = () => {
    if (!message) return
    setReplyTarget([]);
    setInitialTitle(`Fwd: ${message?.msg_subject}`);
    setMessageModalVisible(true);
  };

  const initialContent = `
  <br/><br/> ---------------> original message <--------------- <br/>
  > 발신인: ${message?.msg_send_name} <br/>
  > 발신일시: ${moment(message?.msg_send_date, `YYYYMMDDHHmm`).format(
    `YYYY. MM. DD. h:mm a`
  )} <br/>
  > 제목: ${message?.msg_subject} <br/>
  > 수신인: ${message?.msg_recv_name}
  <br/>

  ${message?.msg_content}
  `;

  return (
    <main className="message-main-wrap">
      <div className="message-title-wrap">
        <div
          dangerouslySetInnerHTML={{ __html: message?.msg_subject }}
          className="message-title-single"
          title={message?.msg_subject}
        />

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
          {/* <div className="message-action write-new" title="새쪽지쓰기"></div>
          <div className="message-action go-to-chat" title="채팅"></div> */}
          {/* <div className="message-action download" title="다운로드"></div>
          <div className="message-action print" title="인쇄"></div> */}
          <div
            className="message-action remove"
            title="삭제"
            onClick={() => onDeleteMessageClick()}
          ></div>
        </div>
        <div class="lnb">
          <HamburgerButton
            active={isHamburgerButtonClicked}
            clicked={isHamburgerButtonClicked}
            propsFunction={() => {
              setIsHamburgerButtonClicked(!isHamburgerButtonClicked);
            }}
            closeFunction={() => {
              setIsHamburgerButtonClicked(false);
            }}
          />
          <ul
            className={
              isHamburgerButtonClicked ? "lnb-menu-wrap" : "lnb-menu-wrap-hide"
            }
          >
            <li class="lnb-menu-item" onMouseDown={handleReply}>
              <h6>답장</h6>
            </li>
            <li class="lnb-menu-item" onMouseDown={handleReplyAll}>
              <h6>전체 답장</h6>
            </li>
            <li class="lnb-menu-item" onMouseDown={handleDelivery}>
              <h6>전달</h6>
            </li>
            <li
              class="lnb-menu-item"
              onMouseDown={() => onDeleteMessageClick()}
            >
              <h6>삭제</h6>
            </li>
          </ul>
        </div>
      </div>

      <Modal
        isOpen={messageModalVisible}
        onRequestClose={() => {
          setMessageModalVisible(false);
        }}
        style={messageInputModalStyle}
        shouldCloseOnOverlayClick={false}
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

      <MessageContent message={message}/>

      { attachmentFiles.length>0 &&
          <MessageFiles attachmentFiles={attachmentFiles} setAttachmentFiles={setAttachmentFiles} />
      }

      
    </main>
  );
}

Modal.setAppElement("#root");

export default RightPanel;
