import React from "react";
import { Route } from "react-router-dom";

import JobList from "../components/JobList";
import JobRunnerContainer from "../containers/runner_container";

const AppRouter = () => (
    <React.Fragment>
        <Route path="/results" component={JobList} />
        <Route path="/runner" component={JobRunnerContainer} />
    </React.Fragment>
);

export default AppRouter;
