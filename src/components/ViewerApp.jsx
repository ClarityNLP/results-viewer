import React, { Component } from "react";

import "../App.css";

import Transient from "./Transient";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBars, faSpinner } from "@fortawesome/free-solid-svg-icons";

import NavbarTop from "../containers/navbar_top_container";
import AppRouter from "../routes/AppRouter";
import NavbarSide from "./NavbarSide";

library.add(faBars, faSpinner);

export default class ViewerApp extends Component {
    render() {
        const { user } = this.props.oidc;

        if (!user) {
            return (
                <React.Fragment>
                    <NavbarSide />
                    <div id="viewer" className="App">
                        <NavbarTop />
                        <AppRouter />
                    </div>
                </React.Fragment>
            );
        }

        return <Transient />;
    }
}
