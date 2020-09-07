import React from 'react';
import ReactDOM from 'react-dom';
import RouterPage from "./components/router";
import './assets/css/index.css';
import { CLIENT_RENEG_WINDOW } from 'tls';

sessionStorage.setItem('isLoginElectronApp', true)

ReactDOM.render(<RouterPage />, document.getElementById('root'));