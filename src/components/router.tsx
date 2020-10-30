import React, { useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, HashRouter } from "react-router-dom";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { writeDebug, writeError, writeInfo } from "../common/ipcCommunication/ipcLogger";
import { getUserInfos } from "../common/ipcCommunication/ipcOrganization";
import { convertToUser } from "../common/util";
import { setLoginUserInfo } from "../redux/actions/user_actions";

const { remote } = window.require("electron")

const Sidebar = React.lazy(() => import("./__Navigation/SideNavi/SideNavi"));
const NavigationBar = React.lazy(
  () => import("./__Navigation/HeaderNavi/HeaderNavi")
);
const LoginPage = React.lazy(() => import("./LoginPage/LoginPage"));
const FavoritePage = React.lazy(() => import("./FavoritePage/FavoritePage"));
const OrganizationPage = React.lazy(
  () => import("./OrganizationPage/OrganizationPage")
);
const MessagePage = React.lazy(() => import("./MessagePage/MessagePage"));
const ChatPage = React.lazy(() => import("./ChatPage/ChatPage"));
const CallPage = React.lazy(() => import("./CallPage/CallPage"));
const SiteConfigPage = React.lazy(
  () => import("./SiteConfigPage/SiteConfigPage")
);
const AboutPage = React.lazy(() => import("./AboutPage/AboutPage"));
const NoMatchPage = React.lazy(() => import("./NoMatchPage/NoMatchPage"));
const NetTestPage = React.lazy(() => import("./TestPages/NetTestPage"));
const FuncTestPage = React.lazy(() => import("./TestPages/FuncTestPage"));
const FuncTestPage2 = React.lazy(() => import("./TestPages/FuncTestPage2"));
const chatTestPage = React.lazy(() => import("./TestPages/ChatTestPage"));
const TeamSpacePage = React.lazy(() => import("./TeamSpacePage/TeamSpacePage"));

function RouterPage() {
  const dispatch = useDispatch()


  writeInfo('RouterPage Path:%s  LoginUser:%s', window.location.hash, remote.getGlobal('USER'));


  const loginSucessProc = (loginedId:string) => {
    
    writeInfo('loginSuccessProc --', loginedId);
    
    getProfile(loginedId).then((loginUserData) => {

      writeInfo('loginSuccessProc Completed!', remote.getGlobal('USER'))
      writeDebug('loginSuccessProc Completed!', loginUserData)
      
      // 로그인된 사용자 정보를 넣는다.
      sessionStorage.setItem(`loginId`, loginedId)

      remote.getGlobal('USER').profile = loginUserData;


      window.location.hash = "#/favorite";
      window.location.reload();
    }).catch((err) => {
      writeError('loginSucessProc Error', loginedId, err);
    })
  };

  const getProfile = async (id: string) => {
    const {
      data: {
        items: { node_item: profileSchema },
      },
    } = await getUserInfos([id]);
    return convertToUser(profileSchema);
  };

  /** LoginPage Randerer */
  const loginRanderer = () => {
    return <LoginPage loginSucessProc={loginSucessProc} />
  }

  return (
    <HashRouter>
      {/* <MyErrorBoundary> */}
      <Suspense fallback={<div>Loading...</div>}>
        {sessionStorage.getItem("isLoginElectronApp") && (
          <>
            {" "}
            <NavigationBar /> 
            <Sidebar />
            {" "}
          </>
        )}
        <Switch>

          {/* login page */}
          <Route exact path="/"  render={loginRanderer} />
          <Route exact path="/login" render={loginRanderer}  />
          <Route exact path="/logout" render={loginRanderer}  />

          <Route exact path="/favorite" component={FavoritePage} />
          <Route exact path="/organization" component={OrganizationPage} />
          <Route exact path="/about" component={AboutPage} />
          <Route exact path="/message" component={MessagePage} />
          <Route exact path="/chat" component={ChatPage} />
          <Route exact path="/call" component={CallPage} />

          <Route exact path="/chat/:roomKey/:members" component={ChatPage} />
          <Route
            exact
            // path="/chat/:roomKey/:members/:message"
            path="/chat/:roomKey"
            component={ChatPage}
          />
          <Route
            exact
            path="/chat_from_organization/:orgMembers"
            component={ChatPage}
          />

          <Route exact path="/team-space" component={TeamSpacePage} />
          <Route exact path="/site-config" component={SiteConfigPage} />
          <Route exact path="/netTest" component={NetTestPage} />
          <Route exact path="/funcTest" component={FuncTestPage} />
          <Route exact path="/funcTest2" component={FuncTestPage2} />
          <Route exact path="/chatTestPage" component={chatTestPage} />
          <Route component={NoMatchPage} />
        </Switch>
      </Suspense>
      {/* </ MyErrorBoundary> */}
    </HashRouter>
  );
}

if (!window.location.hash || window.location.hash === "#/") {
  writeDebug('location.hash `#/login');
  window.location.hash = `#/login`;
}

export default RouterPage;
