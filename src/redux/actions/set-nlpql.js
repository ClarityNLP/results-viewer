import { SET_NLPQL } from "./types";

export const setNLPQL = nlpql => {
    return {
        type: SET_NLPQL,
        data: nlpql
    };
};
