import React, { Component } from "react";
import { Row, Col, Button } from "reactstrap";

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

  handleInputChange = event => {
    const target = event.target;
    const options = event.target.options;
    let value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (options) {
      value = [];
      for (let i = 0, l = options.length; i < l; i++) {
        if (options[i].selected) {
          value.push(options[i].value);
        }
      }

      value = value.toString();
    }

    this.setState({
      [name]: value
    });
  };

  handleSubmit = text => {
    this.props.updateNLPQL(text);
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

  buildArrayStringWithQuotes = s => {
    let arr = s.split(",");

    let tmp = "[";
    for (let i = 0; i < arr.length; i++) {
      tmp += '"' + arr[i].trim() + '"';
      if (i < arr.length - 1) {
        tmp += ", ";
      }
    }
    tmp += "]";

    return tmp;
  };

  buildArrayStringWithoutQuotes = s => {
    let arr = s.split(",");

    let tmp = "[";
    for (let i = 0; i < arr.length; i++) {
      tmp += arr[i].trim();
      if (i < arr.length - 1) {
        tmp += ", ";
      }
    }
    tmp += "]";

    return tmp;
  };

  insertResult = () => {
    const {
      resultsName,
      resultsLogic,
      resultsFeature,
      resultsBooleanOperator,
      resultsSubField
    } = this.state;

    let text = "define final " + resultsName + ":\n\twhere " + resultsFeature;

    if (resultsSubField.trim() !== "") {
      text += "." + resultsSubField + " ";
    }

    text += resultsBooleanOperator + " " + resultsLogic + ";\n\n";

    this.handleSubmit(text);
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
      <div className="NLPQLQueryBuilder">
        <Row>
          <Col md="4">
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
            <CohortModal
              appendCohort={this.appendCohort}
              updateNLPQL={this.props.updateNLPQL}
            />
            <LogicalContextModal updateNLPQL={this.props.updateNLPQL} />
            <DefineFeatureModal
              id="featureModal"
              buttonLabel="Define Feature"
              termSets={this.state.termSets}
              documentSets={this.state.documentSets}
              cohorts={this.state.cohorts}
              featureName={this.state.featureName}
              featureAlgorithm={this.state.featureAlgorithm}
              customTermset={this.state.customTermset}
              customTermset2={this.state.customTermset2}
              customDocumentset={this.state.customDocumentset}
              customSections={this.state.customSections}
              customEnumList={this.state.customEnumList}
              customCohort={this.state.customCohort}
              customGroupby={this.state.customGroupby}
              customNgramN={this.state.customNgramN}
              customMinFreq={this.state.customMinFreq}
              customVocabulary={this.state.customVocabulary}
              customWordDist={this.state.customWordDist}
              customMinVal={this.state.customMinVal}
              customMaxVal={this.state.customMaxVal}
              customAnyOrder={this.state.customAnyOrder}
              customFilterNums={this.state.customFilterNums}
              customFilterStops={this.state.customFilterStops}
              customFilterPunct={this.state.customFilterPunct}
              customLemmas={this.state.customLemmas}
              customLimitTermset={this.state.customLimitTermset}
              customSynonyms={this.state.customSynonyms}
              customDescendants={this.state.customDescendants}
              customAncestors={this.state.customAncestors}
              customCaseSensitive={this.state.customCaseSensitive}
              isDisabled={!this.state.phenotypePresent}
              handleInputChange={this.handleInputChange}
              handleSubmit={this.insertFeature}
            />
            <DefineResultModal
              id="resultModal"
              buttonLabel="Define Result"
              features={this.state.features}
              resultsName={this.state.resultsName}
              resultsFeature={this.state.resultsFeature}
              resultsBooleanOperator={this.state.resultsBooleanOperator}
              resultsLogic={this.state.resultsLogic}
              isDisabled={!this.state.phenotypePresent}
              handleInputChange={this.handleInputChange}
              handleSubmit={this.insertResult}
            />

            <div className="clear-btn-container">
              <Button color="primary" onClick={this.clear}>
                Clear
              </Button>
            </div>
          </Col>

          <Col md="4">
            <div id="editor" className="border">
              <pre>{this.props.query}</pre>
            </div>
          </Col>
          <Col md="4" id="response">
            {this.props.response_view}
          </Col>
        </Row>
      </div>
    );
  }
}
