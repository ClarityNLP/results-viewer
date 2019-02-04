import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import { withAlert } from 'react-alert';
import userManager from "../utils/userManager";
import { push } from 'connected-react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Slideout from 'slideout';

class NavbarTop extends Component {

  constructor(props) {
    super(props);
  }

  handleLogout = () => {
    return userManager.signoutRedirect();
  }

  render() {
    return (
      <nav className="navbar-sso navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <a role="button"  onClick={(e) => this.props.toggle(e)} className="hamburger navbar-item">
            <FontAwesomeIcon
              icon="bars"
              className="sso-bars"
            />
          </a>
          <a role="button" href="/" className="brandname navbar-item">ClarityNLP</a>
        </div>

        <div id="navbarBasicExample" className="navbar-menu">

          <div className="navbar-end">
            <a
              className="navbar-item"
              onClick={() => this.props.setMode('runner')}
            >
              NLPQL Runner
            </a>
            <a
              className="navbar-item"
              onClick={() => this.props.setMode('results')}
            >
              Results Viewer
            </a>
            { this.props.oidc.user &&
              <div className="navbar-item has-dropdown is-hoverable">
                <a className="navbar-link">
                  <span>{`${this.props.oidc.user.profile.name}`}</span>
                </a>

                <div className="navbar-dropdown is-right">
                  <a
                    className="navbar-item"
                    href="https://claritynlp.readthedocs.io/en/latest/"
                    target="_blank"
                  >
                    Documentation
                  </a>
                  <a
                    className="navbar-item"
                    href="https://github.com/ClarityNLP/ClarityNLP"
                    target="_blank"
                  >
                    GitHub
                  </a>
                  <a
                    className="navbar-item"
                    onClick={() => this.handleLogout()}
                  >
                    Logout
                  </a>
                </div>
              </div>
            }
          </div>
        </div>
      </nav>
    )
  }
}

export default withAlert(NavbarTop)
