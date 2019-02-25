import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withAlert } from "react-alert";
import userManager from "../utils/userManager";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class NavbarTop extends Component {
    handleLogout = () => {
        return userManager.signoutRedirect();
    };

    render() {
        const { slideout } = this.props;

        return (
            <nav className="navbar-sso navbar" aria-label="main navigation">
                <div className="navbar-brand">
                    <a
                        role="button"
                        onClick={() => slideout.toggle()}
                        className="hamburger navbar-item"
                    >
                        <FontAwesomeIcon icon="bars" className="sso-bars" />
                    </a>
                    <Link className="brandname navbar-item" to="/">
                        ClarityNLP
                    </Link>
                </div>

                <div id="navbarBasicExample" className="navbar-menu">
                    <div className="navbar-end">
                        <Link className="navbar-item" to="/runner">
                            NLPQL Runner
                        </Link>
                        <Link to="results" className="navbar-item">
                            Results Viewer
                        </Link>
                        {this.props.oidc.user && (
                            <div className="navbar-item has-dropdown is-hoverable">
                                <a className="navbar-link">
                                    <span>{`${
                                        this.props.oidc.user.profile.name
                                    }`}</span>
                                </a>

                                <div className="navbar-dropdown is-right">
                                    <a
                                        className="navbar-item"
                                        href="https://claritynlp.readthedocs.io/en/latest/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Documentation
                                    </a>
                                    <a
                                        className="navbar-item"
                                        href="https://github.com/ClarityNLP/ClarityNLP"
                                        target="_blank"
                                        rel="noopener noreferrer"
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
                        )}
                    </div>
                </div>
            </nav>
        );
    }
}

export default withAlert(NavbarTop);
