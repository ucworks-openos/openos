import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import MemberTooltip from "../../../common/components/Tooltip/MemberTooltip";
import styled from "styled-components";

function MessageInfo(prop) {
  const [isOpenTooltip, setIsOpenTooltip] = useState(false);
  const renderRecvNames = prop.message?.msg_recv_name.split(",")[0];
  const RecvCounts = prop.message?.msg_recv_name.split(",").length;

  const toggleTooltip = () => {
    prop.message?.msg_res_gubun !== `5` && setIsOpenTooltip((prev) => !prev);
  };

  const closeTooltip = () => {
    setIsOpenTooltip(false);
  };

  return (
    <div className="message-info-area">
      <div className="message-info label from-label-ppl">발신인</div>
      <div className="message-info from-ppl-name"> {prop.message?.msg_send_name}</div>
      <div className="message-info label from-label date">발신일시</div>
      <div className="message-info from-date">
        {moment(prop.message?.msg_send_date, "YYYYMMDDHHmm").format(
          "YYYY년 M월 D일 H시 m분"
        )}
      </div>
      <div className="message-info label to-label-ppl">수신인</div>
      <div
        className="message-info to-ppl-name"
        onClick={toggleTooltip}
        onBlur={closeTooltip}
        tabIndex={1}
      >
        {renderRecvNames} {RecvCounts > 1 && `외 ${RecvCounts - 1}명`}
        {isOpenTooltip && (
          <MemberTooltipWrapper>
            <MemberTooltip userIds={prop.message?.msg_recv_ids} type="message" />
          </MemberTooltipWrapper>
        )}
      </div>
      {/* <div className="message-info label to-label-date">수신일시</div>
            <div className="message-info to-date">2020-08-23(일) 오전 11:00</div> */}
      {/* <div className="message-info label reference-label-ppl">참조</div>
            <div className="message-info reference-ppl-name">김철수 팀장(개발팀) 외 2</div> */}
    </div>
  );
}

const MemberTooltipWrapper = styled.div`
  position: absolute;
  top: 25px;
  left: -40px;
`;

export default MessageInfo;
