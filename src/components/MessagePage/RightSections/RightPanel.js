import React, { useState } from "react";
import MessageContent from "./MessageContent";
import { useDispatch, useSelector } from "react-redux";
import MessageFiles from "./MessageFiles";
function RightPanel() {
  const message = useSelector((state) => state.messages.message);
  return (
    <main className="message-main-wrap">
      <div className="message-title-wrap">
        <h4 className="message-title-single">{message && message.msg_subject}</h4>
        <div className="message-action-wrap">
          <div className="message-action reply" title="답장"></div>
          <div className="message-action reply-all" title="전체답장"></div>
          <div className="message-action foward" title="전달"></div>
          <div className="message-action write-new" title="새쪽지쓰기"></div>
          <div className="message-action go-to-chat" title="채팅"></div>
          <div className="message-action download" title="다운로드"></div>
          <div className="message-action print" title="인쇄"></div>
          <div className="message-action remove" title="삭제"></div>
        </div>
      </div>

      <MessageContent />

      <MessageFiles />
    </main>
  );
}

export default RightPanel;
