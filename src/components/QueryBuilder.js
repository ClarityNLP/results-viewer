import React, { Component } from "react";
import { Row, Col, Button, Card } from "reactstrap";

import PhenotypeModal from "./Modals/PhenotypeModal";
import DocumentSetModal from "./Modals/DocumentSetModal";
import TermsetModal from "./Modals/TermsetModal";
import CohortModal from "./Modals/CohortModal";
import LogicalContextModal from "./Modals/LogicalContextModal";
import DefineFeatureModal from "./Modals/DefineFeatureModal";
import DefineResultModal from "./Modals/DefineResultModal";
import LimitModal from "./Modals/LimitModal";

export default class QueryEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phenotypePresent: false,
      resultsName: "",
      resultsFeature: "",
      resultsBooleanOperator: "",
      resultsLogic: "",
      resultsSubField: "",
      termSets: [],
      documentSets: [],
      cohorts: [],
      features: []
    };
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
      phenotypePresent: false,
      termSets: [],
      documentSets: [],
      cohorts: [],
      features: []
    });
  };

  render() {
    return (
      <Row className="NLPQLQueryBuilder mt-5">
        <Col md="6">
          <Card>
            <LimitModal updateNLPQL={this.props.updateNLPQL} />
            <PhenotypeModal updateNLPQL={this.props.updateNLPQL} />
            <DocumentSetModal
              appendDocumentSet={this.appendDocumentSet}
              updateNLPQL={this.props.updateNLPQL}
            />
            <TermsetModal
              appendTermSet={this.appendTermSet}
              updateNLPQL={this.props.updateNLPQL}
            />
          </Card>
        </Col>
        <Col md="6">
          <Card>
            <CohortModal
              appendCohort={this.appendCohort}
              updateNLPQL={this.props.updateNLPQL}
            />
            <LogicalContextModal updateNLPQL={this.props.updateNLPQL} />
            <DefineFeatureModal
              termSets={this.state.termSets}
              documentSets={this.state.documentSets}
              cohorts={this.state.cohorts}
              appendFeature={this.appendFeature}
              updateNLPQL={this.props.updateNLPQL}
            />
            <DefineResultModal
              features={this.state.features}
              updateNLPQL={this.props.updateNLPQL}
            />
          </Card>
        </Col>

        <Col md="12" className="mt-3">
          <div id="editor">
            <pre>{this.props.query}</pre>
          </div>
        </Col>
        <Col md="12" className="mt-3">
          <div id="response">{this.props.response_view}</div>
        </Col>
      </Row>
    );
  }
}
