import React, { Component } from 'react';
import {
  FaCubes,
  FaPoll,
  FaFolder,
  FaChartBar,
  FaCog,
  FaBookOpen
} from "react-icons/fa";

export default class Menu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      builderActive: false,
      resultsActive: false,
    };
  }

  componentDidMount() {
    const url = window.location.href;

    if (url.indexOf("/runner") > 0) {
      this.setState({
        resultsActive: false,
        builderActive: true,
      });
    } else {
      this.setState({
        resultsActive: true,
        builderActive: false,
      });
    }
  }

  render() {
    const {
      REACT_APP_DASHBOARD_URL,
      REACT_APP_INGEST_URL,
      REACT_APP_DOCUMETATION_URL,
    } = window._env_;

    const { builderActive, resultsActive } = this.state;

    return (
      <React.Fragment>
        <nav id="menu" className={ this.props.isMenuOpen ? 'open' : ''}>
          <div className="nav-links">
            <a href={`http://${REACT_APP_DASHBOARD_URL}`} className="nav-link has-text-centered">
              <span className="link-icon is-size-4">
                <FaPoll/>
              </span>
              Dashboard
            </a>
            <a href={`http://${REACT_APP_INGEST_URL}`} className="nav-link has-text-centered">
              <span className="link-icon is-size-4">
                <FaFolder/>
              </span>
              Documents
            </a>
            <a href="/runner" className={`nav-link has-text-centered ${builderActive ? "active" : ""}`}>
              <span className="link-icon is-size-4">
                <FaCubes/>
              </span>
              Query Builder
            </a>
            <a href="/" className={`nav-link has-text-centered ${resultsActive ? "active" : ""}`}>
              <span className="link-icon is-size-4">
                <FaChartBar/>
              </span>
              Results
            </a>
            <a href={REACT_APP_DOCUMETATION_URL} className="nav-link has-text-centered">
              <span className="link-icon is-size-4">
                <FaBookOpen/>
              </span>
              Documentation
            </a>
          </div>
        </nav>
      </React.Fragment>
    )
  }
}
