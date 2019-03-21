import React, { Component } from "react";
import {
    FaCubes,
    FaPoll,
    FaFolder,
    FaChartBar,
    FaCog,
    FaBookOpen
} from "react-icons/fa";

export default class Navbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            builderActive: false,
            resultsActive: false
        };
    }

    componentDidMount() {
        const url = window.location.href;

        console.log(url.indexOf("/runner"));

        if (url.indexOf("/runner") > 0) {
            this.setState({
                resultsActive: false,
                builderActive: true
            });
        } else {
            this.setState({
                resultsActive: true,
                builderActive: false
            });
        }
    }

    render() {
        const {
            REACT_APP_DASHBOARD_URL,
            REACT_APP_INGEST_URL,
            REACT_APP_DOCUMETATION_URL
        } = process.env;
        const { builderActive, resultsActive } = this.state;

        return (
            <React.Fragment>
                <nav className="top_nav navbar">
                    <div className="navbar-brand">
                        <div className="navbar-item">
                            <h4 className="is-size-4">ClarityNLP</h4>
                        </div>
                    </div>
                    <div className="navbar-menu">
                        <div className="navbar-start" />
                        <div className="navbar-end">
                            <div className="navbar-item">
                                <a href="/">
                                    <FaCog />
                                </a>
                            </div>
                        </div>
                    </div>
                </nav>
                <nav className="side_nav">
                    <div className="nav-links">
                        <a
                            href={REACT_APP_DASHBOARD_URL}
                            className="nav-link has-text-centered"
                        >
                            <span className="link-icon is-size-4">
                                <FaPoll />
                            </span>
                            Dashboard
                        </a>
                        <a
                            href={REACT_APP_INGEST_URL}
                            className="nav-link has-text-centered"
                        >
                            <span className="link-icon is-size-4">
                                <FaFolder />
                            </span>
                            Documents
                        </a>
                        <a
                            href="/runner"
                            className={
                                builderActive
                                    ? "nav-link has-text-centered active"
                                    : "nav-link has-text-centered"
                            }
                        >
                            <span className="link-icon is-size-4">
                                <FaCubes />
                            </span>
                            Query Builder
                        </a>
                        <a
                            href="/"
                            className={
                                resultsActive
                                    ? "nav-link has-text-centered active"
                                    : "nav-link has-text-centered"
                            }
                        >
                            <span className="link-icon is-size-4">
                                <FaChartBar />
                            </span>
                            Results
                        </a>
                        <a
                            href={REACT_APP_DOCUMETATION_URL}
                            className="nav-link has-text-centered"
                        >
                            <span className="link-icon is-size-4">
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
