import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import MemberTooltip from '../../../common/components/Tooltip/MemberTooltip';

function MessageInfo() {
    const content = useSelector(state => state.messages.message)
    const [isOpenTooltip, setIsOpenTooltip] = useState(false)
    const renderRecvNames = content.msg_recv_name.split('|')[0]
    const RecvCounts = content.msg_recv_name.split('|').length

    const toggleTooltip = () => {
        setIsOpenTooltip(prev => !prev)
    }

    return (
        <div className="message-info-area">
            <div className="message-info label from-label-ppl">발신인</div>
            <div className="message-info from-ppl-name">  {content.msg_send_name}</div>
            <div className="message-info label from-label date">발신일시</div>
            <div className="message-info from-date">
                {moment(content.msg_send_date, "YYYYMMDDHHmm").format("YYYY년 M월 D일 H시 m분")}
            </div>
            <div className="message-info label to-label-ppl">수신인</div>
            <div className="message-info to-ppl-name" onClick={toggleTooltip}>
                {renderRecvNames} {RecvCounts > 1 && `외 ${RecvCounts}명`}
                <div>
                    {isOpenTooltip && <MemberTooltip userIds={content.msg_recv_ids} RecvCounts={RecvCounts} />}
                </div>
            </div>
            {/* <div className="message-info label to-label-date">수신일시</div>
            <div className="message-info to-date">2020-08-23(일) 오전 11:00</div> */}
            {/* <div className="message-info label reference-label-ppl">참조</div>
            <div className="message-info reference-ppl-name">김철수 팀장(개발팀) 외 2</div> */}
        </div >
    )
}

export default MessageInfo
