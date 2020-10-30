import React, { useEffect, useState } from "react";
import { makeCall } from "../../common/ipcCommunication/ipcIpPhone";
import "./CallPage.css";

export default function CallPage() {
  const [telNum, setTelNum] = useState<string>(sessionStorage.getItem('callPage_telNum')||'');

  useEffect(()=>{
    sessionStorage.setItem('callPage_telNum', telNum);
  }, [telNum])

  return (
    <div className="call-contens-wrap">
      <main className="call-main-wrap">
        <div className="call-page-title-wrap">
          <h4 className="call-title">전화</h4>
        </div>
        <div className="call-main-inner">
          <div className="make-a-call-area-small">
            <h6 className="section-title">전화걸기</h6>
            <div className="make-a-call-inner">
              <input
                className="input-make-a-call"
                placeholder="전화번호를 하이픈 - 없이 입력해주세요"
                onChange={(e) => {
                  const re = /^[0-9\b]+$/;
                  if (e.target.value == '' || re.test(e.target.value)) {
                    setTelNum(e.target.value)
                  }
                }}
                value={telNum}
              />
              <div className="btn-make-a-call" onClick={async ()=> {
                if (telNum?.length>2) {
                  makeCall(telNum);
                }
              }} />
            </div>
          </div>
          <div className="call-history-area">
            <div className="section-title">
              <span className="section-title-inner">전화 이력</span>
              <span className="section-title-tab current">전체</span>
              <span className="section-title-tab">수신</span>
              <span className="section-title-tab">발신</span>
              <span className="section-title-tab">부재</span>
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
        </div>
      </main>

      <div className="signiture-ci-wrap">
        <img src="./images/signiture-ci.svg" alt="signiture-ci" />
      </div>
    </div>
  );
}
