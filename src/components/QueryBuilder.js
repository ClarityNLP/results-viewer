import React, { Component } from "react";

import DocumentSetForm from "./Forms/DocumentSetForm";
import TermsetForm from "./Forms/TermsetForm";
import CohortForm from "./Forms/CohortForm";
import LogicalContextForm from "./Forms/LogicalContextForm";
import DefineFeatureForm from "./Forms/DefineFeatureForm";
import DefineResultForm from "./Forms/DefineResultForm";

const initialState = {
    editing: false,
    editText: "Edit",
    termSets: [],
    documentSets: [],
    cohorts: [],
    features: []
};

export default class QueryEditor extends Component {
    constructor(props) {
        super(props);

        this.toggleEdit = this.toggleEdit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.renderEditor = this.renderEditor.bind(this);

        this.state = initialState;
    }

    toggleEdit() {
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
    }

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

    clear = () => {
        this.props.clear();

        this.setState({
            termSets: [],
            documentSets: [],
            cohorts: [],
            features: []
        });
    };

    handleInputChange(event) {
        const target = event.target;
        let value = target.value;

        this.props.overwriteNLPQL(value);
    }

    renderEditor() {
        const { editing } = this.state;

        if (editing) {
            return (
                <textarea
                    value={this.props.query}
                    onChange={this.handleInputChange}
                />
            );
        }

        return <pre>{this.props.query}</pre>;
    }

    clear() {
        this.setState(initialState);
        this.props.clear();
    }

    render() {
        const { termSets, documentSets, cohorts, features } = this.state;

        return (
            <div>
                <div className="NLPQLQueryBuilder">
                    <div className="columns">
                        <div className="column is-half">
                            <div className="card">
                                <DocumentSetForm
                                    documentSets={documentSets}
                                    appendDocumentSet={this.appendDocumentSet}
                                    updateNLPQL={this.props.updateNLPQL}
                                />
                                <TermsetForm
                                    termSets={termSets}
                                    appendTermSet={this.appendTermSet}
                                    updateNLPQL={this.props.updateNLPQL}
                                />
                                <CohortForm
                                    cohorts={cohorts}
                                    appendCohort={this.appendCohort}
                                    updateNLPQL={this.props.updateNLPQL}
                                />
                                <DefineFeatureForm
                                    termSets={termSets}
                                    documentSets={documentSets}
                                    cohorts={cohorts}
                                    appendFeature={this.appendFeature}
                                    updateNLPQL={this.props.updateNLPQL}
                                />
                                <LogicalContextForm
                                    updateNLPQL={this.props.updateNLPQL}
                                />
                                <DefineResultForm
                                    features={features}
                                    updateNLPQL={this.props.updateNLPQL}
                                />
                            </div>
                        </div>

                        <div className="column is-half">
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
                                            {this.state.editText}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="response">{this.props.response_view}</div>
                </div>
            </div>
        );
    }
}
