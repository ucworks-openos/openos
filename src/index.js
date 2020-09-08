import React from 'react';
import ReactDOM from 'react-dom';
import RouterPage from "./components/router";
import './assets/css/index.css';
import { CLIENT_RENEG_WINDOW } from 'tls';
import Reducer from './reducer';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise';
import ReduxThunk from 'redux-thunk';

const { remote } = window.require("electron")
const createStoreWithMiddleware = applyMiddleware(promiseMiddleware, ReduxThunk)(createStore);


// Dev Mode
if (remote.getGlobal('IS_DEV')) {
    sessionStorage.setItem('isLoginElectronApp', true)
}

ReactDOM.render(
    <Provider
        store={createStoreWithMiddleware(
            Reducer,
            window.__REDUX_DEVTOOLS_EXTENSION__ &&
            window.__REDUX_DEVTOOLS_EXTENSION__()
        )}
    >
        <RouterPage />
    </Provider>
    , document.getElementById('root'));



