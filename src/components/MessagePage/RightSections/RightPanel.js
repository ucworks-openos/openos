import React, { useState } from 'react'
import HamburgerButton from "../../../common/components/HamburgerButton";
import MessageInput from "./MessageInput";
import MessagePanel from "./MessagePanel";

function RightPanel() {
    const [isHamburgerButtonClicked, setIsHamburgerButtonClicked] = useState(false);
    const [isEditGroupTabOpen, setIsEditGroupTabOpen] = useState(false);

    const clickHamburgerButton = () => {
        setIsHamburgerButtonClicked(!isHamburgerButtonClicked);
    };

    const EditGroupTabOpen = () => {
        setIsHamburgerButtonClicked(false);
        setIsEditGroupTabOpen(true);
    };

    return (
        <main className="chat-main-wrap">
            <div className="chat-title-wrap">
                <div className="btn-chat-ppl-info">
                    5
            </div>
                <h4 className="chat-name">tf팀</h4>
                <div className="chat-local-search-wrap">
                    <input type="text" className="chat-local-search" placeholder="대화 검색" />
                </div>
                <div className="chat-action-wrap">
                    <div className="chat-action drawer" title="모아보기"></div>
                    <div className="chat-action voice-talk" title="보이스톡"></div>
                    <div className="chat-action face-talk" title="페이스톡"></div>
                    <div className="chat-action chat-favorite-toggle" title="즐겨찾기">
                        <input type="checkbox" id="chat-favorite-toggle-check" />
                        <label className="chat-favorite-toggle-inner" for="chat-favorite-toggle-check" title="즐겨찾기"></label>
                    </div>
                    <div className="chat-action chat-noti-toggle" title="대화방 알림">
                        <input type="checkbox" id="chat-noti-toggle-check" />
                        <label className="chat-noti-toggle-inner" for="chat-noti-toggle-check" title="대화방 알림"></label>
                    </div>
                </div>
                <div className="lnb" title="더보기">
                    <HamburgerButton
                        active={isHamburgerButtonClicked}
                        clicked={isHamburgerButtonClicked}
                        propsFunction={clickHamburgerButton}
                    />
                    <ul className={isHamburgerButtonClicked ? "lnb-menu-wrap" : "lnb-menu-wrap-hide"}>
                        <li className="lnb-menu-item"><h6>대화상대 초대</h6></li>
                        <li className="lnb-menu-item"><h6>대화방 설정</h6></li>
                        <li className="lnb-menu-item"><h6>현재 대화 화면 캡처</h6></li>
                        <li className="lnb-menu-item"><h6>대화 저장</h6></li>
                        <li className="lnb-menu-item"><h6>대화내용 모두 삭제</h6></li>
                        <li className="lnb-menu-item"><h6>대화방 삭제</h6></li>
                    </ul>
                </div>
            </div>
            <MessagePanel />
            <MessageInput />
        </main>
    )
}

export default RightPanel
