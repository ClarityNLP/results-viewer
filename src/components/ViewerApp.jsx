import React, { Component } from "react";
import Transient from "./Transient";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBars, faSpinner } from "@fortawesome/free-solid-svg-icons";
import NavbarTop from "../containers/navbar_top_container";
import AppRouter from "../routes/AppRouter";
import NavbarSide from "./NavbarSide";
import Slideout from "slideout";

library.add(faBars, faSpinner);

export default class ViewerApp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            slideout: null
        };
    }

    componentDidMount() {
        this.setState({
            slideout: new Slideout({
                panel: document.getElementById("viewer"),
                menu: document.getElementById("menu"),
                padding: 256,
                tolerance: 70
            })
        });
    }

    render() {
        const { user } = this.props.oidc;
        const { slideout } = this.state;

        if (!user) {
            return (
                <React.Fragment>
                    <NavbarSide />
                    <div id="viewer" className="App">
                        <NavbarTop slideout={slideout} />
                        <AppRouter />
                    </div>
                </React.Fragment>
            );
        }

        return <Transient />;
    }
}
