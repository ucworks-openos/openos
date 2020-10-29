import React, { useEffect, useState } from "react";
import "../../assets/css/Modal.css";
import useTree from "../../hooks/useTree";
import { syncronize } from "../../common/util";
import { changeChatRoomName } from "../../common/ipcCommunication/ipcMessage";

type ChangeRoomNameProp = {
  closeModalFunction: () => void;
  chatRoomKey: string;
  asIsRoomName: string;
  chatUserIds: Array<String>
};

export default function ChangeChatRoomModal(props: ChangeRoomNameProp) {
  const { closeModalFunction, chatRoomKey, asIsRoomName, chatUserIds } = props;
  const [chatRoomName, setChatRoomName] = useState(asIsRoomName);

  const onCloseModalClick = () => {
    closeModalFunction();
  };

  const onSubmitClick = async () => {
    changeChatRoomName(chatRoomKey, chatRoomName, chatUserIds)
    closeModalFunction();
  };

  return (
    <div>
      <h5>대화방 이름 설정</h5>
      <input
        value={chatRoomName}
        onChange={(e) => setChatRoomName(e.currentTarget.value)}
        className="get-favorite-group-name"
        placeholder="대화방 이름을 입력해 주세요"
      />
      <div className="modal-btn-wrap">
        <div className="btn-ghost-s cancel" onClick={onCloseModalClick}>
          취소하기
        </div>
        <div className="btn-solid-s submit" onClick={onSubmitClick}>
          수정하기
        </div>
      </div>
    </div>
  );
}
