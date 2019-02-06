import { SETTING_NLPQL, SETTING_NLPQL_JSON } from "./types";

export function postToClarityAPI(action, nlpql) {
    if (action === "nlpql_expander") {
        return {
            type: SETTING_NLPQL,
            payload: {
                request: {
                    url: action,
                    method: "post",
                    responseType: "text",
                    data: nlpql,
                    headers: { "Content-Type": "text/plain" }
                }
            }
        };
    }

    return {
        type: SETTING_NLPQL_JSON,
        payload: {
            request: {
                url: action,
                method: "post",
                data: nlpql,
                headers: { "Content-Type": "text/plain" }
            }
        }
    };
}
