import React, { useState, useEffect } from "react";
import "./ChatPage.css"
import userThumbnail from "../../assets/images/img_user-thumbnail.png";
import HamburgerButton from "../../common/components/HamburgerButton";
import LeftPanel from "./LeftSections/LeftPanel";
import RightPanel from "./RightSections/RightPanel";

function ChatPage() {

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
        <div class="contents-wrap-chat">
            <LeftPanel />
            <RightPanel />
        </div>
    )
}

export default ChatPage
