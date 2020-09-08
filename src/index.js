import React from 'react';
import ReactDOM from 'react-dom';
import RouterPage from "./components/router";
import './assets/css/index.css';
import { CLIENT_RENEG_WINDOW } from 'tls';
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "./reducer";

const store = createStore(rootReducer);
const { remote } = window.require("electron")

//
// Dev Mode
if (remote.getGlobal('IS_DEV')) {
    sessionStorage.setItem('isLoginElectronApp', true)
}

ReactDOM.render(
    <Provider store={store}>
        <RouterPage />
    </Provider>,
    document.getElementById('root'));