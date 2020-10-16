import React from "react";
import "./SettingModal.css";

type TsettingModalProps = {
  closeModalFunction: () => void;
  profile: TUser;
};

export default function SettingModal(props: TsettingModalProps) {
  return (
    <div className="setting-modal">
      <h5 className="modal-title setting">설정</h5>

      <div className="setting-tab-wrap">
        <input
          type="radio"
          name="setting-tab"
          id="tab1"
          aria-controls="tab1"
          checked
        />
        <input type="radio" name="setting-tab" id="tab2" aria-controls="tab2" />
        <input type="radio" name="setting-tab" id="tab3" aria-controls="tab3" />
        <input type="radio" name="setting-tab" id="tab4" aria-controls="tab4" />
        <div className="tab-title-wrap">
          <label htmlFor="tab1" className="tab-title">
            일반
          </label>
          <label htmlFor="tab2" className="tab-title">
            프로필
          </label>
          <label htmlFor="tab3" className="tab-title">
            동작
          </label>
          <label htmlFor="tab4" className="tab-title">
            연결
          </label>
        </div>
        <div className="tab-panels">
          <section id="tab1-con" className="tab-panel">
            <h6>테마</h6>
            <div className="setting-con-row theme">
              <div className="setting-con-option">
                <img
                  src="img/theme-default.png"
                  className="img-theme-label"
                  title="기본"
                />
                <input type="radio" name="theme" id="default" checked />
                <label htmlFor="default" className="op-label ra">
                  기본
                </label>
              </div>
              <div className="setting-con-option" style={{ display: `none` }}>
                <img
                  src="img/theme-dark.png"
                  className="img-theme-label"
                  title="어둡게"
                />
                <input type="radio" name="theme" id="dark" />
                <label htmlFor="dark" className="op-label ra">
                  어둡게
                </label>
              </div>
            </div>
            <h6>기본</h6>
            <div className="setting-con-row basic">
              <div className="setting-con-row-inner">
                <div className="row-inner-title">화면 배율</div>
                <div className="row-inner-con">
                  <div className="setting-con-option">
                    <input
                      type="radio"
                      name="view-port-scale"
                      id="default-size"
                      checked
                    />
                    <label htmlFor="default-size" className="op-label ra">
                      100%
                    </label>
                  </div>
                  <div className="setting-con-option">
                    <input type="radio" name="view-port-scale" id="bigger" />
                    <label htmlFor="bigger" className="op-label ra">
                      125%
                    </label>
                  </div>
                  <div className="setting-con-option">
                    <input
                      type="radio"
                      name="view-port-scale"
                      id="more-bigger"
                    />
                    <label htmlFor="more-bigger" className="op-label ra">
                      150%
                    </label>
                  </div>
                </div>
              </div>
              <div className="setting-con-row-inner">
                <div className="row-inner-title">언어</div>
                <div className="row-inner-con">
                  <select className="op-label sel">
                    <option>한국어</option>
                  </select>
                </div>
              </div>
              <div className="setting-con-row-inner">
                <div className="row-inner-title">폰트</div>
                <div className="row-inner-con">
                  <select className="op-label sel">
                    <option>맑은고딕</option>
                    <option>돋움</option>
                  </select>
                </div>
              </div>
            </div>
            <h6>로그인</h6>
            <div className="setting-con-row login">
              <div className="setting-con-option">
                <input
                  type="checkbox"
                  name="login-action"
                  id="auto-start"
                  checked
                />
                <label htmlFor="auto-start" className="op-label ra">
                  윈도우 시작시 자동실행
                </label>
              </div>
              <div className="setting-con-option">
                <input
                  type="checkbox"
                  name="login-action"
                  id="auto-start-lock"
                />
                <label htmlFor="auto-start-lock" className="op-label ra">
                  잠금모드로 자동 로그인
                </label>
              </div>
              <div className="setting-con-option">
                <input
                  type="checkbox"
                  name="login-action"
                  id="start-position"
                />
                <label htmlFor="start-position" className="op-label ra">
                  메신저 시작시 보여줄 위치
                </label>
                <select className="op-label sel" disabled>
                  <option>개인그룹</option>
                  <option>조직도</option>
                  <option>채팅</option>
                  <option>쪽지</option>
                  <option>공지사항</option>
                  <option>팀스페이스</option>
                  <option>전화</option>
                </select>
              </div>
            </div>
            <h6>잠금모드</h6>
            <div className="setting-con-row lock">
              <div className="setting-con-row-inner">
                <div className="row-inner-title">잠금모드 사용</div>
                <div className="setting-toggleWrap">
                  <input
                    type="checkbox"
                    name="use-lock"
                    id="use-lock-check"
                    className="toggle-input"
                    value=""
                  />
                  <div>
                    <label htmlFor="use-lock-check">
                      <span></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section id="tab2-con" className="tab-panel">
            <div className="setting-con-row user-pic-area">
              <div className="user-pic-wrap">
                <img
                  src="img/img_user-thumbnail.png"
                  alt="user-profile-picture"
                />
              </div>
              <div className="btn-change-user-pic-wrap">
                <input
                  type="file"
                  name="change-user-pic"
                  id="change-user-pic"
                  className="change-user-pic"
                />
                <label
                  htmlFor="change-user-pic"
                  className="btn-change-user-pic"
                ></label>
              </div>
            </div>
            <h6>상태메세지</h6>
            <div className="setting-con-row state-message">
              <input
                type="text"
                className="op-txt-input"
                placeholder="상태메세지를 입력해주세요"
              />
            </div>
            <h6>근무상태</h6>
            <div className="setting-con-row state-message">
              <input
                type="text"
                className="op-txt-input"
                placeholder="근무상태를 입력해주세요"
              />
            </div>
          </section>
          <section id="tab3-con" className="tab-panel">
            <h6>기본</h6>
            <div className="setting-con-row action-basic">
              <div className="setting-con-row-inner">
                <div className="row-inner-title">
                  즐겨찾기/조직도에서 퀵버튼 보이기
                </div>
                <div className="setting-toggleWrap">
                  <input
                    type="checkbox"
                    name="place-btn-onlist"
                    id="place-btn-onlist-check"
                    className="toggle-input"
                    value=""
                  />
                  <div>
                    <label htmlFor="place-btn-onlist-check">
                      <span></span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="setting-con-row-inner">
                <div className="row-inner-title">
                  즐겨찾기/조직도에서 그룹 단계 라인 보이기
                </div>
                <div className="setting-toggleWrap">
                  <input
                    type="checkbox"
                    name="place-group-line"
                    id="place-group-line-check"
                    className="toggle-input"
                    value=""
                    checked
                  />
                  <div>
                    <label htmlFor="place-group-line-check">
                      <span></span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="setting-con-row-inner">
                <div className="row-inner-title">
                  즐겨찾기된 사용자 접속시 알려주기
                </div>
                <div className="setting-toggleWrap">
                  <input
                    type="checkbox"
                    name="noti-favorite-login"
                    id="noti-favorite-login-check"
                    className="toggle-input"
                    value=""
                  />
                  <div>
                    <label htmlFor="noti-favorite-login-check">
                      <span></span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="setting-con-row-inner">
                <div className="row-inner-title">
                  즐겨찾기된 사용자 온/오프라인으로 정렬
                </div>
                <div className="setting-toggleWrap">
                  <input
                    type="checkbox"
                    name="noti-favorite-login"
                    id="noti-favorite-login-check"
                    className="toggle-input"
                    value=""
                  />
                  <div>
                    <label htmlFor="noti-favorite-login-check">
                      <span></span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="setting-con-row-inner">
                <div className="row-inner-title">사용자 더블 클릭 시 동작</div>
                <div className="row-inner-con">
                  <div className="setting-con-option">
                    <input
                      type="radio"
                      name="dclick-action-set"
                      id="dclick-action-chat"
                      checked
                    />
                    <label htmlFor="dclick-action-chat" className="op-label ra">
                      채팅
                    </label>
                  </div>
                  <div className="setting-con-option">
                    <input
                      type="radio"
                      name="dclick-action-set"
                      id="dclick-action-message"
                    />
                    <label
                      htmlFor="dclick-action-message"
                      className="op-label ra"
                    >
                      쪽지
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section id="tab4-con" className="tab-panel">
            <h6>연결</h6>
            <div className="setting-con-row connect">
              <div className="setting-con-row-inner">
                <div className="row-inner-title">서버</div>
                <div className="row-inner-con">
                  <div className="op-input-txt">
                    <input
                      type="text"
                      className="op-txt-input"
                      value="220.230.127.93"
                    />
                  </div>
                </div>
              </div>
              <div className="setting-con-row-inner port-wrap">
                <div className="row-inner-title">포트</div>
                <div className="row-inner-con">
                  <div className="op-input-txt">
                    <input type="text" className="op-txt-input" value="12551" />
                  </div>
                  <div className="op-input-btn">
                    <input
                      type="submit"
                      className="op-btn"
                      value="연결 테스트"
                    />
                  </div>
                </div>
              </div>
            </div>
            <h6>프록시</h6>
            <div className="setting-con-row proxy">
              <div className="setting-con-row-inner">
                <div className="row-inner-title">프록시 사용</div>
                <div className="setting-toggleWrap">
                  <input
                    type="checkbox"
                    name="use-proxy"
                    id="use-proxy-check"
                    className="toggle-input"
                    value=""
                  />
                  <div>
                    <label htmlFor="use-proxy-check">
                      <span></span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="setting-con-row-inner proxy-pw-wrap">
                <div className="row-inner-title">암호</div>
                <div className="row-inner-con">
                  <select className="op-label sel">
                    <option>HTTP 프록시</option>
                    <option>Socks 버전4</option>
                    <option>Socks 버전5</option>
                  </select>
                  <div className="op-input-btn">
                    <input
                      type="submit"
                      className="op-btn"
                      value="웹브라우저 설정값 가져오기"
                    />
                  </div>
                </div>
              </div>
              <div className="setting-con-row-inner">
                <div className="row-inner-title">서버</div>
                <div className="row-inner-con">
                  <div className="op-input-txt">
                    <input type="text" className="op-txt-input" />
                  </div>
                </div>
              </div>
              <div className="setting-con-row-inner">
                <div className="row-inner-title">포트</div>
                <div className="row-inner-con">
                  <div className="op-input-txt">
                    <input type="text" className="op-txt-input" value="0" />
                  </div>
                </div>
              </div>
              <div className="setting-con-row-inner">
                <div className="row-inner-title">사용자</div>
                <div className="row-inner-con">
                  <div className="op-input-txt">
                    <input type="text" className="op-txt-input" />
                  </div>
                </div>
              </div>
              <div className="setting-con-row-inner">
                <div className="row-inner-title">암호</div>
                <div className="row-inner-con">
                  <div className="op-input-txt">
                    <input type="text" className="op-txt-input" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div className="modal-btn-wrap">
        <div className="btn-ghost-s cancel">취소하기</div>
        <div className="btn-solid-s submit">저장하기</div>
      </div>
    </div>
  );
}
