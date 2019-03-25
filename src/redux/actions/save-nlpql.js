import { SAVING_NLPQL } from "./types";

export function saveNLPQL(nlpql) {
    return {
        type: SAVING_NLPQL,
        payload: {
            request: {
                url: "api/nlp/add_query",
                method: "post",
                data: nlpql,
                headers: {
                    "Content-Type": "text/plain"
                }
            }
        }
    };
}
