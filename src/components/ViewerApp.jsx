import React, { Component } from "react";
import Transient from "./Transient";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBars, faSpinner } from "@fortawesome/free-solid-svg-icons";
import AppRouter from "../routes/AppRouter";
import Navbar from "./Navbar";

library.add(faBars, faSpinner);

export default class ViewerApp extends Component {
    render() {
        const { user } = this.props.oidc;

        if (!user) {
            return (
                <React.Fragment>
                    <Navbar />
                    <div id="viewer" className="App">
                        <AppRouter />
                    </div>
                </React.Fragment>
            );
        }

        return <Transient />;
    }
}
