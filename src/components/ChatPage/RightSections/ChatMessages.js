import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInitialChatMessages } from "../../../redux/actions/chat_actions";
import moment from "moment";

function ChatMessages() {
  const dispatch = useDispatch();
  const chatMessages = useSelector((state) => state.chats.chatMessages);
  const currentChatRoom = useSelector((state) => state.chats.currentChatRoom);
  // const [chatMessagesWithUserInfos, setChatMessagesWithUserInfos] = useState([])
  const messagesEndRef = useRef();

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      scrollToBottom();
    }
  }, [messagesEndRef, chatMessages]);

  useEffect(() => {
    if (currentChatRoom) {
      //새로 만든 채팅방(전 데이터가 데이테베이스에 없는)은 아직 데이터베이스에서 없기 때문에
      //데이터 베이스에서 메시지를 가져오면 안됨.
      //근데  채팅을 몇번 하고 난 후에 다시 들어올때도  last_line_key가  undefined이기에 ...
      //채팅 리스트들을 없앤다 .. 어떻게 해야 하나 ...?
      dispatch(
        getInitialChatMessages(
          currentChatRoom.room_key,
          currentChatRoom.last_line_key
        )
      );
    }
  }, [currentChatRoom]);

  const renderChatMessages = () =>
    chatMessages &&
    chatMessages.map((chat, index) => {
      /**
       * 이모티콘 정보는 fontName에 있으며 chatData(contents)도 포함되는 경우도 있다. (chatData: 'bslee|kitt1' : 참여자 아이디가 들어 있음)
       *   fontName: 'EMOTICON \r tab_02 \r 3.gif\r맑은 고딕 Semilight'
       */

      let hasMessage = true;
      let hasEmoticon = chat.chat_font_name.startsWith("EMOTICON");
      let emoName = "";
      let emoTab = "";
      if (hasEmoticon) {
        let emotiInfo = chat.chat_font_name.split(
          String.fromCharCode(parseInt(13))
        );
        emoTab = emotiInfo[1];
        emoName = emotiInfo[2];
        hasMessage =
          chat.chat_contents?.trim().length > 0 &&
          chat.chat_contents !== chat.chat_entry_ids;
      }

      let emoticon;
      let message;

      const contents =
        chat.chat_type === `U`
          ? chat.chat_contents
          : chat.chat_contents.split(`|`)[0];

      if (chat.chat_send_id === `${sessionStorage.getItem("loginId")}`) {
        if (hasEmoticon) {
          emoticon = (
            <div key={index} className="speech-row speech-my">
              <div className="speach-content-wrap">
                <div className="speech-inner-wrap">
                  <img
                    src={`./Emoticons/${emoTab}/${emoName}`}
                    style={{ width: 110, height: 110 }}
                    alt={`./Emoticons/${emoTab}/${emoName}`}
                    loading="lazy"
                  />
                  <div className="speech-info">
                    <span className="unread-ppl">{chat.read_count}</span>
                    <span className="time">
                      {" "}
                      {moment(chat.chat_send_date, "YYYYMMDDHHmm").format(
                        "HH:mm"
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        if (hasMessage) {
          message = (
            <div key={index} className="speech-row speech-my">
              <div className="speach-content-wrap">
                <div className="speech-inner-wrap">
                  <div className="speech-content">
                    <pre>{contents}</pre>
                  </div>
                  <div className="speech-info">
                    <span className="unread-ppl">{chat.read_count}</span>
                    <span className="time">
                      {" "}
                      {moment(chat.chat_send_date, "YYYYMMDDHHmm").format(
                        "HH:mm"
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        }
      } else {
        if (hasEmoticon) {
          emoticon = (
            <div className="speech-row speech-others" key={`${index}_emo`}>
              <div className="user-pic-wrap">
                <img
                  src={
                    chat.user_picture_pos &&
                    /^http/.test(chat.user_picture_pos.value)
                      ? chat.user_picture_pos.value
                      : "./images/img_imgHolder.png"
                  }
                  alt="user-profile-picture"
                />
              </div>
              <div className="speach-content-wrap">
                <div className="speaker-info-wrap">{chat.chat_send_name}</div>
                <div className="speech-inner-wrap">
                  <img
                    src={`./Emoticons/${emoTab}/${emoName}`}
                    style={{ width: 110, height: 110 }}
                    alt={`./Emoticons/${emoTab}/${emoName}`}
                    loading="lazy"
                  />
                  <div className="speech-info">
                    <span className="unread-ppl read-all">
                      {chat.read_count}
                    </span>
                    <span className="time">
                      {moment(chat.chat_send_date, "YYYYMMDDHHmm").format(
                        "HH:mm"
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        if (hasMessage) {
          message = (
            <div className="speech-row speech-others" key={index}>
              <div className="user-pic-wrap">
                <img
                  src={
                    chat.user_picture_pos &&
                    /^http/.test(chat.user_picture_pos.value)
                      ? chat.user_picture_pos.value
                      : "./images/img_imgHolder.png"
                  }
                  alt="user-profile-picture"
                />
              </div>
              <div className="speach-content-wrap">
                <div className="speaker-info-wrap">{chat.chat_send_name}</div>
                <div className="speech-inner-wrap">
                  <div className="speech-content">{contents}</div>
                  <div className="speech-info">
                    <span className="unread-ppl read-all">
                      {chat.read_count}
                    </span>
                    <span className="time">
                      {moment(chat.chat_send_date, "YYYYMMDDHHmm").format(
                        "HH:mm"
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        }
      }

      return (
        <div>
          {emoticon}
          {message}
        </div>
      );
    });

  if (chatMessages) {
    return (
      <div className="chat-area">
        {renderChatMessages()}
        <div ref={messagesEndRef} />
      </div>
    );
  } else {
    return <div className="chat-area"></div>;
  }
}

export default ChatMessages;
