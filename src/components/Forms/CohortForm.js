/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from "react";

import SubmitButton from "../../UIkit/SubmitButton";

import { FaAngleDown, FaAngleUp } from "react-icons/fa";

const initialState = {
    collapse: true,
    name: "",
    id: ""
};

class CohortForm extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderCohortCount = this.renderCohortCount.bind(this);

        this.state = initialState;
    }

    toggle = () => {
        this.setState({
            collapse: !this.state.collapse
        });
    };

    handleInputChange(event) {
        const target = event.target;
        let value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        const { name, id } = this.state;

        let text = "cohort " + name + ": OHDSI.getCohort(" + id + ");\n\n";

        this.props.updateNLPQL(text);
        this.toggle();
        this.setState(initialState);
    }

    renderCohortCount() {
        let count = this.props.cohorts.length;

        if (count === 0) {
            return <span className="optional-text"> - Optional</span>;
        }

        return <span className="tag">{count}</span>;
    }

    render() {
        const { collapse, name, id } = this.state;

        return (
            <React.Fragment>
                <header className="card-header" onClick={this.toggle}>
                    <p className="card-header-title">
                        OHDSI Cohort {this.renderCohortCount()}
                    </p>
                    <span
                        className="card-header-icon"
                        aria-label="more options"
                    >
                        <span className="icon">
                            {collapse ? <FaAngleDown /> : <FaAngleUp />}
                        </span>
                    </span>
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
                            <label className="label">ID</label>
                            <input
                                className="input"
                                type="number"
                                name="id"
                                value={id}
                                onChange={this.handleInputChange}
                            />
                        </div>

                        <SubmitButton
                            handleSubmit={this.handleSubmit}
                            label="Add Cohort"
                        />
                    </form>
                </div>
            </React.Fragment>
        );
    }
}

export default CohortForm;
