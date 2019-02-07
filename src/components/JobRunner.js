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

const initialState = {
    editing: false,
    editText: "Edit",
    phenotypeModal: "is-active",
    termSets: [],
    documentSets: [],
    cohorts: [],
    features: [],
    response_view: null,
    limitModal: null
};

class JobRunner extends Component {
    constructor(props) {
        super(props);

        this.state = initialState;
    }

    getNamesArray = arr => {
        return arr.map(value => {
            return value.name;
        });
    };

    getFeaturesArray = arr => {
        return arr.map(value => {
            return {
                name: value.name,
                algorithm: value.funct
            };
        });
    };

    setArraysFromJSON = () => {
        let termSets = [];
        let documentSets = [];
        let cohorts = [];
        let features = [];

        this.props
            .postToClarityAPI("nlpql_tester", this.props.runner.nlpql)
            .then(() => {
                if (this.props.runner.nlpql_JSON.term_sets) {
                    termSets = this.getNamesArray(
                        this.props.runner.nlpql_JSON.term_sets
                    );
                }
                if (this.props.runner.nlpql_JSON.document_sets) {
                    documentSets = this.getNamesArray(
                        this.props.runner.nlpql_JSON.document_sets
                    );
                }
                if (this.props.runner.nlpql_JSON.cohorts) {
                    cohorts = this.getNamesArray(
                        this.props.runner.nlpql_JSON.cohorts
                    );
                }
                if (this.props.runner.nlpql_JSON.data_entities) {
                    features = this.getFeaturesArray(
                        this.props.runner.nlpql_JSON.data_entities
                    );
                }

                this.setState({
                    termSets: termSets,
                    documentSets: documentSets,
                    cohorts: cohorts,
                    features: features
                });
            });
    };

    componentWillMount() {
        this.props.setNLPQL("");
        let htmlClasses = document.getElementsByTagName("html")[0].classList;

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
        let value = target.value;

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
        let htmlClasses = document.getElementsByTagName("html")[0].classList;

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
        let htmlClasses = document.getElementsByTagName("html")[0].classList;

        htmlClasses.remove("is-clipped");

        this.setState({
            phenotypeModal: ""
        });
    };

    testNLPQL = () => {
        if (this.props.runner.nlpql) {
            this.props
                .postToClarityAPI("nlpql_tester", this.props.runner.nlpql)
                .then(() => {
                    this.setState({
                        response_view: (
                            <TestResponse
                                valid={this.props.runner.nlpql_JSON.valid}
                                data={this.props.runner.nlpql_JSON}
                                toggle={this.toggleResponse}
                                toggleLimitModal={this.toggleLimitModal}
                            />
                        )
                    });
                });
        } else {
            this.setState({
                response_view: (
                    <TestResponse
                        valid={false}
                        data={{
                            ERROR: "Please POST text containing NLPQL."
                        }}
                        toggle={this.toggleResponse}
                        toggleLimitModal={this.toggleLimitModal}
                    />
                )
            });
        }
    };

    handleExpandClick = () => {
        this.props.postToClarityAPI("nlpql_expander", this.props.runner.nlpql);
    };

    handleRunClick = () => {
        this.props
            .postToClarityAPI("nlpql", this.props.runner.nlpql)
            .then(() => {
                this.setState({
                    response_view: (
                        <RunResponse
                            valid={
                                this.props.runner.nlpql_JSON.success !== false
                            }
                            data={this.props.runner.nlpql_JSON}
                            clear={this.clear}
                            toggle={this.toggleResponse}
                        />
                    )
                });
            });
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
