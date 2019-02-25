import React from "react";
import { Route, Switch } from "react-router-dom";

import JobList from "../components/JobList";
import JobRunnerContainer from "../containers/runner_container";

const AppRouter = () => (
    <Switch>
        <Route path="/results" component={JobList} />
        <Route path="/runner" component={JobRunnerContainer} />
        <Route path="" component={JobList} />
    </Switch>
);

export default AppRouter;
