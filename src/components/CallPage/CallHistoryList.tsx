import React, { useEffect, useState } from "react";
import Axios from "axios";

export default function CallHistoryList() {

    
  useEffect(() => {
  }, []);

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
                <th className="table-cell">직급</th>
                <th className="table-cell">소속</th>
                <th className="table-cell">메모</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <td>
                    <i className="icon-call-info make" title="발신"></i>
                </td>
                <td>2020-09-22 14:42</td>
                <td>010-1234-5678</td>
                <td>이하나</td>
                <td>과장</td>
                <td>개발팀</td>
                <td>서류누락자 상기시킬것 지시</td>
                </tr>
                <tr>
                <td>
                    <i className="icon-call-info get" title="수신"></i>
                </td>
                <td>2020-09-22 14:42</td>
                <td>010-1234-5678</td>
                <td>이하나</td>
                <td>과장</td>
                <td>개발팀</td>
                <td>-</td>
                </tr>
                <tr>
                <td>
                    <i
                    className="icon-call-info pick-up"
                    title="착신전환"
                    ></i>
                </td>
                <td>2020-09-22 14:42</td>
                <td>010-1234-5678</td>
                <td>이하나</td>
                <td>과장</td>
                <td>개발팀</td>
                <td>-</td>
                </tr>
                <tr>
                <td>
                    <i
                    className="icon-call-info missed"
                    title="부재중전화"
                    ></i>
                </td>
                <td>2020-09-22 14:42</td>
                <td>031-1111-2222</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                </tr>
                <tr>
                <td>
                    <i className="icon-call-info make" title="발신"></i>
                </td>
                <td>2020-09-22 14:42</td>
                <td>010-1234-5678</td>
                <td>이하나</td>
                <td>과장</td>
                <td>개발팀</td>
                <td>서류누락자 상기시킬것 지시</td>
                </tr>
                <tr>
                <td>
                    <i className="icon-call-info get" title="수신"></i>
                </td>
                <td>2020-09-22 14:42</td>
                <td>010-1234-5678</td>
                <td>이하나</td>
                <td>과장</td>
                <td>개발팀</td>
                <td>-</td>
                </tr>
                <tr>
                <td>
                    <i
                    className="icon-call-info pick-up"
                    title="착신전환"
                    ></i>
                </td>
                <td>2020-09-22 14:42</td>
                <td>010-1234-5678</td>
                <td>이하나</td>
                <td>과장</td>
                <td>개발팀</td>
                <td>-</td>
                </tr>
                <tr>
                <td>
                    <i
                    className="icon-call-info missed"
                    title="부재중전화"
                    ></i>
                </td>
                <td>2020-09-22 14:42</td>
                <td>031-1111-2222</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                </tr>
                <tr>
                <td>
                    <i className="icon-call-info make" title="발신"></i>
                </td>
                <td>2020-09-22 14:42</td>
                <td>010-1234-5678</td>
                <td>이하나</td>
                <td>과장</td>
                <td>개발팀</td>
                <td>서류누락자 상기시킬것 지시</td>
                </tr>
                <tr>
                <td>
                    <i className="icon-call-info get" title="수신"></i>
                </td>
                <td>2020-09-22 14:42</td>
                <td>010-1234-5678</td>
                <td>이하나</td>
                <td>과장</td>
                <td>개발팀</td>
                <td>-</td>
                </tr>
                <tr>
                <td>
                    <i
                    className="icon-call-info pick-up"
                    title="착신전환"
                    ></i>
                </td>
                <td>2020-09-22 14:42</td>
                <td>010-1234-5678</td>
                <td>이하나</td>
                <td>과장</td>
                <td>개발팀</td>
                <td>-</td>
                </tr>
                <tr>
                <td>
                    <i
                    className="icon-call-info missed"
                    title="부재중전화"
                    ></i>
                </td>
                <td>2020-09-22 14:42</td>
                <td>031-1111-2222</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                </tr>
                <tr>
                <td>
                    <i className="icon-call-info make" title="발신"></i>
                </td>
                <td>2020-09-22 14:42</td>
                <td>010-1234-5678</td>
                <td>이하나</td>
                <td>과장</td>
                <td>개발팀</td>
                <td>서류누락자 상기시킬것 지시</td>
                </tr>
                <tr>
                <td>
                    <i className="icon-call-info get" title="수신"></i>
                </td>
                <td>2020-09-22 14:42</td>
                <td>010-1234-5678</td>
                <td>이하나</td>
                <td>과장</td>
                <td>개발팀</td>
                <td>-</td>
                </tr>
                <tr>
                <td>
                    <i
                    className="icon-call-info pick-up"
                    title="착신전환"
                    ></i>
                </td>
                <td>2020-09-22 14:42</td>
                <td>010-1234-5678</td>
                <td>이하나</td>
                <td>과장</td>
                <td>개발팀</td>
                <td>-</td>
                </tr>
                <tr>
                <td>
                    <i
                    className="icon-call-info missed"
                    title="부재중전화"
                    ></i>
                </td>
                <td>2020-09-22 14:42</td>
                <td>031-1111-2222</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                </tr>
            </tbody>
            </table>
        </div>
    </div>
  );

}