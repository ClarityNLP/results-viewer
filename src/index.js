import React from 'react';
// import registerServiceWorker from './registerServiceWorker';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { loadUser } from 'redux-oidc';
import userManager from './utils/userManager';
import configureStore from './redux/store/store';
import { createBrowserHistory } from 'history';
import App from './App';
import './style/style.scss';

// registerServiceWorker(); //TODO causing issue on USER_EXPIRED

const history = createBrowserHistory({
  basename: process.env.PUBLIC_URL
});

const initialState = {};

const apiClient = axios.create({
  baseURL: `${window.location.protocol}//${window._env_.API_HOST}`,
  responseType: 'json',
  withCredentials: true
});

const store = configureStore(initialState, apiClient, history);
loadUser(store, userManager);

ReactDOM.render(
  <App store={store} history={history} />,
  document.getElementById('root')
);
