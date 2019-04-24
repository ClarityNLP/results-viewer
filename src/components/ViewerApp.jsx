import React, { Component } from 'react';
import Transient from './Transient';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Route, Switch } from 'react-router-dom';
import JobListContainer from '../containers/job_list_container';
import JobRunnerContainer from '../containers/runner_container';
import NavbarTop from './NavbarTop';
import Menu from './Menu';

library.add(faBars, faSpinner);

export default class ViewerApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMenuOpen: true
    };
  }

  handleSlideoutToggle = event => {
    this.setState(prevState => ({
      isMenuOpen: !prevState.isMenuOpen
    }));
  };

  render() {
    const { user } = this.props.oidc;

    if (user) {
      return (
        <React.Fragment>
          <Menu user={user} isMenuOpen={this.state.isMenuOpen} />
          <div id='viewer' className='App'>
            <NavbarTop toggle={this.handleSlideoutToggle} user={user} />
            <Switch>
              <Route path='/results' component={JobListContainer} />
              <Route path='/runner' component={JobRunnerContainer} />
              <Route path='' component={JobListContainer} />
            </Switch>
          </div>
        </React.Fragment>
      );
    }

    return <Transient />;
  }
}
