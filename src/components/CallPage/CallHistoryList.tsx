import React, { useEffect, useState } from "react";
import Axios from "axios";
import { writeDebug } from "../../common/ipcCommunication/ipcLogger";

const { remote } = window.require("electron")

export default function CallHistoryList() {
    const [callDatas, setCallDatas] = useState<any>([]);

    
    useEffect(() => {

        if (remote.getGlobal('IS_DEV')) {
            // 개발모드에서는 CROS 오류가 발생함으로 DummyData 적용
            let dummy = [
                {callType: 2, duration: "00:00", memo: "", myPhoen: "3646", num: 2, otheNumber: "3647", otherUserInfo: "개발팀", otherUserName: "유민수 사원(개발팀)", otherUserType: 1, redirectCause: 0, ringStart: "2020-10-30 16:42:29", seq: "202010_598"},
                {callType: 3, duration: "29:34", memo: "", myPhoen: "3646", num: 3, otheNumber: "3650", otherUserInfo: "개발팀", otherUserName: "Nhan Bao 주임(개발팀)", otherUserType: 1, redirectCause: 0, ringStart: "2020-10-30 16:41:42", seq: "202010_599"},
                {callType: 3, duration: "00:02", memo: "", myPhoen: "3646", num: 4, otheNumber: "3650", otherUserInfo: "개발팀", otherUserName: "Nhan Bao 주임(개발팀)", otherUserType: 1, redirectCause: 0, ringStart: "2020-10-30 16:39:59", seq: "202010_596"},
                {callType: 2, duration: "00:00", memo: "", myPhoen: "3646", num: 5, otheNumber: "3647", otherUserInfo: "개발팀", otherUserName: "유민수 사원(개발팀)", otherUserType: 1, redirectCause: 0, ringStart: "2020-10-30 16:39:48", seq: "202010_594"}, 
                {callType: 3, duration: "00:05", memo: "", myPhoen: "3646", num: 11, otheNumber: "3650", otherUserInfo: "개발팀", otherUserName: "Nhan Bao 주임(개발팀)", otherUserType: 1, redirectCause: 0, ringStart: "2020-10-30 15:50:08", seq: "202010_574"}
            ];
            setCallDatas(dummy)

        } else {
            const callHistoryInstance = Axios.create({
                baseURL: 'http://192.168.0.172:8040/sucti',
                timeout: 3000,
                headers: {'X-Custom-Header': 'foobar'}
            });
    
            callHistoryInstance.get(`/getUserHistory/${remote.getGlobal('USER').userId}?iDisplayStart=1&iDisplayLength=50`)
            .then(function (response) {
                setCallDatas(response.data.data)
            })
            .catch(function (error) {
                writeDebug('callHistoryInstance error. ', error)
            });
        }
    }, []);

    useEffect(() => {
        writeDebug('callDatas State. ', callDatas?.length);
    }, [callDatas])

    const getCallTypeClass = (callType:number) => {
        switch(callType) {
            case 1:
                return {class:'icon-call-info make', title:'발신'}
            case 2:
                return {class:'icon-call-info get', title:'수신'}
            case 3:
                return {class:'icon-call-info missed', title:'부재중'}
            default:
                return {class:'icon-call-info', title:'알수없음'}
        }

        /*
        className="icon-call-info pick-up"
        title="착신전환"
        */
    };

  return (
    
    <div className="call-history-area">
        <div className="section-title">
            {/* <span className="section-title-inner">전화 이력</span>
            <span className="section-title-tab current">전체</span>
            <span className="section-title-tab">수신</span>
            <span className="section-title-tab">발신</span>
            <span className="section-title-tab">부재</span> */}
        </div>
        <div className="call-history-table-area">
            <table className="call-history-table">
            <thead>
                <tr>
                <th className="table-cell">구분</th>
                <th className="table-cell">일시</th>
                <th className="table-cell">전화번호</th>
                <th className="table-cell">이름</th>
                <th className="table-cell">소속</th>
                </tr>
            </thead>
            <tbody>
                {callDatas &&
                    callDatas.map((call:any, index:number) => {
                        let callType = getCallTypeClass(call.callType);

                        return (<tr>
                                    <td>
                                        <i className={callType.class} title={callType.title}></i>
                                    </td>
                                    <td>{call.ringStart}</td>
                                    <td>{call.otheNumber}</td>
                                    <td>{call.otherUserName}</td>
                                    <td>{call.otherUserInfo}</td>
                                </tr>);
                    })}
            </tbody>
            </table>
        </div>
    </div>
  );

}