/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from "react";

const initialState = { limit: "" };

class LimitForm extends React.Component {
    constructor(props) {
        super(props);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.noLimit = this.noLimit.bind(this);

        this.state = initialState;
    }

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

        let { limit } = this.state;
        let text = "limit " + limit + ";\n\n";

        this.props.updateNLPQL(text);
        this.props.toggle();
        this.props.handleSubmit();
        this.setState(initialState);
    }

    noLimit(event) {
        event.preventDefault();

        this.props.toggle();
        this.props.handleSubmit();
        this.setState(initialState);
    }

    render() {
        const { toggle } = this.props;
        const { limit } = this.state;

        return (
            <React.Fragment>
                <div className="modal is-active">
                    <div className="modal-background" />
                    <div className="modal-content">
                        <div className="card">
                            <div className="card-content">
                                <div className="content">
                                    <form>
                                        <div className="field">
                                            <label className="label">
                                                Limit Results
                                            </label>
                                            <input
                                                className="input"
                                                type="number"
                                                name="limit"
                                                value={limit}
                                                onChange={
                                                    this.handleInputChange
                                                }
                                            />
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <footer className="card-footer">
                                <a
                                    className="card-footer-item"
                                    onClick={toggle}
                                >
                                    Close
                                </a>
                                <a
                                    className="card-footer-item"
                                    onClick={this.noLimit}
                                >
                                    No, thanks
                                </a>
                                <a
                                    className="card-footer-item"
                                    onClick={this.handleSubmit}
                                >
                                    Run Query
                                </a>
                            </footer>
                        </div>
                    </div>
                    <button
                        className="modal-close is-large"
                        aria-label="close"
                        onClick={toggle}
                    />
                </div>
            </React.Fragment>
        );
    }
}

export default LimitForm;
