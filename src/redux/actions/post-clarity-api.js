import axios from "axios";
import { SET_NLPQL, SET_NLPQL_JSON, SET_POST_ERROR } from "./types";

export const postToClarityAPI = (action, nlpql) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios({
                method: "post",
                url: process.env.REACT_APP_CLARITY_NLP_URL + action,
                data: nlpql,
                headers: { "Content-Type": "text/plain" }
            })
                .then(response => {
                    if (action === "nlpql_expander") {
                        dispatch({
                            type: SET_NLPQL,
                            data: response.data
                        });
                    } else {
                        dispatch({
                            type: SET_NLPQL_JSON,
                            data: response.data
                        });
                    }
                    resolve(response.data);
                })
                .catch(err => {
                    dispatch({
                        type: SET_POST_ERROR,
                        data: err
                    });
                    reject(err);
                });
        });
    };
};
