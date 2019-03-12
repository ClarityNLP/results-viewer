import React, { Component } from "react";
import RunResponse from "./RunResponse";
import TestResponse from "./TestResponse";
import LimitForm from "./Forms/LimitForm";
import PhenotypeForm from "./Forms/PhenotypeForm";
import DocumentSetForm from "./Forms/DocumentSetForm";
import TermsetForm from "./Forms/TermsetForm";
import CohortForm from "./Forms/CohortForm";
import DefineFeatureForm from "./Forms/DefineFeatureForm";
import LogicalContextForm from "./Forms/LogicalContextForm";
import DefineResultForm from "./Forms/DefineResultForm";
import ResponseModal from "./ResponseModal";

const initialState = {
    editing: false,
    editText: "Edit",
    phenotypeModal: "is-active",
    response_view: null,
    limitModal: null,
    termSets: [],
    documentSets: [],
    cohorts: [],
    features: []
};

class JobRunner extends Component {
    constructor(props) {
        super(props);

        this.state = initialState;
    }

    response_ERROR = () => {
        return (
            <TestResponse
                valid={false}
                data={{
                    ERROR: "There was an error with the nlpql."
                }}
                toggle={this.toggleResponse}
                toggleLimitModal={this.toggleLimitModal}
            />
        );
    };

    setArraysFromJSON = () => {
        const { nlpql } = this.props.runner;
        const _this = this;
        let tmp_termSets = [];
        let tmp_documentSets = [];
        let tmp_cohorts = [];
        let tmp_features = [];

        this.props.postToClarityAPI("nlpql_tester", nlpql).then(() => {
            const { nlpql_JSON } = _this.props.runner;

            if (nlpql_JSON) {
                if (nlpql_JSON.term_sets) {
                    tmp_termSets = nlpql_JSON.term_sets.map(value => {
                        return value.name;
                    });
                }

                if (nlpql_JSON.document_sets) {
                    tmp_documentSets = nlpql_JSON.document_sets.map(value => {
                        return value.name;
                    });
                }

                if (nlpql_JSON.cohorts) {
                    tmp_cohorts = nlpql_JSON.cohorts.map(value => {
                        return value.name;
                    });
                }

                if (nlpql_JSON.data_entities) {
                    tmp_features = nlpql_JSON.data_entities.map(value => {
                        return {
                            name: value.name,
                            algorithm: value.funct
                        };
                    });
                }
            }

            this.setState({
                termSets: tmp_termSets,
                documentSets: tmp_documentSets,
                cohorts: tmp_cohorts,
                features: tmp_features
            });
        });
    };

    componentWillMount() {
        this.props.setNLPQL("");
        const htmlClasses = document.getElementsByTagName("html")[0].classList;

        htmlClasses.add("is-clipped");
    }

    toggleEdit = () => {
        const { editing } = this.state;
        let text = null;

        if (editing) {
            this.setArraysFromJSON();
            text = "Edit";
        } else {
            text = "Save";
        }

        this.setState({
            editing: !editing,
            editText: text
        });
    };

    handleInputChange = event => {
        const target = event.target;
        const value = target.value;

        this.props.setNLPQL(value);
    };

    renderEditor = () => {
        const { editing } = this.state;
        const { nlpql } = this.props.runner;

        if (editing) {
            return <textarea value={nlpql} onChange={this.handleInputChange} />;
        }

        return <pre>{nlpql}</pre>;
    };

    clear = () => {
        const htmlClasses = document.getElementsByTagName("html")[0].classList;

        htmlClasses.add("is-clipped");

        this.props.setNLPQL("");
        this.setState(initialState);
    };

    updateNLPQL = value => {
        const { nlpql } = this.props.runner;

        this.props.setNLPQL(nlpql + value).then(() => {
            this.setArraysFromJSON();
        });
    };

    toggleResponse = () => {
        this.setState({
            response_view: null
        });
    };

    toggleLimitModal = () => {
        this.setState({
            response_view: (
                <LimitForm
                    toggle={this.toggleResponse}
                    updateNLPQL={this.updateNLPQL}
                    handleSubmit={this.handleRunClick}
                />
            )
        });
    };

    disablePhenotypeModal = () => {
        const htmlClasses = document.getElementsByTagName("html")[0].classList;

        htmlClasses.remove("is-clipped");

        this.setState({
            phenotypeModal: ""
        });
    };

