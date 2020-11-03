import React, { useEffect, useState } from "react";
import "../../assets/css/Modal.css";
import useTree from "../../hooks/useTree";
import { syncronize } from "../../common/util";
import { changeChatRoomName } from "../../common/ipcCommunication/ipcMessage";
import { writeError } from "../../common/ipcCommunication/ipcLogger";
import { forwardCall, transferCall } from "../../common/ipcCommunication/ipcIpPhone";

type CallForwardingProp = {
  closeModalFunction: () => void;
};

export default function CallForwardingModal(props:CallForwardingProp) {

  const {closeModalFunction}  = props;
  const [forwardNum, setForwardNum] = useState('');

  const onCloseModalClick = () => {
    closeModalFunction();
  };

  const onSubmitClick = async (act:boolean) => {
    if (act && !forwardNum) return; 
    forwardCall(act, forwardNum);
    //transferCall('3646', forwardNum);
  };

  return (
    <div>
      <h5>착신 전환</h5>
      <input
        value={forwardNum}
        onChange={(e) => {
          const re = /^[0-9\b]+$/;
          if (e.target.value == '' || re.test(e.target.value)) {
            setForwardNum(e.target.value)
          }
        }}
        className="get-favorite-group-name"
        placeholder="착신전환 번호를 입력하세요."
      />
      <div className="modal-btn-wrap">
        <div className="btn-solid-s submit" onClick={()=>{onSubmitClick(true)}}>
          설정하기
        </div>&nbsp;&nbsp;
        <div className="btn-solid-s submit" onClick={()=>{onSubmitClick(false)}}>
          해제하기
        </div>&nbsp;&nbsp;
        <div className="btn-ghost-s cancel" onClick={onCloseModalClick}>
          취소하기
        </div>
      </div>
    </div>
  );
}
