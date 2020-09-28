import React, { Suspense } from "react";
import {
  Route,
  Switch,
  HashRouter,
} from "react-router-dom";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";

const Sidebar = React.lazy(() => import("./__Navigation/SideNavi/SideNavi"));
const NavigationBar = React.lazy(() => import("./__Navigation/HeaderNavi/HeaderNavi"));

const LoginPage = React.lazy(() => import("./LoginPage/LoginPage"));
const FavoritePage = React.lazy(() => import("./FavoritePage/FavoritePage"));
const OrganizationPage = React.lazy(() => import("./OrganizationPage/OrganizationPage"));
const MessagePage = React.lazy(() => import("./MessagePage/MessagePage"));
const ChatPage = React.lazy(() => import("./ChatPage/ChatPage"));
const SiteConfigPage = React.lazy(() => import("./SiteConfigPage/SiteConfigPage"));
const AboutPage = React.lazy(() => import("./AboutPage/AboutPage"));
const NoMatchPage = React.lazy(() => import("./NoMatchPage/NoMatchPage"));
const NetTestPage = React.lazy(() => import("./TestPages/NetTestPage"));
const FuncTestPage = React.lazy(() => import("./TestPages/FuncTestPage"));
const FuncTestPage2 = React.lazy(() => import("./TestPages/FuncTestPage2"));
const chatTestPage = React.lazy(() => import("./TestPages/ChatTestPage"));
const TeamSpacePage = React.lazy(() => import("./TeamSpacePage/TeamSpacePage"));

function RouterPage() {
  return (
    <HashRouter>
      {/* <MyErrorBoundary> */}
      <Suspense fallback={<div>Loading...</div>}>
        {sessionStorage.getItem("isLoginElectronApp") && (<>{" "} <NavigationBar /> <Sidebar />{" "}</>)}
        <Switch>
          <Route exact path="/" component={LoginPage} />
          <Route exact path="/favorite" component={FavoritePage} />
          <Route exact path="/organization" component={OrganizationPage} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/about" component={AboutPage} />
          <Route exact path="/message" component={MessagePage} />
          <Route exact path="/chat" component={ChatPage} />
          <Route exact path="/chat/:roomKey/:members" component={ChatPage} />
          <Route exact path="/chat/:roomKey/:members/:message" component={ChatPage} />
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
  window.location.hash = "#/login";
}

export default RouterPage;
