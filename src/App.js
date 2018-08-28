import React, { Component } from 'react';
import logo from './gtri.png';
import './App.css';
import JobList from "./components/JobList";
import JobRunner from "./components/JobRunner";
import AllJobList from "./components/AllJobList";
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

// https://html-online.com/articles/get-url-parameters-javascript/
function getUrlVars() {
    let vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

class App extends Component {
    constructor(props) {
        super(props);
        this.toggleNavbar = this.toggleNavbar.bind(this);
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
            collapsed: true,
            mode: 'results',
            job: job_id
        };
    }

    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed
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
    if (this.state.mode === 'results') {
        main = <JobList url={process.env.REACT_APP_CLARITY_NLP_URL} job={this.state.job}/>;
    } else if (this.state.mode === 'runner') {
        main = <JobRunner url={process.env.REACT_APP_CLARITY_NLP_URL}/>;
    } else if (this.state.mode === 'all_jobs') {
        main = <AllJobList url={process.env.REACT_APP_CLARITY_NLP_URL} />;
    }
    return (
      <div className="App">

          <Navbar className="App-header" dark>
              <NavbarBrand href="/" className="mr-auto"><img src={logo} className="App-logo" alt="logo" /> <div className="App-name">ClarityNLP</div></NavbarBrand>
              <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
              <Collapse isOpen={!this.state.collapsed} navbar>
                  <Nav navbar>
                      <NavItem>
                          <NavLink className="NavLink" onClick={() => this.setMode('results')}>Results Viewer</NavLink>
                      </NavItem>
                      <NavItem>
                          <NavLink className="NavLink" onClick={() => this.setMode('all_jobs')}>Job Status</NavLink>
                      </NavItem>
                      <NavItem>
                          <NavLink className="NavLink"  onClick={() => this.setMode('runner')}>NLPQL Runner</NavLink>
                      </NavItem>
                      <NavItem>
                          <NavLink href="https://github.com/ClarityNLP/ClarityNLP" target="_blank"
                                   onClick={() => {this.setState({collapsed: true})}}>
                            ClarityNLP GitHub</NavLink>
                      </NavItem>
                      <NavItem>
                          <NavLink href="https://claritynlp.readthedocs.io/en/latest/" target="_blank"
                                   onClick={() => {this.setState({collapsed: true})}}>
                              ClarityNLP Documentation</NavLink>
                      </NavItem>
                  </Nav>
              </Collapse>
          </Navbar>
        <div className="App-intro container-fluid">
            {main}
        </div>
      </div>
    );
  }
}

export default App;
