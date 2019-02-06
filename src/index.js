import React from "react";
import registerServiceWorker from "./registerServiceWorker";
import ReactDOM from "react-dom";
import axios from "axios";
import { loadUser } from "redux-oidc";
import userManager from "./utils/userManager";
import configureStore from "./redux/store/store";
import { createBrowserHistory } from "history";

import App from "./App";
import "./style/style.scss";

registerServiceWorker();

const history = createBrowserHistory();

const initialState = {};

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_CLARITY_NLP_URL,
    responseType: "json"
});

const store = configureStore(initialState, apiClient, history);
loadUser(store, userManager);

ReactDOM.render(
    <App store={store} history={history} />,
    document.getElementById("root")
);
