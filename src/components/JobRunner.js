import React, { Component } from "react";
import _ from "lodash";

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

    toggleEdit = () => {
        const { editing } = this.state;
        let text = null;

        if (editing) {
            text = "Edit";
        } else {
            text = "Save";
        }

        this.setState({
            editing: !editing,
            editText: text
        });
    };

    appendDocumentSet = documentSet => {
        this.setState({
            documentSets: [...this.state.documentSets, documentSet]
        });
    };

    appendTermSet = termSet => {
        this.setState({
            termSets: [...this.state.termSets, termSet]
        });
    };

    appendCohort = cohort => {
        this.setState({
            cohorts: [...this.state.cohorts, cohort]
        });
    };

    appendFeature = feature => {
        this.setState({
            features: [...this.state.features, feature]
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
        this.props.setNLPQL("");
        this.setState(initialState);
    };

    updateNLPQL = value => {
        const { nlpql } = this.props.runner;

        this.props.setNLPQL(nlpql + value);
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

        if (htmlClasses.contains("is-clipped")) {
            htmlClasses.remove("is-clipped");
        } else {
            htmlClasses.add("is-clipped");
        }

        let openClass = this.state.togglePhenotype !== "" ? "" : "is-active";

        this.setState({
            phenotypeModal: openClass
        });
    };

    handleTestClick = () => {
        const { nlpql } = this.props.runner;

        this.props.postToClarityAPI("nlpql_tester", nlpql).then(json => {
            this.setState({
                response_view: (
                    <TestResponse
                        data={json}
                        toggle={this.toggleResponse}
                        toggleLimitModal={this.toggleLimitModal}
                    />
                )
            });
        });
    };

    handleExpandClick = () => {
        const { nlpql } = this.props.runner;

        this.props.postToClarityAPI("nlpql_expander", nlpql);
    };

    handleRunClick = () => {
        const { nlpql } = this.props.runner;

        this.props.postToClarityAPI("nlpql", nlpql).then(json => {
            this.setState({
                response_view: (
                    <RunResponse
                        valid={json.success !== false}
                        data={json}
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
            <div className="JobRunner container">
                {response_view}
                <PhenotypeForm
                    modal={this.state.phenotypeModal}
                    updateNLPQL={this.updateNLPQL}
                    toggle={this.disablePhenotypeModal}
                />
                <div className="NLPQLAreaHeader columns">
                    <div className="column is-half level">
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
                                    onClick={this.handleTestClick}
                                >
                                    Test
                                </button>
                            </div>
                        </div>
                        <div className="card">
                            <DocumentSetForm
                                documentSets={documentSets}
                                appendDocumentSet={this.appendDocumentSet}
                                updateNLPQL={this.updateNLPQL}
                            />
                            <TermsetForm
                                termSets={termSets}
                                appendTermSet={this.appendTermSet}
                                updateNLPQL={this.updateNLPQL}
                            />
                            <CohortForm
                                cohorts={cohorts}
                                appendCohort={this.appendCohort}
                                updateNLPQL={this.updateNLPQL}
                            />
                            <DefineFeatureForm
                                termSets={termSets}
                                documentSets={documentSets}
                                cohorts={cohorts}
                                appendFeature={this.appendFeature}
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
                    <div className="column is-half level">
                        <div className="columns level-right">
                            <div className="column is-half">
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
        );
    }
}

export default JobRunner;
