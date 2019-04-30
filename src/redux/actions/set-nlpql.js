import { SET_NLPQL } from "./types";

export const setNLPQL = nlpql => dispatch => {
    return new Promise((resolve, reject) => {
        dispatch({
            type: SET_NLPQL,
            data: nlpql
        });
        resolve();
    });
};
