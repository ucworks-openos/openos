import React from "react";
import "./CallPage.css";

export default function CallPage() {
  return (
    <div className="call-contens-wrap">
      <main className="call-main-wrap">
        <div className="call-page-title-wrap">
          <h4 className="call-title">전화</h4>
          <div className="call-action-wrap">
            <div className="call-action call-pick-up" title="당겨받기"></div>
            <div className="call-action call-forwarding" title="착신전환"></div>
            <div
              className="call-action call-reservation"
              title="통화예약"
            ></div>
          </div>
        </div>
        <div className="call-main-inner">
          <div className="call-dashboard-area">
            <div className="call-dashboard-col call-user-info-wrap">
              <div className="call-user-pic-wrap">
                <img
                  src="./images/img_user-thumbnail.png"
                  alt="call-user-profile-picture"
                />
              </div>
              <div className="call-user-info-wrap-inner">
                <div className="call-inner-row call-user-info">
                  <h6 className="call-user-name">홍길동</h6>
                  <span className="call-user-position">과장</span>
                  <span className="call-user-department">개발팀</span>
                </div>
                <div className="call-inner-row call-user-contact">
                  <span className="call-user-phone">3653</span>
                  <span className="call-user-mobile">010-1234-5678</span>
                </div>
              </div>
            </div>
            <div className="call-dashboard-col call-today-wrap">
              <div className="call-inner-row num-today-call-wrap">
                <div className="num-today-call">6</div>
                <div className="label-today-call">하루통화</div>
              </div>
              <div className="call-inner-row num-today-call-info-wrap">
                <span className="num-today-make-call">5</span>
                <span className="num-today-get-call">1</span>
              </div>
            </div>
            <div className="call-dashboard-col call-missed-wrap">
              <div className="call-inner-row num-missed-call-wrap">
                <div className="num-missed-call">4</div>
                <div className="label-missed-call">부재중 전화</div>
              </div>
              <div className="call-inner-row missed-call-info-wrap">
                <span className="missed-date">PM 02:42:33</span>
                <span className="missed-phone-num">010-1234-5678</span>
              </div>
            </div>
          </div>
          <div className="make-a-call-area-small">
            <h6 className="section-title">전화걸기</h6>
            <div className="make-a-call-inner">
              <input
                className="input-make-a-call"
                placeholder="전화번호를 하이픈 - 없이 입력해주세요"
              />
              <div className="btn-make-a-call" />
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
        <div className="side-rht">
          <div className="side-title-wrap">
            <div className="side-tab blf current">BLF</div>
            <div className="side-tab fav">즐겨찾기</div>
          </div>
          <div className="side-list-wrap">
            <ul>
              <li className="side-list-single">
                <div className="call-user-state online"></div>
                <h6 className="call-user-name">김하나</h6>
                <span className="call-user-position">과장</span>
                <span className="call-user-department">개발팀</span>
                <h6 className="phone-num">3655</h6>
              </li>
              <li className="side-list-single">
                <div className="call-user-state onCall"></div>
                <h6 className="call-user-name">이두리</h6>
                <span className="call-user-position">주임</span>
                <span className="call-user-department">개발팀</span>
                <h6 className="phone-num">3656</h6>
              </li>
              <li className="side-list-single">
                <div className="call-user-state atTable"></div>
                <h6 className="call-user-name">최서이</h6>
                <span className="call-user-position">사원</span>
                <span className="call-user-department">개발팀</span>
                <h6 className="phone-num">3657</h6>
              </li>
            </ul>
          </div>
        </div>
      </main>

      <div className="signiture-ci-wrap">
        <img src="./images/signiture-ci.svg" alt="signiture-ci" />
      </div>
    </div>
  );
}
