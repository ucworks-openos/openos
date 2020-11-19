import React, { useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, HashRouter } from "react-router-dom";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import {
  writeDebug,
  writeError,
  writeInfo,
} from "../common/ipcCommunication/ipcLogger";
import { getUserInfos } from "../common/ipcCommunication/ipcOrganization";
import MainContol from "../common/MainContol";
import NotificationControl from "../common/NotificationControl";
import { convertToUser } from "../common/util";
import { setLoginUserInfo } from "../redux/actions/user_actions";
import SettingPage from "./SettingPage/SettingPage";

const { remote } = window.require("electron");

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

const TeamSpacePage = React.lazy(() => import("./TeamSpacePage/TeamSpacePage"));
const NoticePage = React.lazy(() => import("./NoticePage/NoticePage"));
const AboutPage = React.lazy(() => import("./AboutPage/AboutPage"));

// TEST PAGE
const NoMatchPage = React.lazy(() => import("./NoMatchPage/NoMatchPage"));
const NetTestPage = React.lazy(() => import("./TestPages/NetTestPage"));
const FuncTestPage = React.lazy(() => import("./TestPages/FuncTestPage"));
const FuncTestPage2 = React.lazy(() => import("./TestPages/FuncTestPage2"));
const chatTestPage = React.lazy(() => import("./TestPages/ChatTestPage"));

function RouterPage() {
  const [loginSuccessId, setLoginSuccessId] = useState("");

  /** LoginPage Randerer */
  const loginRanderer = () => {
    return <LoginPage setLoginSuccessId={setLoginSuccessId} />;
  };

  return (
    <HashRouter>
      {/* <MyErrorBoundary> */}
      <NotificationControl />
      <MainContol loginSuccessId={loginSuccessId} />

      <Suspense fallback={<div>Loading...</div>}>
        {remote.getGlobal("USER").userId && (
          <>
            {" "}
            <NavigationBar />
            <Sidebar />{" "}
          </>
        )}
        <Switch>
          {/* login page */}
          <Route exact path="/" render={loginRanderer} />
          <Route exact path="/login" render={loginRanderer} />
          <Route exact path="/logout" render={loginRanderer} />

          <Route exact path="/favorite" component={FavoritePage} />
          <Route exact path="/organization" component={OrganizationPage} />
          <Route exact path="/about" component={AboutPage} />
          <Route exact path="/message" component={MessagePage} />

          {/* chat page */}
          <Route exact path="/chat" component={ChatPage} />
          <Route exact path="/chat/:roomKey" component={ChatPage} />
          <Route exact path="/call" component={CallPage} />
          <Route exact path="/team-space" component={TeamSpacePage} />
          <Route exact path="/notice" component={NoticePage} />
          <Route exact path="/netTest" component={NetTestPage} />
          <Route exact path="/funcTest" component={FuncTestPage} />
          <Route exact path="/funcTest2" component={FuncTestPage2} />
          <Route exact path="/chatTestPage" component={chatTestPage} />
          <Route exact path="/setting" component={SettingPage} />
          <Route component={NoMatchPage} />
        </Switch>
      </Suspense>
      {/* </ MyErrorBoundary> */}
    </HashRouter>
  );
}

if (!window.location.hash || window.location.hash === "#/") {
  writeDebug("location.hash `#/login");
  window.location.hash = `#/login`;
}

export default RouterPage;
