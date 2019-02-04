import React from "react";
import { Route } from "react-router-dom";

import JobList from "../components/JobList";
import JobRunner from "../components/JobRunner";

const AppRouter = () => (
  <React.Fragment>
    <Route path="/results" component={JobList} />
    <Route path="/runner" component={JobRunner} />
  </React.Fragment>
);

export default AppRouter;
