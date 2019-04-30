import {
  applyMiddleware,
  compose,
  createStore
} from "redux";

import { routerMiddleware } from "connected-react-router";
import createRootReducer from "../reducers/root_reducer";
import axiosMiddleware from "redux-axios-middleware";

// MIDDLEWARES
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";
import createSagaMiddleware from "redux-saga";
import { redirectToODICSaga } from "../../utils/sagas";

const logger = createLogger();
const sagaMiddleware = createSagaMiddleware();
const axiosMiddlewareOptions = {
  interceptors: {
    request: [
      (state, config) => {
        if (state.getState().oidc.user) {
          config.headers['Authorization'] = 'Bearer ' + state.getState().oidc.user.access_token
        }
        return config
      }
    ]
  }
}

export default function configureStore(initialState, apiClient, history) {
    const store = createStore(
        createRootReducer(history),
        initialState,
        compose(
            applyMiddleware(
                sagaMiddleware,
                routerMiddleware(history),
                thunk,
                axiosMiddleware(apiClient, axiosMiddlewareOptions),
                logger
            )
        )
    );

    sagaMiddleware.run(redirectToODICSaga);

    return store;
}
