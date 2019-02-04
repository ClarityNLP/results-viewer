import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import React from "react";
import ReactDOM from "react-dom";
import "./style/style.scss";
import axios from "axios";
import { loadUser } from "redux-oidc";
import userManager from "./utils/userManager";
import configureStore from "./store/store";
import { createBrowserHistory } from "history";

registerServiceWorker();

const history = createBrowserHistory();

const initialState = {};

const apiClient = axios.create({
  baseURL: "http://localhost:5003",
  responseType: "json",
  withCredentials: true
});

const store = configureStore(initialState, apiClient, history);
loadUser(store, userManager);

ReactDOM.render(
  <App store={store} history={history} />,
  document.getElementById("root")
);
