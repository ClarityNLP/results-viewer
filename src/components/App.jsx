import React, { Component } from 'react';
import NavbarTop from '../containers/navbar_top_container'
import logo from '../gtri.png';
import '../App.css';
import JobList from "./JobList";
import JobRunner from "./JobRunner";
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import {
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem } from 'reactstrap';
import { FaCog } from 'react-icons/fa';
import Slideout from 'slideout';

// https://html-online.com/articles/get-url-parameters-javascript/
function getUrlVars() {
    let vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

export default class App extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.setMode = this.setMode.bind(this);
        this.params = getUrlVars();
        let job_id = null;
        if ('job' in this.params) {
            job_id = this.params['job']
        }
        if ('job_id' in this.params) {
            job_id = this.params['job_id']
        }
        this.state = {
            isOpen: false,
            mode: 'results',
            job: job_id
        };
    }

    handleSlideoutToggle = (event) => {
      this.slideout.toggle();
    }

    componentDidMount() {
      this.slideout = new Slideout({
        'panel': document.getElementById('viewer'),
        'menu': document.getElementById('menu'),
        'padding': 256,
        'tolerance': 70
      });
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    setMode(mode) {
        this.setState({
            'mode': mode,
            'collapsed': true
        })
    }


  render() {
    let main = <div />;
    console.log(process.env);
    if (this.state.mode === 'results') {
        main = <JobList url={process.env.REACT_APP_CLARITY_NLP_URL} luigi={process.env.REACT_APP_LUIGI_URL} job={this.state.job}/>;
    } else if (this.state.mode === 'runner') {
        main = <JobRunner url={process.env.REACT_APP_CLARITY_NLP_URL}/>;
    }
    return (
      <React.Fragment>
        <nav id="menu">
          <nav className="navbar navbar-shadow" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
              <h1 className="navbar-item menu-title">Menu</h1>
            </div>
          </nav>
          <div className="menu-body">
            <h2 className="menu-body-title">Applications</h2>
            <ul>
              <li className="active">
                <a className="menu-body-item-text">Results Viewer</a>
              </li>
              <li>
                <a href="http://localhost:8500/csv" className="menu-body-item-text">Ingestion</a>
              </li>
              <li>
                <a className="menu-body-item-text">Report Type Mapper</a>
              </li>
            </ul>
          </div>
        </nav>
        <div id="viewer" className="App">
          <NavbarTop
            toggle={this.handleSlideoutToggle}
            setMode={this.setMode}
          />
          <div className="App-intro container-fluid">
            {main}
          </div>
        </div>
      </React.Fragment>
    );
  }
}
