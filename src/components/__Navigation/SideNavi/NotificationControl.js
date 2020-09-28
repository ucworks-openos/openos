import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import {
    addReceivedChat
} from "../../../redux/actions/chat_actions";

const electron = window.require("electron")
const { remote } = window.require("electron")
const { BrowserWindow, app, screen } = remote
let notiWin;

async function getDispSize() {

    await app.whenReady();
    let displays = screen.getAllDisplays()

    let x = 0;
    let y = 0;
    displays.forEach((disp) => {
        if (disp.bounds.x === 0 && disp.bounds.y === 0) {
            // main disp
            x += disp.workArea.width;
            y += disp.workArea.height;
        } else {
            // external disp
            if (disp.bounds.x > 0) {
                x += disp.workArea.width;
            }
            if (disp.bounds.y > 0) {
                y += disp.workArea.height;
            }
        }
    })

    return { width: x, height: y }
}

async function showAlert(notiType, notiId, title, message, sendName, allMembers) {
    console.log('notiTYpe', notiType, notiId, title, message, allMembers)
    if (notiWin) {
        notiWin.destroy();
    }

    // 확장 포함한 전제 스크린사이즈
    let dispSize = await getDispSize();

    notiWin = new BrowserWindow({
        x: dispSize.width - 300, y: dispSize.height - 200,
        width: 375, height: 155,
        backgroundColor: '#11378D',
        margin: 0,
        modal: true,
        resizable: false,
        focusable: false, // 포커스를 가져가 버리는데
        fullscreenable: false,
        frame: false,     // 프레임 없어짐, 타이틀바 포함  titleBarStyle: hidden
        thickFrame: true, // 그림자와 창 애니메이션
        webPreferences: {
            nodeIntegration: true, // is default value after Electron v5
        }
    })
    //notiWin.webContents.openDevTools();
    notiWin.menuBarVisible = false;

    let notifyFile = `${window.location.origin}/notify.html`;
    // console.log(`>>>>>>>>>>>  `, notifyFile);
    notiWin.webContents.on('did-finish-load', () => {
        // console.log(`>>>>>>>>>>>   LOAD COMPLETED!`);
        notiWin.webContents.executeJavaScript(`
          document.getElementById("notiType").value = '${notiType}';
          document.getElementById("notiId").value = '${notiId}';
          document.getElementById("title").innerHTML += '${title}';
          document.getElementById("msg").innerHTML += '${message}';
          document.getElementById("allMembers").value += '${allMembers}';
          document.getElementById("sendName").innerHTML += '${sendName}';
          document.getElementById("message").value += '${message}';
          `);
    })
    notiWin.loadURL(notifyFile)
}


function NotificationControl() {
    const dispatch = useDispatch();
    const currentChatRoom = useSelector(state => state.chats.currentChatRoom)
    // console.log('currentChatRoom', currentChatRoom)
    useEffect(() => {
        //이렇게 해주지 않으면 채팅방 들어간 후에 다른 탭으로 넘어간 후 알림을 보내도 알림이 오지 않음.
        if (currentChatRoom && window.location.hash.split("/")[1] === "chat") {
            sessionStorage.setItem('chatRoomKey', currentChatRoom.room_key)
        } else {
            sessionStorage.setItem('chatRoomKey', "")
        }
    }, [currentChatRoom, window.location.hash])

    //알림 Initiator 
    useEffect(() => {
        electron.ipcRenderer.on('chatReceived', (event, chatMsg) => {
            //채팅을 시작할 때 알림 1번, 채팅을 보낼 때 알림 1번, 두개를 나눠준다.
            //그래서 첫 알림은 무시해주기 
            let divideChatData = chatMsg[0].chatData.split("|")
            if (divideChatData.length > 1) return;
            //받은 메시지 화면에 반영해주기
            if (sessionStorage.getItem('chatRoomKey')) { dispatch(addReceivedChat(chatMsg[0])) };
            //먼저 이게 나에게 온 알림인지 체크
            let isAlarmMine = !!chatMsg[0].destId.split("|").filter(user => user !== chatMsg[0].sendId).find(filteredUserId => filteredUserId === sessionStorage.getItem('loginId'))

            if (!isAlarmMine) return;
            // 내가 대화 room_key에 해당하지 않는 페이지에 있을 때만 알림 받기
            if (sessionStorage.getItem('chatRoomKey') && chatMsg[0].roomKey === sessionStorage.getItem('chatRoomKey')) return;
            //알림 받기
            showAlert('NOTI_CHAT',
                chatMsg[0].roomKey,
                '채팅',
                chatMsg[0].chatData,
                chatMsg[0].sendName,
                chatMsg[0].destId)
        });
    }, [])

    useEffect(() => {
        electron.ipcRenderer.on('notiTitleClick!', (event, sentInfo) => {
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
