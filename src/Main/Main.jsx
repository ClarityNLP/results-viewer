import React, { Component } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Route, Switch } from 'react-router-dom';
import Transient from './Transient';
import Menu from './Menu';
import NavbarTop from './NavbarTop';
import JobList from './JobList';
import QueryBuilder from './QueryBuilder';

library.add(faBars, faSpinner);

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMenuOpen: true
    };
  }

  handleSlideoutToggle = () => {
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
              <Route path='/results' component={JobList} />
              <Route path='/runner' component={QueryBuilder} />
              <Route path='' component={JobList} />
            </Switch>
          </div>
        </React.Fragment>
      );
    }

    return <Transient />;
  }
}
