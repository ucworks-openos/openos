import React, { useState, useEffect } from "react";
import "./ChatPage.css"
import LeftPanel from "./LeftSections/LeftPanel";
import RightPanel from "./RightSections/RightPanel";
import { useDispatch } from 'react-redux';
import {
    getLogginedInUserInfo
} from "../../redux/actions/user_actions";
import {
    addReceivedChat
} from "../../redux/actions/chat_actions";

const electron = window.require("electron")

function ChatPage() {
    const dispatch = useDispatch();

    useEffect(() => {
        electron.ipcRenderer.on('chatReceived', (event, chatMsg) => {
            let divideChatData = chatMsg[0].chatData.split("|")
            if (divideChatData.length > 1) {
                return null;
            } else {
                dispatch(addReceivedChat(chatMsg[0]));
            }
        });

        electron.ipcRenderer.on('notiTitleClick', (notiType, roomKey) => {
            console.log('notiType', notiType, 'notyId', roomKey)
        });

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
