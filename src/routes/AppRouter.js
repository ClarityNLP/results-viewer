import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import JobList from "../components/JobList";
import JobRunner from "../components/JobRunner";

const AppRouter = () => (
  <Router>
    <Switch>
      <Route path="/results" exact component={JobList} />
      <Route path="/runner" exact component={JobRunner} />
      <Route path="/" component={JobList} />
    </Switch>
  </Router>
);

export default AppRouter;
