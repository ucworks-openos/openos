import React, { useState, useEffect } from "react";
import HamburgerButton from "../../../common/components/HamburgerButton";
import ChatInput from "./ChatInput";
import ChatPanel from "../LeftSections/ChatPanel";
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
        <main class="chat-main-wrap">
            <div class="chat-title-wrap">
                <div class="btn-chat-ppl-info">
                    5
                </div>
                <h4 class="chat-name">tf팀</h4>
                <div class="chat-local-search-wrap">
                    <input type="text" class="chat-local-search" placeholder="대화 검색" />
                </div>
                <div class="chat-action-wrap">
                    <div class="chat-action drawer" title="모아보기"></div>
                    <div class="chat-action voice-talk" title="보이스톡"></div>
                    <div class="chat-action face-talk" title="페이스톡"></div>
                    <div class="chat-action chat-favorite-toggle" title="즐겨찾기">
                        <input type="checkbox" id="chat-favorite-toggle-check" />
                        <label class="chat-favorite-toggle-inner" for="chat-favorite-toggle-check" title="즐겨찾기"></label>
                    </div>
                    <div class="chat-action chat-noti-toggle" title="대화방 알림">
                        <input type="checkbox" id="chat-noti-toggle-check" />
                        <label class="chat-noti-toggle-inner" for="chat-noti-toggle-check" title="대화방 알림"></label>
                    </div>
                </div>
                <div class="lnb" title="더보기">
                    <HamburgerButton
                        active={isHamburgerButtonClicked}
                        clicked={isHamburgerButtonClicked}
                        propsFunction={clickHamburgerButton}
                    />
                    <ul className={isHamburgerButtonClicked ? "lnb-menu-wrap" : "lnb-menu-wrap-hide"}>
                        <li class="lnb-menu-item"><h6>대화상대 초대</h6></li>
                        <li class="lnb-menu-item"><h6>대화방 설정</h6></li>
                        <li class="lnb-menu-item"><h6>현재 대화 화면 캡처</h6></li>
                        <li class="lnb-menu-item"><h6>대화 저장</h6></li>
                        <li class="lnb-menu-item"><h6>대화내용 모두 삭제</h6></li>
                        <li class="lnb-menu-item"><h6>대화방 삭제</h6></li>
                    </ul>
                </div>
            </div>
            <ChatPanel />
            <ChatInput />
        </main>
    )
}

export default RightPanel
