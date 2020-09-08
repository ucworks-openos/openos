import React from 'react';
import ReactDOM from 'react-dom';
import RouterPage from "./components/router";
import './assets/css/index.css';
import { CLIENT_RENEG_WINDOW } from 'tls';
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "./reducer";

<<<<<<< HEAD
import Reducer from './redux/reducers';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise';
import ReduxThunk from 'redux-thunk';

const createStoreWithMiddleware = applyMiddleware(promiseMiddleware, ReduxThunk)(createStore);

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
// Dev Mode
//sessionStorage.setItem('isLoginElectronApp', true)
=======
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
>>>>>>> upstream/master
