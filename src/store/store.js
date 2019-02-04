import { applyMiddleware, compose, createStore } from "redux";

import { routerMiddleware } from "connected-react-router";
import createRootReducer from "../reducers/root_reducer";
import axios from "axios";
import axiosMiddleware from "redux-axios-middleware";
import userManager from "../utils/userManager";

// MIDDLEWARES
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";
import createSagaMiddleware from "redux-saga";
import { redirectToODICSaga } from "../utils/sagas";

const logger = createLogger();
const sagaMiddleware = createSagaMiddleware();

export default function configureStore(initialState, apiClient, history) {
  const store = createStore(
    createRootReducer(history),
    initialState,
    compose(
      applyMiddleware(
        sagaMiddleware,
        routerMiddleware(history),
        thunk,
        axiosMiddleware(apiClient),
        logger
      )
    )
  );

  sagaMiddleware.run(redirectToODICSaga);

  return store;
}
