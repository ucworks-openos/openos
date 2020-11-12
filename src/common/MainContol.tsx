import Axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ExternalURLs } from "../enum/external";
import { logout } from "./ipcCommunication/ipcCommon";
import { writeDebug, writeError, writeInfo } from "./ipcCommunication/ipcLogger";
import { getUserInfos } from "./ipcCommunication/ipcOrganization";
import { convertToUser } from "./util";
import { getGlobalUserConfig, setGlobalUserConfig } from "./util/commonUtil";

const electron = window.require("electron");
const { remote } = window.require("electron");

type TloginContolProps = {
    loginSuccessId: string
  //loginSuccessId: (loginedId:string) => void;
};

function MainContol(props:TloginContolProps) {
    const { loginSuccessId } = props;

    // 선택한 대화방 정보를 가지고 있는다.
    const currentChatRoom = useSelector((state:any) => state.chats.currentChatRoom);

    // MainProcess IPC Req Receive
    useEffect(() => {
        //
        // 페이지 변경요청
        electron.ipcRenderer.removeAllListeners("goto");
        electron.ipcRenderer.on("goto", (event:any, page:string) => {
            writeInfo("goto", page);
            window.location.hash = `#/${page}`;
            window.location.reload();
        });

        //
        // 로그아웃 요청
        electron.ipcRenderer.removeAllListeners("logout-req");
        electron.ipcRenderer.on("logout-req", (event:any, reason:string) => {
            writeInfo('Logout Req From MainProc', reason)
            logout(); 
        });


    }, [])

    //
    // 선택한 대화방 처리
    useEffect(() => {
        // 현재 대화탭이 아니면 선택된 대화방 값을 없애 버린다.
        if (window.location.hash.split("/")[1] !== "chat") {
            sessionStorage.setItem("chatRoomKey", "");
        } else {
            sessionStorage.setItem(
            "chatRoomKey",
            currentChatRoom ? currentChatRoom.room_key : ""
            );
        }

        writeDebug('NotificationControl.  CurrentChatRoomKey:%s  location:%s', sessionStorage.getItem("chatRoomKey"), window.location.hash);
    }, [currentChatRoom, window.location.hash]);


    //
    // 로그인 성공 처리
    useEffect(() => {
        loginProcess(loginSuccessId);
    }, [loginSuccessId]);

    const loginProcess = async (loginId:string) => {
        writeInfo('loginSuccessProc --', loginId);

        if (!loginId) return;

        try {
            // get Detail Info
            const { data: { items: { node_item: profileSchema }, },} 
                = await getUserInfos([loginId]);
    
            // make profile
            let userData = convertToUser(profileSchema);
            
            // set logined user info
            sessionStorage.setItem(`loginId`, loginId)
            remote.getGlobal('USER').profile = userData;

            writeInfo('loginSuccessProc ', userData.userId, userData.userName)
            writeDebug('loginSuccessProc ', userData);

            // Login Success NextPage
            window.location.hash = "#/favorite";
            window.location.reload();

            loginCompleted(userData);
            

        } catch(err){
            writeError('loginSucessProc Error', loginId, err);
        }
    }

    //
    // 로그인 완료 처리
    const loginCompleted = async (userData:TUser) => {
        writeInfo('loginSuccessProc Completed! ', userData.userId, userData.userName, userData.userTelOffice, userData.userTelIpphone);

        // getBandToken
        try {
            let param = {
                ucTalkId:userData.userId, 
                password:'03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4'
            }

            const callHistoryInstance = Axios.create({
                baseURL: ExternalURLs.BAND_BACK_BASE, //'http://27.96.131.93'
                timeout: 3000,
                headers: {'X-Custom-Header': 'foobar'}
            });
    
            // 'http://27.96.131.93'/api/user/login'
            let url = ExternalURLs.BAND_LOGIN + `?ucTalkId=${userData.userId}&password=03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4`
            callHistoryInstance.post(ExternalURLs.BAND_LOGIN, param).then(function (response:any) {

                //eyJhbGciOiJIUzI1NiJ9.MjM0NDU.lszrQ4ktnhbb0Qv0RO-bwGE7TvZ9VzVPVl1gpJVCYTQ
                setGlobalUserConfig('bandLoginToken', response?.data?.accessToken)
                writeDebug('BandToken: ', getGlobalUserConfig('bandLoginToken'))
            }).catch(function (error) {
                writeError('BandToken response fail! ', ExternalURLs.BAND_LOGIN, param, error)
            });

        } catch (err) {
            writeError('get Band Token Fail!', err)
        }
    }

    return <div />;
}

export default MainContol;
