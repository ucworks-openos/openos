import React, { useEffect, useState } from "react";
import "../../assets/css/Modal.css";
import useTree from "../../hooks/useTree";
import { syncronize } from "../../common/util";

type ChangeRoomNameProp = {
  closeModalFunction: () => void;
  chatRoomChangeCompleted: () => void;
  chatRoomKey: string;
  asIsRoomName: string;
};

export default function ChangeChatRoomModal(props: ChangeRoomNameProp) {
  const { closeModalFunction, chatRoomKey, asIsRoomName } = props;
  const [chatRoomName, setChatRoomName] = useState(asIsRoomName);

  useEffect(() => {
  
  }, []);

  const onCloseModalClick = () => {
    closeModalFunction();
  };

  const onSubmitClick = async () => {
    closeModalFunction();
  };

  return (
    <div>
      <h5>즐겨찾기 그룹 수정</h5>
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
