import React, { useState, useEffect } from "react";
import "./ChatPage.css"
import LeftPanel from "./LeftSections/LeftPanel";
import RightPanel from "./RightSections/RightPanel";
import { useDispatch } from 'react-redux';
import {
    getInitialChatMessages,
    getInitialChatRooms,
    setCurrentChatRoom
} from "../../redux/actions/chat_actions";

function ChatPage() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getInitialChatRooms())
        dispatch(getInitialChatMessages())
    }, [])

    return (
        <div class="contents-wrap-chat">
            <LeftPanel />
            <RightPanel />
        </div>
    )
}

export default ChatPage
