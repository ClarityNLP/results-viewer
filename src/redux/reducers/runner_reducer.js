import * as types from "../actions/types";

const initialState = {
    nlpql: "",
    nlpqlJSON: null,
    nlpqlError: ""
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_NLPQL:
            return {
                ...state,
                nlpql: action.data
            };
        case types.SET_NLPQL_JSON:
            return {
                ...state,
                nlpqlJSON: action.data
            };
        case types.SET_POST_ERROR:
            return {
                ...state,
                nlpqlError: action.data
            };
        default:
            return state;
    }
};

export { reducer };
