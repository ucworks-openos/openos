import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { showChatNoti } from "./ipcCommunication/ipcMessage";
import {
    addReceivedChat
} from "../redux/actions/chat_actions";
import { writeLog } from "./ipcCommunication/ipcCommon";

const electron = window.require("electron");

function NotificationControl() {

    const dispatch = useDispatch();

    //
    //#region Chat Norification ...

    // 선택한 대화방 정보를 가지고 있는다.
    const currentChatRoom = useSelector(state => state.chats.currentChatRoom)
    // 선택한 대화방 처리
    useEffect(() => {
        //이렇게 해주지 않으면 채팅방 들어간 후에 다른 탭으로 넘어간 후 알림을 보내도 알림이 오지 않음.
        if (currentChatRoom && window.location.hash.split("/")[1] === "chat") {
            sessionStorage.setItem('chatRoomKey', currentChatRoom.room_key)
        } else {
            sessionStorage.setItem('chatRoomKey', "")
        }
    }, [currentChatRoom, window.location.hash])

    //대화 알림 수신처리
    useEffect(() => {
        electron.ipcRenderer.on('chatReceived', (event, chatMsg) => {

            console.log('------ chatReceived', chatMsg);
            let chat = chatMsg[0];

            // 본인이 보낸 메세지는 무시한다.
            if (chat.sendId === sessionStorage.getItem('loginId')) return;

            
            //채팅을 시작할 때 알림 1번, 채팅을 보낼 때 알림 1번, 두개를 나눠준다.
            //그래서 첫 알림은 무시해주기 
            let divideChatData = chat.chatData.split("|")
            if (divideChatData.length > 1) return;

            //받은 메시지 화면에 반영해주기
            if (sessionStorage.getItem('chatRoomKey')) { dispatch(addReceivedChat(chat)) };

            console.log('selected chatRoom', sessionStorage.getItem('chatRoomKey'))
            // 내가 대화 room_key에 해당하지 않는 페이지에 있을 때만 알림 받기
            if (!sessionStorage.getItem('chatRoomKey') || chat.roomKey !== sessionStorage.getItem('chatRoomKey')) {
                //알림 받기
                showChatNoti(chat);
            }
            
        });
    }, [])
    //#endregion  Chat Norification ...

    // 알림창 선택
    useEffect(() => {

        writeLog('NotiContronLoad-----------');
        electron.ipcRenderer.on('notiTitleClick!', (event, sentInfo) => {

            writeLog('notiTitleClick', sentInfo);
            return;


            // let notiType = sentInfo[0]
            let message = sentInfo[3]
            let roomKey = sentInfo[1]
            let allMembers = sentInfo[2]
            if (window.location.hash.split("/")[1] !== "chat") {
                window.location.hash = `#/chat/${roomKey}/${allMembers}/${message}`;
            }
        });
    }, [])

    return (
        <div></div>
    )
}



export default NotificationControl

// let roomKey;
// // SelectedUsers = ["jeen8337","inkyung"]
// if (SelectedUsers.length === 2) {
//     roomKey = SelectedUsers.sort().join("|")
// } else {
//     roomKey = LoggedInUserId + "_" + getUUID()
// }



// window.location.hash = `#/chat/${roomKey}/${allMembers}`;
