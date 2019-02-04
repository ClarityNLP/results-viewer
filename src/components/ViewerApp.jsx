import React, { Component } from 'react';
import App from '../containers/app_container';
import Transient from './Transient';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars, faSpinner } from '@fortawesome/free-solid-svg-icons';
library.add(faBars, faSpinner);

export default class ViewerApp extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        {this.props.oidc.user ? <App/> : <Transient/>}
      </React.Fragment>
    )
  }
}
