import React, { Suspense } from 'react';

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// import { Home } from './Home';
// import { About } from './About';
// import { NoMatch } from './NoMatch';


import { NavigationBar } from '../components/navigation/NavigationBar';
import Sidebar from '../components/navigation/Sidebar';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

const Home = React.lazy(() => import('./Home'));
const About = React.lazy(() => import('./About'));
const NoMatch = React.lazy(() => import('./NoMatch'));
const SiteConfig = React.lazy(() => import('./SiteConfig'));


function Main() {

  return (
    <React.Fragment>
      <Router>
        <NavigationBar />
        <Sidebar />
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/site-config" component={SiteConfig} />
            <Route component={NoMatch} />
          </Switch>
        </Suspense>
      </Router>
    </React.Fragment>
  );
}

export default Main;