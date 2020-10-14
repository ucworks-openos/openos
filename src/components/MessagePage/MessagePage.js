import React, { useEffect } from "react";
import "./MessagePage.css";
import LeftPanel from "./LeftSections/LeftPanel";
import RightPanel from "./RightSections/RightPanel";
import { useDispatch, useSelector } from 'react-redux';
import {
    addMessage,
    getInitialMessageLists,
    setCurrentMessageListsType
} from "../../redux/actions/message_actions";
import {
    getLogginedInUserInfo
} from "../../redux/actions/user_actions";
import { writeLog } from "../../common/ipcCommunication/ipcCommon";

const electron = window.require("electron");

function MessagePage(props) {
    const dispatch = useDispatch();
    const currentMessageListType = useSelector(state => state.messages.currentMessageListType)
    const selectMsgType = useSelector(state => state.messages.selectMsgType)
    
    const msgType = props.match.params["msgType"];

    useEffect(() => {
        let initType = 'MSG_RECV';

        if (msgType) initType = msgType;

        dispatch(setCurrentMessageListsType(initType))
        dispatch(getLogginedInUserInfo(sessionStorage.getItem("loginId")))

        electron.ipcRenderer.once('notiTitleClick', (event, noti) => {
            writeLog('notiTitleClick OnMessagePage', noti[0])
            if (noti[0].notiType === 'NOTI_MESSAGE') {
                dispatch(setCurrentMessageListsType('MSG_RECV'));
            }
        });
    }, []);

    useEffect(() => {
        dispatch(getInitialMessageLists(currentMessageListType ? currentMessageListType : 'MSG_RECV'))
        sessionStorage.setItem('currentMessageListType', currentMessageListType)
    }, [currentMessageListType]);

    return (
        <div className="contents-wrap-chat">
            <LeftPanel />
            <RightPanel />
        </div>
    )
}

export default MessagePage
