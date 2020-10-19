import React, { useState, useEffect } from "react";
import "./Sections/LoginPage.css";
import { useForm } from "react-hook-form";
import SignitureCi from "../../common/components/SignitureCi";
import styled from "styled-components";
import Alert from "react-bootstrap/Alert";
import { login } from "../../common/ipcCommunication/ipcCommon";
import { useParams } from "react-router-dom";
import { writeDebug, writeLog } from "../../common/ipcCommunication/ipcLogger";

export default function Home(props) {
  const { stopAutoLogin } = useParams();
  const [autoLogin, setAutoLogin] = useState(
    localStorage.getItem(`autoSwitch`) === `on`
  );
  const [id, setId] = useState(localStorage.getItem(`autoLoginId`));
  const { register, errors, handleSubmit } = useForm({ mode: "onChange" });

  const [isLoginFail, setIsLoginFail] = useState(false);
  const [failMessage, setFailMessage] = useState("");

  useEffect(() => {
    const initiate = async () => {
      const resData = await login(
        localStorage.getItem(`autoLoginId`),
        localStorage.getItem(`autoLoginPw`),
        true
      );

      console.log("Promiss login res", resData);

      if (resData.resCode) {
        console.log("Login Success! ", resData);
        sessionStorage.setItem("isLoginElectronApp", true);
        sessionStorage.setItem(`loginId`, id);

        window.location.hash = "#/favorite";
        window.location.reload();
      } else {
        console.log("Login fail! Res:", resData);
      }
    };

    console.log(`stopAutoLogin: `, stopAutoLogin);
    if (
      stopAutoLogin === `false` &&
      localStorage.getItem(`autoSwitch`) === `on`
    ) {
      initiate();
    }
  }, []);

  const handleIdChange = (e) => {
    setId(e.target.value);
  };

  const handleAutoLogin = () => {
    setAutoLogin((prev) => !prev);

    if (localStorage.getItem(`autoSwitch`) === `on`) {
      localStorage.setItem(`autoSwitch`, `off`);
    } else {
      localStorage.setItem(`autoSwitch`, `on`);
    }
  };
  const onSubmit = async (event) => {
    console.log("LOGIN REQUEST:", event);

    setIsLoginFail(false);
    setFailMessage("");

    try {
      const resData = await login(id, event.loginPwd, false);

      console.log("Promiss login res", resData);

      // * autoLoginId는 자동 로그인 시 아이디를 보여주기 위함.
      // * 자동 로그인 시 resData 리턴값에 암호화된 id,비밀번호가 있음. 이를 localStorage에 넣어준다.
      if (resData.resCode && autoLogin) {
        localStorage.setItem(`autoLoginId`, id);
        localStorage.setItem(`autoLoginPw`, resData.data.autoLogin);
      }
      if (resData.resCode) {
        sessionStorage.setItem("isLoginElectronApp", true);
        sessionStorage.setItem(`loginId`, id);

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
  };

  // electron.ipcRenderer.once('res-login', (event, data) => {
  //   alert('Login Response! ' + JSON.stringify(data))
  //   localStorage.setItem('isLoginElectronApp', true)
  //   window.location.hash = '#/favorite';
  //   window.location.reload();
  // });

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
                value={id}
                onChange={handleIdChange}
                aria-invalid={errors.id ? "true" : "false"}
                placeholder="아이디를 입력해주세요"
                // ref={register({
                //   required: true,
                // })}
              />
              {errors.id && (
                <div className="err-msg">아이디는 필수입력항목입니다.</div>
              )}
            </div>
            <div className="row">
              <input
                type="password"
                className="user-pw-here"
                name="loginPwd"
                aria-invalid={errors.password ? "true" : "false"}
                placeholder="비밀번호를 입력해주세요"
                ref={register({
                  required: true,
                  maxLength: 12,
                  minLength: 4,
                })}
              />
              {errors.password && (
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
                  onChange={handleAutoLogin}
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
