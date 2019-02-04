/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from "react";
import Select from "react-select";

import SubmitButton from "../../UIkit/SubmitButton";

import plus from "../../assets/icons/svg/plus.svg";
import minus from "../../assets/icons/svg/minus.svg";

const initialState = {
    icon: plus,
    collapse: true,
    logicalContext: { value: "Patient", label: "Patient" }
};

class LogicalContextForm extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = initialState;
    }

    toggle = () => {
        const { icon } = this.state;
        let tmp = null;

        if (icon === plus) {
            tmp = minus;
        } else {
            tmp = plus;
        }

        this.setState({
            collapse: !this.state.collapse,
            icon: tmp
        });
    };

    handleInputChange(value) {
        this.setState({
            logicalContext: value
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        const { logicalContext } = this.state;

        let text = "context " + logicalContext.value + ";\n\n";

        this.props.updateNLPQL(text);
        this.toggle();
        this.setState(initialState);
    }

    render() {
        const { icon, collapse, logicalContext } = this.state;

        return (
            <div>
                <header className="card-header" onClick={this.toggle}>
                    <p className="card-header-title">Logical Context</p>
                    <a
                        href="#"
                        className="card-header-icon"
                        aria-label="more options"
                    >
                        <span className="icon">
                            <img height="16px" src={icon} alt="" />
                        </span>
                    </a>
                </header>
                <div
                    className={
                        collapse ? "card-content hidden" : "card-content"
                    }
                >
                    <form>
                        <div className="field">
                            <label className="label" for="logicalContext">
                                Logical Context
                            </label>
                            <Select
                                value={logicalContext}
                                onChange={this.handleInputChange}
                                options={[
                                    {
                                        value: "Patient",
                                        label: "Patient"
                                    },
                                    {
                                        value: "Document",
                                        label: "Document"
                                    }
                                ]}
                            />
                        </div>

                        <SubmitButton
                            handleSubmit={this.handleSubmit}
                            label="Add Logical Context"
                        />
                    </form>
                </div>
            </div>
        );
    }
}

export default LogicalContextForm;
