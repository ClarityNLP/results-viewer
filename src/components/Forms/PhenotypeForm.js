import React from "react";

import SubmitButton from "../../UIkit/SubmitButton";

const initialState = {
    isOpen: "",
    name: "",
    version: "",
    limit: "",
    validation: {
        name: "",
        version: "",
        limit: ""
    }
};

class PhenotypeForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = initialState;
    }

    componentDidMount() {
        this.toggle();
    }

    toggle = () => {
        let htmlClasses = document.getElementsByTagName("html")[0].classList;

        if (htmlClasses.contains("is-clipped")) {
            htmlClasses.remove("is-clipped");
        } else {
            htmlClasses.add("is-clipped");
        }

        let openClass = this.state.isOpen !== "" ? "" : "is-active";

        this.setState({
            isOpen: openClass
        });
    };

    handleInputChange = event => {
        const target = event.target;
        let value = target.value;
        const name = target.name;
        let isValid = value.trim() !== "" ? "is-valid" : "is-invalid";

        this.setState({
            [name]: value,
            validation: {
                ...this.state.validation,
                [name]: isValid
            }
        });
    };

    allInputsAreValid = () => {
        const { validation } = this.state;

        let allValidInputs = true;
        let validCheck = {
            name: "",
            version: ""
        };

        if (validation.name !== "is-valid") {
            validCheck.name = "is-invalid";
            allValidInputs = false;
        } else {
            validCheck.name = "is-valid";
        }

        if (validation.version !== "is-valid") {
            validCheck.version = "is-invalid";
            allValidInputs = false;
        } else {
            validCheck.version = "is-valid";
        }

        this.setState({
            validation: validCheck
        });

        return allValidInputs;
    };

    handleSubmit = event => {
        event.preventDefault();

        const { name, version, limit } = this.state;
        let valid = this.allInputsAreValid();
        let text = "";

        if (!valid) {
            return;
        }

        if (limit) {
            text += "limit " + limit + ";\n\n";
        }

        text +=
            'phenotype "' +
            name +
            '" version "' +
            version +
            '";\n\n' +
            'include ClarityCore version "1.0" called Clarity;\n\n';

        this.props.updateNLPQL(text);
        this.toggle();
        this.setState(initialState);
    };

    render() {
        const { isOpen, name, version, validation } = this.state;

        return (
            <div className={"modal " + isOpen}>
                <div className="modal-background" />
                <div className="modal-content">
                    <div className="box">
                        {/* NAME INPUT */}
                        <div className="field">
                            <label className="label">Phenotype Name</label>
                            <input
                                className={"input " + validation.name}
                                type="text"
                                name="name"
                                value={name}
                                onChange={this.handleInputChange}
                            />
                        </div>

                        {/* VERSION INPUT */}
                        <div className="field">
                            <label className="label">Phenotype Version</label>
                            <input
                                className={"input " + validation.version}
                                type="text"
                                name="version"
                                value={version}
                                onChange={this.handleInputChange}
                            />
                        </div>

                        <SubmitButton
                            handleSubmit={this.handleSubmit}
                            label="Build Query"
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default PhenotypeForm;
