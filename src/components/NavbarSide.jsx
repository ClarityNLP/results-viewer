import React, { Component } from "react";

export default class NavbarSide extends Component {
    render() {
        return (
            <nav id="menu">
                <nav
                    className="navbar navbar-shadow"
                    aria-label="main navigation"
                >
                    <div className="navbar-brand">
                        <h1 className="navbar-item menu-title">Menu</h1>
                    </div>
                </nav>
                <div className="menu-body">
                    <h2 className="menu-body-title">Applications</h2>
                    <ul>
                        <li className="active">
                            <a className="menu-body-item-text">
                                Results Viewer
                            </a>
                        </li>
                        <li>
                            <a
                                href="http://localhost:8500/csv"
                                className="menu-body-item-text"
                            >
                                Ingestion
                            </a>
                        </li>
                        <li>
                            <a className="menu-body-item-text">
                                Report Type Mapper
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}
