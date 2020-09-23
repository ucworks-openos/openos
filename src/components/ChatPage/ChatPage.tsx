import React, { useState, useEffect } from "react";
import "./ChatPage.css"
import LeftPanel from "./LeftSections/LeftPanel";
import RightPanel from "./RightSections/RightPanel";
import { useDispatch } from 'react-redux';
import {
    getInitialChatRooms,
} from "../../redux/actions/chat_actions";
import {
    getLogginedInUserInfo
} from "../../redux/actions/user_actions";

function ChatPage() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getInitialChatRooms())
        dispatch(getLogginedInUserInfo(sessionStorage.getItem("loginId")))
    }, [])

    return (
        <div className="contents-wrap-chat">
            <LeftPanel />
            <RightPanel />
        </div>
    )
}

export default ChatPage