    testNLPQL = () => {
        const { nlpql } = this.props.runner;
        const _this = this;

        if (nlpql) {
            this.props.postToClarityAPI("nlpql_tester", nlpql).then(() => {
                const { nlpql_JSON } = _this.props.runner;

                this.setState({
                    response_view: (
                        <TestResponse
                            valid={nlpql_JSON.valid}
                            data={nlpql_JSON}
                            toggle={this.toggleResponse}
                            toggleLimitModal={this.toggleLimitModal}
                        />
                    )
                });
            });
        } else {
            this.setState({
                response_view: this.response_ERROR()
            });
        }
    };

    handleExpandClick = () => {
        const { nlpql } = this.props.runner;

        this.props.postToClarityAPI("nlpql_expander", nlpql);
    };

    handeSaveClick = () => {
        const { nlpql } = this.props.runner;

        this.props.saveNLPQL(nlpql).then(() => {
            const { nlpql_id } = this.props.runner;

            let display = (
                <ResponseModal
                    content="Query Saved!"
                    toggle={this.toggleResponse}
                />
            );

            if (nlpql_id < 0 || nlpql_id === null) {
                display = (
                    <ResponseModal
                        content="Save failed, please try again."
                        toggle={this.toggleResponse}
                    />
                );
            }

            this.setState({
                response_view: display
            });
        });
    };

    handleRunClick = () => {
        const { nlpql } = this.props.runner;
        const _this = this;

        if (nlpql) {
            this.props
                .postToClarityAPI("nlpql", nlpql)
                .then(() => {
                    const { nlpql_JSON } = _this.props.runner;

                    if (!nlpql_JSON) {
                        this.setState({
                            response_view: this.response_ERROR()
                        });
                    }

                    this.setState({
                        response_view: (
                            <RunResponse
                                valid={nlpql_JSON.success !== false}
                                data={nlpql_JSON}
                                clear={this.clear}
                                toggle={this.toggleResponse}
                            />
                        )
                    });
                })
                .catch(() => {
                    this.setState({
                        response_view: this.response_ERROR()
                    });
                });
        } else {
            this.setState({
                response_view: this.response_ERROR()
            });
        }
    };

    render() {
        const {
            response_view,
            documentSets,
            termSets,
            cohorts,
            features,
            editText
        } = this.state;

        return (
            <React.Fragment>
                <PhenotypeForm
                    modal={this.state.phenotypeModal}
                    updateNLPQL={this.updateNLPQL}
                    toggle={this.disablePhenotypeModal}
                />
                <div className="JobRunner container">
                    {response_view}

                    <div className="NLPQLAreaHeader columns">
                        <div className="column is-5 level">
                            <div className="columns level-right">
                                <div className="column is-one-third">
                                    <button
                                        className="button is-large"
                                        onClick={this.handeSaveClick}
                                    >
                                        Save
                                    </button>
                                </div>
                                <div className="column is-one-third">
                                    <button
                                        className="button is-large"
                                        onClick={this.handleExpandClick}
                                    >
                                        Expand
                                    </button>
                                </div>
                                <div className="column is-one-third">
                                    <button
                                        className="button is-large"
                                        onClick={this.testNLPQL}
                                    >
                                        Test
                                    </button>
                                </div>
                            </div>
                            <div className="card">
                                <DocumentSetForm
                                    documentSets={documentSets}
                                    updateNLPQL={this.updateNLPQL}
                                />
                                <TermsetForm
                                    termSets={termSets}
                                    updateNLPQL={this.updateNLPQL}
                                />
                                <CohortForm
                                    cohorts={cohorts}
                                    updateNLPQL={this.updateNLPQL}
                                />
                                <DefineFeatureForm
                                    features={features}
                                    termSets={termSets}
                                    documentSets={documentSets}
                                    cohorts={cohorts}
                                    updateNLPQL={this.updateNLPQL}
                                />
                                <LogicalContextForm
                                    updateNLPQL={this.updateNLPQL}
                                />
                                <DefineResultForm
                                    features={features}
                                    updateNLPQL={this.updateNLPQL}
                                />
                            </div>
                        </div>
                        <div className="column is-7 level">
                            <div className="columns level-right">
                                <div className="column is-4">
                                    <button
                                        className="button is-large is-primary"
                                        onClick={this.toggleLimitModal}
                                    >
                                        Run
                                    </button>
                                </div>
                            </div>
                            <div id="editor">
                                {this.renderEditor()}
                                <div className="level">
                                    <div className="column is-one-quarter">
                                        <button
                                            className="button"
                                            onClick={this.clear}
                                        >
                                            Clear
                                        </button>
                                    </div>
                                    <div className="column is-one-quarter level-right">
                                        <button
                                            className="button"
                                            onClick={this.toggleEdit}
                                        >
                                            {editText}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default JobRunner;
