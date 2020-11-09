import React from "react";
import {
  setCurrentMessage,
  getMoreMessages,
} from "../../../redux/actions/message_actions";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { writeDebug } from "../../../common/ipcCommunication/ipcLogger";

function MessagesLists() {
  const dispatch = useDispatch();
  const page = useSelector((state) => state.messages.page);
  const messageCounts = useSelector((state) => state.messages.messageCounts);
  const messageDefaultCounts = useSelector(
    (state) => state.messages.messageDefaultCounts
  );
  const messageLists = useSelector((state) => state.messages.messageLists);
  const currentMessage = useSelector((state) => state.messages.currentMessage);
  const currentMessageListType = useSelector(
    (state) => state.messages.currentMessageListType
  );

  const onMessageClick = (messageId) => {
    //dispatch(getMessageHo(messageId));
    dispatch(setCurrentMessage(messageId));
  };

  const onLoadMoreClick = () => {
    dispatch(
      getMoreMessages(currentMessageListType, page, messageDefaultCounts)
    );
  };

  const renderMessageLists = () =>
    messageLists &&
    messageLists.map((message, index) => {
      const isCurrentMessage =
        message.msg_key === currentMessage ? "current" : "";
      const receiveNames = message.msg_recv_name.split(",");
      const receiveName =
        receiveNames.length > 1
          ? `${receiveNames[0]} 외 ${receiveNames.length - 1}명`
          : receiveNames[0];

      const renderDestInfo =
        currentMessageListType === "SEND" ? (
          <div className="message-title">
            To :<span key={uuidv4()}> {receiveName}</span>
          </div>
        ) : (
          <div className="message-title">
            From :<span key={uuidv4()}> {message.msg_send_name} </span>
          </div>
        );

      const renderSubInfo =
        currentMessageListType === "SEND" ? (
          <div className="message-from sub1">
            From :{message.msg_send_name}{" "}
          </div>
        ) : (
          <div className="message-from sub1">to :{receiveName} </div>
        );

      return (
        <li
          className={`message-list-single  ${isCurrentMessage}`}
          key={uuidv4()}
          onClick={() => onMessageClick(message.msg_key)}
        >
          <div className="message-list-info-area">
            <div className="list-row 1">{renderDestInfo}</div>
            <div className="list-row 2">
              <div className="message-summary">
                <div
                  dangerouslySetInnerHTML={{ __html: message.msg_subject }}
                />
              </div>
            </div>
            <div className="list-row 3">
              <div className="message-from-wrap">
                {/* <div className="user-pic-wrap">
                  <img src={userThumbnail} alt="user-profile-picture" />
                </div> */}
                <div className="message-from sub1">{renderSubInfo}</div>
                <div className="ppl-position sub1"></div>
              </div>
              <div className="receive-time sub1">
                {moment(message.msg_send_date, "YYYYMMDDHHmm").format(
                  "YYYY. MM. DD. HH:mm"
                )}
              </div>
            </div>
          </div>
        </li>
      );
    });

  return (
    <div>
      {writeDebug("MessageList. CurrentMessage", currentMessage)}
      {renderMessageLists()}
      {page * messageDefaultCounts <= messageCounts && (
        <div style={{ textAlign: "center" }}>
          <button
            onClick={onLoadMoreClick}
            style={{ border: "1px solid black", padding: "1rem" }}
          >
            더보기
          </button>
        </div>
      )}
    </div>
  );
}

export default MessagesLists;
