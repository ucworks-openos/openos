import React, { useEffect } from "react";
import "./MessagePage.css";
import LeftPanel from "./LeftSections/LeftPanel";
import RightPanel from "./RightSections/RightPanel";
import { useDispatch, useSelector } from 'react-redux';
import {
    getInitialMessageLists,
    setCurrentMessageListsType
} from "../../redux/actions/message_actions";
import {
    getLogginedInUserInfo
} from "../../redux/actions/user_actions";

function MessagePage() {
    const dispatch = useDispatch();
    const currentMessageListType = useSelector(state => state.messages.currentMessageListType)
    useEffect(() => {
        dispatch(setCurrentMessageListsType('MSG_RECV'))
        dispatch(getLogginedInUserInfo(sessionStorage.getItem("loginId")))
    }, [])
    useEffect(() => {
        dispatch(getInitialMessageLists(currentMessageListType ? currentMessageListType : 'MSG_RECV'))
    }, [currentMessageListType])

    return (
        <div className="contents-wrap-chat">
            <LeftPanel />
            <RightPanel />
        </div>
    )
}

export default MessagePage
