import React, { Component } from 'react';
import {
  FaCubes,
  FaPoll,
  FaFolder,
  FaChartBar,
  FaBookOpen
} from 'react-icons/fa';

export default class Menu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      builderActive: false,
      resultsActive: false
    };
  }

  render() {
    const {
      REACT_APP_DASHBOARD_URL,
      REACT_APP_INGEST_URL,
      REACT_APP_DOCUMETATION_URL
    } = window._env_;

    const { builderActive, resultsActive } = this.state;

    return (
      <React.Fragment>
        <nav id='menu' className={this.props.isMenuOpen ? 'open' : ''}>
          <div className='nav-links'>
            <a
              href={`https://${REACT_APP_DASHBOARD_URL}`}
              className='nav-link has-text-centered'
            >
              <span className='link-icon is-size-4'>
                <FaPoll />
              </span>
              Dashboard
            </a>
            <a
              href={`https://${REACT_APP_INGEST_URL}`}
              className='nav-link has-text-centered'
            >
              <span className='link-icon is-size-4'>
                <FaFolder />
              </span>
              Documents
            </a>
            <a
              href='/runner'
              className='nav-link has-text-centered builder-link'
            >
              <span className='link-icon is-size-4'>
                <FaCubes />
              </span>
              Query Builder
            </a>
            <a href='/' className='nav-link has-text-centered results-link'>
              <span className='link-icon is-size-4'>
                <FaChartBar />
              </span>
              Results
            </a>
            <a
              href={REACT_APP_DOCUMETATION_URL}
              className='nav-link has-text-centered'
            >
              <span className='link-icon is-size-4'>
                <FaBookOpen />
              </span>
              Documentation
            </a>
          </div>
        </nav>
      </React.Fragment>
    );
  }
}
