import React, { Component } from 'react';
import userManager from '../../utils/userManager';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class NavbarTop extends Component {
  handleLogout = () => {
    return userManager.signoutRedirect();
  };

  render() {
    return (
      <nav className='navbar-sso navbar' aria-label='main navigation'>
        <div className='navbar-brand'>
          <a
            role='button'
            onClick={e => this.props.toggle(e)}
            className='hamburger navbar-item'
          >
            <FontAwesomeIcon icon='bars' className='sso-bars' />
          </a>
          <a role='button' href='/' className='brandname navbar-item'>
            ClarityNLP
          </a>
        </div>

        <div className='navbar-menu'>
          <div className='navbar-end'>
            {this.props.user && (
              <div className='navbar-item has-dropdown is-hoverable'>
                <a className='navbar-link'>
                  <span>{`${this.props.user.profile.name}`}</span>
                </a>

                <div className='navbar-dropdown is-right'>
                  <a
                    className='navbar-item'
                    onClick={() => this.handleLogout()}
                  >
                    Logout
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    );
  }
}

export default NavbarTop;
