import React, { useState, useEffect } from "react";
import "./ChatPage.css"
import LeftPanel from "./LeftSections/LeftPanel";
import RightPanel from "./RightSections/RightPanel";
import { useDispatch } from 'react-redux';
import {
    getLogginedInUserInfo
} from "../../redux/actions/user_actions";
import {
    moveToClickedChatRoom
} from '../../redux/actions/chat_actions';
import moment from 'moment';

function ChatPage(props) {
    const dispatch = useDispatch();
    const roomKey = props.match.params["roomKey"];
    const members = props.match.params["members"];
    const message = props.match.params["message"];

    useEffect(() => {
        dispatch(getLogginedInUserInfo(sessionStorage.getItem("loginId")))
        if (roomKey) {
            let selectedUsers = members.split("|")
            const chatRoomBody = {
                selected_users: selectedUsers,
                user_counts: selectedUsers.length,
                chat_entry_ids: members,
                unread_count: 0,
                room_key: roomKey,
                chat_contents: message ? message : "",
                chat_send_name: sessionStorage.getItem("loginName"),
                create_room_date: moment().format("YYYYMMDDHHmm"),
                chat_send_id: sessionStorage.getItem("loginId"),
                last_line_key: '9999999999999999'
            }
            dispatch(moveToClickedChatRoom(chatRoomBody));
        }

    }, [roomKey])

    return (
        <div className="contents-wrap-chat">
            <LeftPanel />
            <RightPanel />
        </div>
    )
}

export default ChatPage
