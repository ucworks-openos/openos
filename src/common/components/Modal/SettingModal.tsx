import React, { useEffect, useState } from "react";
import useConfig from "../../../hooks/useConfig";
import { login } from "../../ipcCommunication/ipcCommon";
import { mapEnum } from "../../util";
import "./SettingModal.css";

type TsettingModalProps = {
  closeModalFunction: () => void;
  profile: TUser;
};

export default function SettingModal(props: TsettingModalProps) {
  const {
    states,
    theme,
    scope,
    language,
    font,
    initialTab,
    autoLaunch,
    autoLoginWithLockMode,
    lockMode,
    doubleClickBehavior,
    useProxy,
    setTheme,
    setScope,
    setLanguage,
    setFont,
    setInitialTab,
    setAutoLaunch,
    setAutoLoginWithLockMode,
    setLockMode,
    setDoubleClickBehavior,
    setUseProxy,
  } = useConfig();
  const { closeModalFunction, profile } = props;
  const [currentTab, setCurrentTab] = useState<number>(1);

  const handleTabChange = (e: any) => {
    const { code } = e.target.dataset;
    setCurrentTab(Number(code));
  };

  useEffect(() => {
    console.log(states);
  }, []);

  const handleThemeChange = (e: any) => {
    const { code } = e.target.dataset;
    setTheme(code);
    const loginId = sessionStorage.getItem(`loginId`);
    localStorage.setItem(
      loginId!,
      JSON.stringify({
        ...states,
        theme: code,
      })
    );
  };

  const handleScopeChange = (e: any) => {
    const { code } = e.target.dataset;
    setScope(code);
    const loginId = sessionStorage.getItem(`loginId`);
    localStorage.setItem(
      loginId!,
      JSON.stringify({
        ...states,
        scope: code,
      })
    );
  };

  const handleLanguageChange = (e: any) => {
    const value = e.target.value;
    setLanguage(value);
    const loginId = sessionStorage.getItem(`loginId`);
    localStorage.setItem(
      loginId!,
      JSON.stringify({
        ...states,
        language: value,
      })
    );
  };

  const handleFontChange = (e: any) => {
    const value = e.target.value;
    setFont(value);
    const loginId = sessionStorage.getItem(`loginId`);
    localStorage.setItem(
      loginId!,
      JSON.stringify({
        ...states,
        font: value,
      })
    );
  };

  const handleInitialTabChange = (e: any) => {
    const value = e.target.value;
    setInitialTab(value);
    const loginId = sessionStorage.getItem(`loginId`);
    localStorage.setItem(
      loginId!,
      JSON.stringify({
        ...states,
        initialTab: value,
      })
    );
  };

  const handleAutoLaunchChange = () => {
    setAutoLaunch(!autoLaunch);
    const loginId = sessionStorage.getItem(`loginId`);
    localStorage.setItem(
      loginId!,
      JSON.stringify({
        ...states,
        autoLaunch: !autoLaunch,
      })
    );
  };

  const handleAutoLoginWithLockModeChange = (e: any) => {
    setAutoLoginWithLockMode(!autoLoginWithLockMode);
    const loginId = sessionStorage.getItem(`loginId`);
    localStorage.setItem(
      loginId!,
      JSON.stringify({
        ...states,
        autoLoginWithLockMode: !autoLoginWithLockMode,
      })
    );
  };

  const handleLockModeChange = (e: any) => {
    setLockMode(!lockMode);
    const loginId = sessionStorage.getItem(`loginId`);
    localStorage.setItem(
      loginId!,
      JSON.stringify({
        ...states,
        lockMode: !lockMode,
      })
    );
  };

  const handleDoubleClickBehaviorChange = (e: any) => {
    const { code } = e.target.dataset;
    setDoubleClickBehavior(code);
    const loginId = sessionStorage.getItem(`loginId`);
    localStorage.setItem(
      loginId!,
      JSON.stringify({
        ...states,
        doubleClickBehavior: code,
      })
    );
  };

  const handleUseProxy = (e: any) => {
    setUseProxy(!useProxy);
    const loginId = sessionStorage.getItem(`loginId`);
    localStorage.setItem(
      loginId!,
      JSON.stringify({
        ...states,
        useProxy: !useProxy,
      })
    );
  };

  return (
    <div className="setting-modal">
      <h5 className="setting-modal-title setting">
        설정
        <div className="btn-close" onClick={closeModalFunction} />
      </h5>

      <div className="setting-tab-wrap">
        <input
          type="radio"
          name="setting-tab"
          id="tab1"
          aria-controls="tab1"
          data-code={1}
          checked={currentTab === 1}
          onChange={handleTabChange}
        />
        {/* <input
          type="radio"
          name="setting-tab"
          id="tab2"
          aria-controls="tab2"
          data-code={2}
          checked={currentTab === 2}
          onChange={handleTabChange}
        /> */}
        <input
          type="radio"
          name="setting-tab"
          id="tab3"
          aria-controls="tab3"
          data-code={3}
          checked={currentTab === 3}
          onChange={handleTabChange}
        />
        <input
          type="radio"
          name="setting-tab"
          id="tab4"
          aria-controls="tab4"
          data-code={4}
          checked={currentTab === 4}
          onChange={handleTabChange}
        />

        <div className="tab-title-wrap">
          <label htmlFor="tab1" className="tab-title">
            일반
          </label>
          {/* <label htmlFor="tab2" className="tab-title">
            프로필
          </label> */}
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
                  src="/images/theme-default.png"
                  className="img-theme-label"
                  title="기본"
                />
                <input
                  type="radio"
                  name="theme"
                  id="default"
                  checked={theme === `default`}
                  data-code="default"
                  onClick={handleThemeChange}
                  disabled
                />
                <label htmlFor="default" className="op-label ra">
                  기본
                </label>
              </div>

              <div className="setting-con-option">
                <img
                  src="/images/theme-dark.png"
                  className="img-theme-label"
                  title="어둡게"
                />
                <input
                  type="radio"
                  name="theme"
                  id="dark"
                  checked={theme === `dark`}
                  data-code="dark"
                  onClick={handleThemeChange}
                  disabled
                />
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
                      data-code="default-size"
                      checked={scope === `default-size`}
                      onClick={handleScopeChange}
                      disabled
                    />
                    <label htmlFor="default-size" className="op-label ra">
                      100%
                    </label>
                  </div>
                  <div className="setting-con-option">
                    <input
                      type="radio"
                      name="view-port-scale"
                      id="bigger"
                      data-code="bigger"
                      checked={scope === `bigger`}
                      onClick={handleScopeChange}
                      disabled
                    />
                    <label htmlFor="bigger" className="op-label ra">
                      125%
                    </label>
                  </div>
                  <div className="setting-con-option">
                    <input
                      type="radio"
                      name="view-port-scale"
                      id="more-bigger"
                      data-code="more-bigger"
                      checked={scope === `more-bigger`}
                      onClick={handleScopeChange}
                      disabled
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
                  <select
                    className="op-label sel"
                    onChange={handleLanguageChange}
                    value={language}
                    disabled
                  >
                    <option value="KR">한국어</option>
                    <option value="US">영어</option>
                    <option value="CN">중국어</option>
                    <option value="JP">일본어</option>
                  </select>
                </div>
              </div>
              <div className="setting-con-row-inner">
                <div className="row-inner-title">폰트</div>
                <div className="row-inner-con">
                  <select
                    className="op-label sel"
                    onChange={handleFontChange}
                    value={font}
                    disabled
                  >
                    <option value="굴림">굴림</option>
                    <option value="궁서">궁서</option>
                    <option value="돋움">돋움</option>
                    <option value="바탕">바탕</option>
                    <option value="맑은고딕">맑은고딕</option>
                    <option value="본고딕">본고딕</option>
                  </select>
                </div>
              </div>
              <div className="setting-con-row-inner">
                <div className="row-inner-title">로그인 시 시작 위치</div>
                <div className="row-inner-con">
                  <select
                    className="op-label sel"
                    onChange={handleInitialTabChange}
                    value={initialTab}
                    disabled
                  >
                    <option value="favorite">개인그룹</option>
                    <option value="organization">조직도</option>
                    <option value="chat">채팅</option>
                    <option value="message">쪽지</option>
                    <option value="notice">공지사항</option>
                    <option value="band">팀스페이스</option>
                    <option value="call">전화</option>
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
                  onChange={handleAutoLaunchChange}
                  checked={autoLaunch}
                  disabled
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
                  onChange={handleAutoLoginWithLockModeChange}
                  checked={autoLoginWithLockMode}
                  disabled
                />
                <label htmlFor="auto-start-lock" className="op-label ra">
                  잠금모드로 자동 로그인
                </label>
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
                    onChange={handleLockModeChange}
                    checked={lockMode}
                    disabled
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
          {/* <section id="tab2-con" className="tab-panel">
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
          </section> */}
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
                    disabled
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
                    checked
                    disabled
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
                    disabled
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
                    disabled
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
                      data-code="chat"
                      checked={doubleClickBehavior === `chat`}
                      onClick={handleDoubleClickBehaviorChange}
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
                      data-code="message"
                      checked={doubleClickBehavior === `message`}
                      onClick={handleDoubleClickBehaviorChange}
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
                    onChange={handleUseProxy}
                    checked={useProxy}
                  />
                  <div>
                    <label htmlFor="use-proxy-check">
                      <span></span>
                    </label>
                  </div>
                </div>
              </div>
              {useProxy && (
                <>
                  <div className="setting-con-row-inner proxy-pw-wrap">
                    <div className="row-inner-title">프록시 종류</div>
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
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
