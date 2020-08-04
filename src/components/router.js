import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { NavigationBar } from './Navigation/NavigationBar';
import Sidebar from './Navigation/Sidebar';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';


// import { Home } from './Home';
// import { About } from './About';
// import { NoMatch } from './NoMatch';
const HomePage = React.lazy(() => import('./HomePage/HomePage'));
const AboutPage = React.lazy(() => import('./AboutPage/AboutPage'));
const NoMatchPage = React.lazy(() => import('./NoMatchPage/NoMatchPage'));
const SiteConfigPage = React.lazy(() => import('./Navigation/SiteConfigPage'));
const NetTestPage = React.lazy(() => import('./Navigation/NetTestPage'));


function RouterPage() {

  return (
    <React.Fragment>
      <Router>
        <NavigationBar />
        <Sidebar />
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/about" component={AboutPage} />
            <Route path="/site-config" component={SiteConfigPage} />
            <Route path="/net-test" component={NetTestPage} />
            <Route component={NoMatchPage} />
          </Switch>
        </Suspense>
      </Router>
    </React.Fragment>
  );
}

export default RouterPage;