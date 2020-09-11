import React, { useEffect } from "react";
import "./MessagePage.css";
import LeftPanel from "./LeftSections/LeftPanel";
import RightPanel from "./RightSections/RightPanel";
import { useDispatch } from 'react-redux';
import {
    getInitialMessageLists,
} from "../../redux/actions/message_actions";

function MessagePage() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getInitialMessageLists())
    }, [])

    return (
        <div className="contents-wrap-chat">
            <LeftPanel />
            <RightPanel />
        </div>
    )
}

export default MessagePage
