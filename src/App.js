import React, { Component } from "react";

import logo from "./gtri.png";
import "./App.css";
import { FaCog } from "react-icons/fa";

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

import AppRouter from "./routes/AppRouter";

class App extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);

    this.state = {
      isOpen: false
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return (
      <div className="App">
        <Navbar expand="md" className="App-header" dark>
          <NavbarBrand href="/" className="mr-auto">
            <img src={logo} className="App-logo" alt="logo" />{" "}
            <div className="App-name">ClarityNLP</div>
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink className="NavLink" href="/runner">
                  NLPQL Runner
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="NavLink" href="/results">
                  Results Viewer
                </NavLink>
              </NavItem>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  <FaCog />
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem
                    href="https://claritynlp.readthedocs.io/en/latest/"
                    target="_blank"
                  >
                    Documentation
                  </DropdownItem>
                  <DropdownItem
                    href="https://github.com/ClarityNLP/ClarityNLP"
                    target="_blank"
                  >
                    GitHub
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Navbar>

        <AppRouter />
      </div>
    );
  }
}

export default App;
