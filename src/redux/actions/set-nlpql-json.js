import { SET_NLPQL_JSON } from "./types";

export const setNLPQLJSON = json => {
    return {
        type: SET_NLPQL_JSON,
        data: json
    };
};
