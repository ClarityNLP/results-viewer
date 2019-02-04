/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from "react";
import Select from "react-select";

import SubmitButton from "../../UIkit/SubmitButton";

import algorithmParameters from "./algorithms";
import plus from "../../assets/icons/svg/plus.svg";
import minus from "../../assets/icons/svg/minus.svg";

const initialState = {
    icon: plus,
    collapse: true,
    algorithm: "",
    name: "",
    feature: "",
    subField: "",
    isFinal: false,
    logic: ""
};
class DefineResultForm extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleFeatureInputChange = this.handleFeatureInputChange.bind(
            this
        );
        this.addFeatureToLogic = this.addFeatureToLogic.bind(this);
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

    addFeatureToLogic() {
        const { feature, subField } = this.state;
        let text = feature;

        if (subField.trim() !== "") {
            text += "." + subField;
        }

        this.setState({
            logic: this.state.logic + text
        });
    }

    handleInputChange = event => {
        const target = event.target;
        const options = event.target.options;
        let value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;

        if (options) {
            value = [];
            for (let i = 0, l = options.length; i < l; i++) {
                if (options[i].selected) {
                    value.push(options[i].value);
                }
            }

            value = value.toString();
        }

        this.setState({
            [name]: value
        });
    };

    handleSubFieldChange = value => {
        this.setState({
            subField: value.value
        });
    };

    handleFeatureInputChange(value) {
        const { features } = this.props;

        let algorithm = "";
        let feature = "";

        for (let i = 0; i < features.length; i++) {
            if (features[i].name === value.value) {
                algorithm = features[i].algorithm;
                feature = features[i].name;
            }
        }

        console.log(value);
        console.log("Feature : " + feature);
        console.log("Algorithm : " + algorithm);

        this.setState({
            algorithm: algorithm,
            feature: feature
        });
    }

    getSubFields = () => {
        const { algorithm } = this.state;

        return algorithmParameters[algorithm].map(value => {
            return {
                value: value,
                label: value
            };
        });
    };

    getFeatureOptions = () => {
        const { features } = this.props;

        return features.map(value => {
            return {
                value: value.name,
                label: value.name
            };
        });
    };

    renderSubFieldSelect() {
        const { algorithm, subField } = this.state;

        if (algorithm !== "") {
            return (
                <Select
                    value={subField}
                    onChange={this.handleSubFieldChange}
                    options={this.getSubFields()}
                />
            );
        }

        return null;
    }

    handleSubmit(event) {
        event.preventDefault();

        const { name, logic, isFinal } = this.state;

        const { logicalContext } = this.state;

        let text = "context " + logicalContext + ";\n\n define ";

        if (isFinal) {
            text += "final ";
        }

        text += name + ":\n\twhere " + logic;

        text += ";\n\n";

        this.props.updateNLPQL(text);
        this.toggle();
        this.setState(initialState);
    }

    render() {
        const { icon, collapse, name, feature, logic, isFinal } = this.state;

        return (
            <div>
                <header className="card-header" onClick={this.toggle}>
                    <p className="card-header-title">Result</p>
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
                            <label className="label">Name</label>
                            <input
                                className="input"
                                type="text"
                                name="name"
                                value={name}
                                onChange={this.handleInputChange}
                            />
                        </div>

                        <div className="field">
                            <label className="label">Feature</label>
                            <div className="columns">
                                <div className="column is-5">
                                    <Select
                                        value={feature}
                                        onChange={this.handleFeatureInputChange}
                                        options={this.getFeatureOptions()}
                                    />
                                </div>
                                <div className="column is-5">
                                    {this.renderSubFieldSelect()}
                                </div>
                                <div className="column is-2">
                                    <button
                                        className="button is-primary"
                                        onClick={this.addFeatureToLogic}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="label">Logic</label>
                                <input
                                    className="input"
                                    type="text"
                                    name="logic"
                                    value={logic}
                                    onChange={this.handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label className="checkbox">
                                <input
                                    type="checkbox"
                                    name="isFinal"
                                    checked={isFinal}
                                    onChange={this.handleInputChange}
                                />{" "}
                                Include in final results
                            </label>
                        </div>

                        <SubmitButton
                            handleSubmit={this.handleSubmit}
                            label="Add Result"
                        />
                    </form>
                </div>
            </div>
        );
    }
}

export default DefineResultForm;
