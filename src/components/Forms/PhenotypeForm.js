import React from "react";

const initialState = {
    name: "",
    version: "",
    limit: "",
    clarityLibrary: true,
    OHDSILibrary: false
};

class PhenotypeForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = initialState;
    }

    componentDidMount() {
        let htmlClasses = document.getElementsByTagName("html")[0].classList;

        htmlClasses.add("is-clipped");
    }

    handleInputChange = event => {
        const target = event.target;
        let value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    };

    handleSubmit = event => {
        event.preventDefault();

        const { name, version, clarityLibrary, OHDSILibrary } = this.state;
        let text = "";

        text += 'phenotype "' + name + '" version "' + version + '";\n\n';

        if (clarityLibrary) {
            text += 'include ClarityCore version "1.0" called Clarity;\n';
        }

        if (OHDSILibrary) {
            text += 'include OHDSIHelpers version "1.0" called OHDSI;';
        }

        text += "\n\n";

        this.props.updateNLPQL(text);
        this.props.toggle();
        this.setState(initialState);
    };

    render() {
        const { name, version, clarityLibrary, OHDSILibrary } = this.state;
        const { modal } = this.props;

        return (
            <React.Fragment>
                <div className={"modal " + modal}>
                    <div className="modal-background" />
                    <div class="modal-card">
                        <header class="modal-card-head">
                            <p class="modal-card-title">Welcome!</p>
                            <button
                                class="delete"
                                aria-label="close"
                                onClick={this.props.toggle}
                            />
                        </header>
                        <section class="modal-card-body">
                            <form>
                                {/* NAME INPUT */}
                                <div className="field">
                                    <label className="label">
                                        Phenotype Name
                                    </label>
                                    <input
                                        className="input"
                                        type="text"
                                        name="name"
                                        value={name}
                                        onChange={this.handleInputChange}
                                    />
                                </div>

                                {/* VERSION INPUT */}
                                <div className="field">
                                    <label className="label">
                                        Phenotype Version
                                    </label>
                                    <input
                                        className="input"
                                        type="text"
                                        name="version"
                                        value={version}
                                        onChange={this.handleInputChange}
                                    />
                                </div>

                                <div className="field">
                                    <label className="checkbox">
                                        <input
                                            type="checkbox"
                                            name="clarityLibrary"
                                            checked={clarityLibrary}
                                            onChange={this.handleInputChange}
                                        />{" "}
                                        Include Clarity Library
                                    </label>
                                </div>

                                <div className="field">
                                    <label className="checkbox">
                                        <input
                                            type="checkbox"
                                            name="OHDSILibrary"
                                            checked={OHDSILibrary}
                                            onChange={this.handleInputChange}
                                        />{" "}
                                        Include OHDSI Library
                                    </label>
                                </div>
                            </form>
                        </section>
                        <footer class="modal-card-foot">
                            <div className="column is-5 is-offset-7">
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

export default PhenotypeForm;
