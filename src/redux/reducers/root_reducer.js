import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import { reducer as oidcReducer } from "redux-oidc";
import { reducer as runnerReducer } from "./runner_reducer";

export default history =>
    combineReducers({
        router: connectRouter(history),
        oidc: oidcReducer,
        runner: runnerReducer
    });
