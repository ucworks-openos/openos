import React, { useState } from "react";
import MessageContent from "./MessageContent";
import { useDispatch, useSelector } from "react-redux";

function RightPanel() {
  const message = useSelector((state) => state.messages.message);

  return (
    <main className="message-main-wrap">
      <div class="message-title-wrap">
        <h4 class="message-title-single">{message && message.msg_subject}</h4>
        <div class="message-action-wrap">
          <div class="message-action reply" title="답장"></div>
          <div class="message-action reply-all" title="전체답장"></div>
          <div class="message-action foward" title="전달"></div>
          <div class="message-action write-new" title="새쪽지쓰기"></div>
          <div class="message-action go-to-chat" title="채팅"></div>
          <div class="message-action download" title="다운로드"></div>
          <div class="message-action print" title="인쇄"></div>
          <div class="message-action remove" title="삭제"></div>
        </div>
      </div>

      <MessageContent />
    </main>
  );
}

export default RightPanel;
