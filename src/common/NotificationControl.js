import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { showChatNoti } from "./ipcCommunication/ipcMessage";
import {
    addReceivedChat
} from "../redux/actions/chat_actions";
import { writeLog } from "./ipcCommunication/ipcCommon";
import { addMessage, setCurrentMessageListsType } from "../redux/actions/message_actions";

const electron = window.require("electron");

function NotificationControl() {

    const dispatch = useDispatch();
   
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


    //알림 수신처리
    useEffect(() => {

        // 대화 메세지 수신
        electron.ipcRenderer.removeAllListeners('chatReceived');
        electron.ipcRenderer.on('chatReceived', (event, chatData) => {

            console.log('------ chatReceived', chatData);
            let chat = chatData[0];

            // 본인이 보낸 메세지는 무시한다.
            if (chat.sendId === sessionStorage.getItem('loginId')) return;

            
            //채팅을 시작할 때 알림 1번, 채팅을 보낼 때 알림 1번, 두개를 나눠준다.
            //그래서 첫 알림은 무시해주기 
            let divideChatData = chat.chatData.split("|")
            if (divideChatData.length > 1) return;

            //받은 메시지 화면에 반영해주기
            writeLog('------ chatReceived', sessionStorage.getItem('chatRoomKey'), chat)

            //if (sessionStorage.getItem('chatRoomKey')) { dispatch(addReceivedChat(chat)) };
            dispatch(addReceivedChat(chat))

            console.log('selected chatRoom', sessionStorage.getItem('chatRoomKey'))
            // 내가 대화 room_key에 해당하지 않는 페이지에 있을 때만 알림 받기
            if (!sessionStorage.getItem('chatRoomKey') || chat.roomKey !== sessionStorage.getItem('chatRoomKey')) {
                //알림 받기
                showChatNoti(chat);
            }
        });  

        // 쪽지 수신
        // 현재 선택된 쪽지 탭 유형을 확인하고, 쪽지 목록화면에 추가해야 함으로 쪽지 컨트롤에서 처리
        electron.ipcRenderer.removeAllListeners('messageReceived');
        electron.ipcRenderer.on('messageReceived', (event, msgData) => {
            let currentMessageListType = sessionStorage.getItem('currentMessageListType');
            let msg = msgData[0];

            let isSendMsg = msg.sendId === sessionStorage.getItem('loginId');

            writeLog('messageReceived', isSendMsg, currentMessageListType);

            // 내가 보고있는 함에 맞는 메세지가 오면 추가.
            if ((isSendMsg && currentMessageListType === 'MSG_SEND') ||
                (!isSendMsg && currentMessageListType === 'MSG_RECV')) {
                dispatch(
                    addMessage(msg.key, 
                        msg.destIds, 
                        msg.destName, 
                        msg.subject,
                        msg.message.trim().length === 0 ? `<p>${msg.subject}</>` : msg.message, 
                        msg.sendName))
            } 
        });
    }, [])
    

    // 알림창 선택
    useEffect(() => {

        // 2중 등록 방지
        electron.ipcRenderer.removeAllListeners('notiTitleClick');
        electron.ipcRenderer.on('notiTitleClick', (event, noti) => {

            writeLog('notiTitleClick', noti);

            switch(noti[0].notiType) {
                case 'NOTI_MESSAGE':
                    window.location.hash = `#/message`;
                    break;
                case 'NOTI_CHAT':
                    writeLog('chat noti click!--');
                    window.location.hash = `#/chat/${noti[0].notiId}`;
                    
                    // // let notiType = sentInfo[0]
                    // let message = sentInfo[3]
                    // let roomKey = sentInfo[1]
                    // let allMembers = sentInfo[2]
                    // if (window.location.hash.split("/")[1] !== "chat") {
                    //     writeLog('notiTitleClick--');
                    //     window.location.hash = `#/chat/${roomKey}/${allMembers}/${message}`;
                    // }
                    break;
                default:
                    writeLog('Unknown Noti Title Click', noti[0])
                    return;

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
