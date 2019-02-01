import React, { Component } from "react";
import { Row, Col, Card, Button } from "reactstrap";

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
      text = "Done Editing";
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
        <div>
          <textarea
            value={this.props.query}
            onChange={this.handleInputChange}
          />
        </div>
      );
    }

    return (
      <div>
        <pre>{this.props.query}</pre>
      </div>
    );
  }

  clear() {
    this.setState(initialState);
    this.props.clear();
  }

  render() {
    const { termSets, documentSets, cohorts, features } = this.state;

    return (
      <div>
        <Row className="NLPQLQueryBuilder mt-5">
          <Col md="6">
            <Card>
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
              <LogicalContextForm updateNLPQL={this.props.updateNLPQL} />
              <DefineResultForm
                features={features}
                updateNLPQL={this.props.updateNLPQL}
              />
            </Card>
          </Col>

          <Col md="6">
            <div id="editor">
              <Row className="justify-content-between">
                <Col xs="12">{this.renderEditor()}</Col>
                <Col xs="4" className="mt-1">
                  <Button outline color="link" onClick={this.clear}>
                    Clear
                  </Button>
                </Col>
                <Col xs="4" className="text-right mt-1">
                  <Button outline color="link" onClick={this.toggleEdit}>
                    {this.state.editText}
                  </Button>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col md="12">
            <div id="response">{this.props.response_view}</div>
          </Col>
        </Row>
      </div>
    );
  }
}
