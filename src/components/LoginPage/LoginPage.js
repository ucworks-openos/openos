import React, { useState, useEffect } from "react";
import "./Sections/LoginPage.css";
import { useForm } from "react-hook-form";
import SignitureCi from "../../common/components/SignitureCi";
import styled from "styled-components";
import Alert from "react-bootstrap/Alert";
import { login, setAutoLoginFlag } from "../../common/ipcCommunication/ipcCommon";
import { useParams } from "react-router-dom";
import { writeDebug, writeInfo, writeLog } from "../../common/ipcCommunication/ipcLogger";

const { remote } = window.require("electron")

export default function LoginPage() {
  const [autoLogin, setAutoLogin] = useState(remote.getGlobal('USER_CONFIG').get('autoLogin'));
  const [isLoginFail, setIsLoginFail] = useState(false);
  const [failMessage, setFailMessage] = useState("");

  // const { register, errors, handleSubmit } = useForm({ mode: "onChange" });
  const { register, errors, handleSubmit } = useForm({
    defaultValues: {
      loginId: remote.getGlobal('USER_CONFIG').get('autoLoginId'),
    }
  });


  // 로그아웃으로 처린된것인지 여부
  const isLogout = window.location.hash.includes('/logout');

  useEffect(() => {
    writeDebug('LoginPage Path',  window.location.hash)
    writeDebug('USER_CONFIG', remote.getGlobal('USER_CONFIG'))

    // 모든 정보가 맞아야 자동로그인을 요청하도록 한다.
    if (!isLogout && autoLogin 
      && remote.getGlobal('USER_CONFIG').get('autoLoginId')
      && remote.getGlobal('USER_CONFIG').get('autoLoginPwd')) {

      let autoLoginId = remote.getGlobal('USER_CONFIG').get('autoLoginId')
      writeDebug('Auto Login', autoLoginId)
      loginRequest(autoLoginId, '', true);
    }
  }, []);


   useEffect(() => {
    remote.getGlobal('USER_CONFIG').set('autoLogin', autoLogin)
    remote.getGlobal('USER_CONFIG').set('autoLoginPwd', '') // 기존 저장된 비번도 날린다.
   }, [autoLogin])


  const onSubmit = async (data) => {
    writeInfo('LOGIN CLICK', data.loginId)
    writeInfo('LOGIN CLICK Data', data.loginId, data.loginPwd)

    setIsLoginFail(false);
    setFailMessage("");
    loginRequest(data.loginId, data.loginPwd);
  };

  /**
   * 로그인 요청
   * @param {String} loginId 
   * @param {String} loginPwd 
   * @param {String} isAutoLogin 
   */
  async function loginRequest(loginId, loginPwd, isAutoLogin = false) {
    try {
      const resData = await login(loginId, loginPwd, isAutoLogin);

      if (resData.resCode) {
        sessionStorage.setItem(`loginId`, loginId)

        window.location.hash = "#/favorite";
        window.location.reload();
      } else {
        setIsLoginFail(true);
        setFailMessage("Login Fail! (" + resData.data + ")");
      }
    } catch (error) {
      setIsLoginFail(true);
      setFailMessage("Login Fail! (Ex:" + error + ")");
    }
  }

  return (
    <div className="sign-in">
      <div className="contents-wrap-login">
        <main className="main-wrap">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h1 className="h-sig welcome-title">Sign in</h1>
            <WelcomeWordWide className="sub2 welcome-txt">
              - 환영합니다! 서비스 사용을 위해 로그인 해주세요 -
            </WelcomeWordWide>
            <WelcomeWord className="sub2 welcome-txt">
              {" "}
              서비스 사용을 위해 로그인 해주세요 -
            </WelcomeWord>

            <div className="row">
              <input
                type="text"
                className="user-id-here"
                name="loginId"
                aria-invalid={errors.loginId ? "true" : "false"}
                placeholder="아이디를 입력해주세요"
                ref={register({
                  required: true,
                })}
              />
              {errors.loginId && (
                <div className="err-msg">아이디는 필수입력항목입니다.</div>
              )}
            </div>
            <div className="row">
              <input
                type="password"
                className="user-pw-here"
                name="loginPwd"
                aria-invalid={errors.loginPwd ? "true" : "false"}
                placeholder="비밀번호를 입력해주세요"
                ref={register({
                  required: true,
                  maxLength: 12,
                  minLength: 4,
                })}
              />
              {errors.loginPwd && (
                <div className="err-msg">
                  비밀번호는 필수입력항목이며 4~12자 입니다.
                </div>
              )}
            </div>
            <div className="submit-wrap">
              <button type="submit">Let's start </button>
            </div>
            {isLoginFail && <Alert variant="danger">{failMessage}</Alert>}
            <div className="sign-in-action-wrap">
              <div className="auto-sign-in">
                <input
                  type="checkbox"
                  id="auto-sign-in-check"
                  onChange={()=>setAutoLogin(!autoLogin)}
                  checked={autoLogin}
                />
                <label className="sub2" htmlFor="auto-sign-in-check">
                  자동로그인
                </label>
              </div>
              <div className="go-to-reset-pw">
                <a href="#" className="sub2">
                  비밀번호 재설정
                </a>
              </div>
            </div>
          </form>
        </main>
        <SignitureCi color />
      </div>
    </div>
  );
}

const WelcomeWordWide = styled.span`
  @media (max-width: 768px) {
    display: none !important;
  }
`;

const WelcomeWord = styled.span`
  @media (min-width: 768px) {
    display: none !important;
  }
`;
