import React, { useState, useEffect } from "react";
import "./ChatPage.css"
import LeftPanel from "./LeftSections/LeftPanel";
import RightPanel from "./RightSections/RightPanel";
import { useDispatch } from 'react-redux';
import {
    getInitialChatRooms,
} from "../../redux/actions/chat_actions";

function ChatPage() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getInitialChatRooms())
    }, [])

    return (
        <div className="contents-wrap-chat">
            <LeftPanel />
            <RightPanel />
        </div>
    )
}

export default ChatPage
