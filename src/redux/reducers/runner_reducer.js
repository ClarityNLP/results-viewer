import * as types from "../actions/types";

const initialState = {
    nlpql: "",
    nlpql_JSON: null,
    nlpql_Error: null,
    posting: false,
    saving_nlqpl: false,
    nlpql_id: -1,
    saving_nlpql_erorr: null
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
                nlpql_JSON: action.data
            };
        case types.SETTING_NLPQL:
            return {
                ...state,
                posting: true
            };
        case types.SETTING_NLPQL_SUCCESS:
            return {
                ...state,
                posting: false,
                nlpql: action.payload.data
            };
        case types.SETTING_NLPQL_FAIL:
            return {
                ...state,
                posting: false,
                nlpql_Error: action.error
            };
        case types.SETTING_NLPQL_JSON:
            return {
                ...state,
                posting: true
            };
        case types.SETTING_NLPQL_JSON_SUCCESS:
            return {
                ...state,
                nlpql_JSON: action.payload.data,
                posting: false
            };
        case types.SETTING_NLPQL_JSON_FAIL:
            return {
                ...state,
                posting: false,
                nlpql_Error: action.error
            };
        case types.SAVING_NLPQL:
            return {
                ...state,
                saving_nlqpl: true
            };
        case types.SAVING_NLPQL_SUCCESS:
            return {
                ...state,
                saving_nlqpl: false,
                nlpql_id: action.payload.data
            };
        case types.SAVING_NLPQL_FAIL:
            return {
                ...state,
                saving_nlqpl: false,
                saving_nlpql_erorr: action.payload
            };
        default:
            return state;
    }
};

export { reducer };
