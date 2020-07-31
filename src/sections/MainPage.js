import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { NavigationBar } from '../components/navigation/NavigationBar';
import Sidebar from '../components/navigation/Sidebar';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';


// import { Home } from './Home';
// import { About } from './About';
// import { NoMatch } from './NoMatch';
const HomePage = React.lazy(() => import('./HomePage'));
const AboutPage = React.lazy(() => import('./AboutPage'));
const NoMatchPage = React.lazy(() => import('./NoMatchPage'));
const SiteConfigPage = React.lazy(() => import('./SiteConfigPage'));
const NetTestPage = React.lazy(() => import('./NetTestPage'));


function MainPage() {

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

export default MainPage;