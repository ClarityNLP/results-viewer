import React, { Component } from "react";
import Slideout from "slideout";

export default class NavbarSide extends Component {
    componentDidMount() {
        window.slideout = new Slideout({
            panel: document.getElementById("viewer"),
            menu: document.getElementById("menu"),
            padding: 256,
            tolerance: 70
        });
    }

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
