import { connect } from "react-redux";
import { setNLPQL } from "../redux/actions/set-nlpql";
import { postToClarityAPI } from "../redux/actions/post-clarity-api";

import JobRunner from "../components/JobRunner";

function mapStateToProps(state) {
    return {
        runner: state.runner
    };
}

const JobRunnerContainer = connect(
    mapStateToProps,
    { postToClarityAPI, setNLPQL }
)(JobRunner);

export default JobRunnerContainer;
