import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NavigationBar from './_Navigation/NavigationBar';
import Sidebar from './_Navigation/Sidebar';
import Bottombar from './_Navigation/Bottombar';

import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

// import { Home } from './Home';
// import { About } from './About';
// import { NoMatch } from './NoMatch';
const FavoritePage = React.lazy(() => import('./FavoritePage/FavoritePage'));
const LoginPage = React.lazy(() => import('./LoginPage/LoginPage'));
const AboutPage = React.lazy(() => import('./AboutPage/AboutPage'));
const NoMatchPage = React.lazy(() => import('./NoMatchPage/NoMatchPage'));
const SiteConfigPage = React.lazy(() => import('./SiteConfigPage/SiteConfigPage'));
const NetTestPage = React.lazy(() => import('./NetTestPage/NetTestPage'));


function RouterPage() {

  return (
    <React.Fragment>
      <Router>
        <NavigationBar />
        <Sidebar />
        {/* <Bottombar /> */}
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route exact path="/favorite" component={FavoritePage} />
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/about" component={AboutPage} />
            <Route exact path="/site-config" component={SiteConfigPage} />
            <Route exact path="/net-test" component={NetTestPage} />
            <Route component={NoMatchPage} />
          </Switch>
        </Suspense>
      </Router>
    </React.Fragment>
  );
}

export default RouterPage;