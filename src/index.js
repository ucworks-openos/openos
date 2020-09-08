import React from 'react';
import ReactDOM from 'react-dom';
import RouterPage from "./components/router";
import './assets/css/index.css';
import { CLIENT_RENEG_WINDOW } from 'tls';

const { remote } = window.require("electron")

//
// Dev Mode
if (remote.getGlobal('IS_DEV')) {
    sessionStorage.setItem('isLoginElectronApp', true)
}

ReactDOM.render(<RouterPage />, document.getElementById('root'));