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

    componentDidMount() {
        const htmlClasses = document.getElementsByTagName("html")[0].classList;

        htmlClasses.add("is-clipped");
    }

    componentWillUnmount() {
        const htmlClasses = document.getElementsByTagName("html")[0].classList;

        htmlClasses.remove("is-clipped");
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        const { limit } = this.state;
        const text = "limit " + limit + ";\n\n";

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
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">
                                Would you like to limit the number of results?
                            </p>
                            <button
                                className="delete"
                                aria-label="close"
                                onClick={toggle}
                            />
                        </header>
                        <section className="modal-card-body">
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
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                            </form>
                        </section>
                        <footer className="modal-card-foot level cloumns">
                            <div className="column">
                                <button
                                    className="button is-large is-secondary"
                                    onClick={this.noLimit}
                                >
                                    No, Thanks
                                </button>
                            </div>
                            <div className="column">
                                <button
                                    className="button is-large is-primary"
                                    onClick={this.handleSubmit}
                                >
                                    Build Query
                                </button>
                            </div>
                        </footer>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default LimitForm;
