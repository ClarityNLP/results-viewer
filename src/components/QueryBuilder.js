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
      termExpanderUrl: "http://18.220.133.76:5000/nlpql_expander",
      phenotypePresent: false,
      phenotypeName: "",
      phenotypeVersion: "",
      documentsetName: "",
      documentsetType: "",
      documentsetReportTypes: "",
      documentsetReportTags: "",
      documentsetSource: "",
      documentsetFilterQuery: "",
      documentsetQuery: "",
      limit: "",
      termsetName: "",
      termsetTerms: "",
      termsetSynonyms: false,
      termsetPlurals: false,
      termsetVerbInflections: false,
      cohortName: "",
      cohortID: "",
      logicalContext: "Patient",
      featureName: "",
      featureAlgorithm: "None",
      customTermset: "",
      customTermset2: "",
      customDocumentset: "",
      customSections: "",
      customEnumList: "",
      customCohort: "",
      customGroupby: "",
      customNgramN: "",
      customMinFreq: "",
      customVocabulary: "",
      customWordDist: "",
      customMinVal: "",
      customMaxVal: "",
      customAnyOrder: false,
      customFilterNums: false,
      customFilterStops: false,
      customFilterPunct: false,
      customLemmas: false,
      customLimitTermset: false,
      customSynonyms: false,
      customDescendants: false,
      customAncestors: false,
      customCaseSensitive: false,
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
    let editor = window.ace.edit("editor");
    editor.insert(text);

    this.setState({
      phenotypeName: "",
      phenotypeVersion: "",
      documentsetName: "",
      documentsetType: "",
      documentsetReportTypes: "",
      documentsetReportTags: "",
      documentsetSource: "",
      documentsetFilterQuery: "",
      documentsetQuery: "",
      limit: "",
      termsetName: "",
      termsetTerms: "",
      termsetSynonyms: false,
      termsetPlurals: false,
      termsetVerbInflections: false,
      cohortName: "",
      cohortID: "",
      logicalContext: "Patient",
      featureName: "",
      featureAlgorithm: "None",
      customTermset: "",
      customTermset2: "",
      customDocumentset: "",
      customSections: "",
      customEnumList: "",
      customCohort: "",
      customGroupby: "",
      customNgramN: "",
      customMinFreq: "",
      customVocabulary: "",
      customWordDist: "",
      customMinVal: "",
      customMaxVal: "",
      customAnyOrder: false,
      customFilterNums: false,
      customFilterStops: false,
      customFilterPunct: false,
      customLemmas: false,
      customLimitTermset: false,
      customSynonyms: false,
      customDescendants: false,
      customAncestors: false,
      customCaseSensitive: false,
      resultsName: "",
      resultsFeature: "",
      resultsBooleanOperator: "",
      resultsLogic: "",
      resultsSubField: ""
    });
  };

  insertPhenotype = () => {
    const { phenotypeName } = this.state;
    const { phenotypeVersion } = this.state;

    let text =
      'phenotype "' +
      phenotypeName +
      '" version "' +
      phenotypeVersion +
      '";\n\n' +
      'include ClarityCore version "1.0" called Clarity;\n\n';

    this.handleSubmit(text);

    this.setState({
      phenotypePresent: true
    });
  };

  buildArrayString = s => {
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

  insertDocumentSet = () => {
    const {
      documentsetName,
      documentsetReportTypes,
      documentsetReportTags,
      documentsetSource,
      documentsetFilterQuery,
      documentsetQuery
    } = this.state;

    let text = "documentset " + documentsetName + ":\n\t";

    let hasTypes =
      documentsetReportTypes.length > 0 && documentsetReportTypes[0].length > 0;
    let hasTags =
      documentsetReportTags.length > 0 && documentsetReportTags[0].length > 0;
    let hasSource =
      documentsetSource.length > 0 && documentsetSource[0].length > 0;
    let hasFilterQuery = documentsetFilterQuery.length > 0;
    let hasQuery = documentsetQuery.length > 0;

    if (hasTypes && !hasTags && !hasSource && !hasFilterQuery && !hasQuery) {
      text +=
        "Clarity.createReportTypeList(" +
        this.buildArrayString(documentsetReportTypes) +
        ");\n\n";
    } else if (
      hasTags &&
      !hasTypes &&
      !hasSource &&
      !hasFilterQuery &&
      !hasQuery
    ) {
      text +=
        "Clarity.createReportTagList(" +
        this.buildArrayString(documentsetReportTags) +
        ");\n\n";
    } else {
      let payloadKeys = [];

      if (hasTypes) {
        payloadKeys.push(
          "report_types: " + this.buildArrayString(documentsetReportTypes)
        );
      }

      if (hasTags) {
        payloadKeys.push(
          "report_tags: " + this.buildArrayString(documentsetReportTags)
        );
      }

      if (hasSource) {
        payloadKeys.push("source: " + this.buildArrayString(documentsetSource));
      }

      if (hasFilterQuery) {
        payloadKeys.push(
          "filter_query: " +
            '"' +
            documentsetFilterQuery.replace(/"/g, "'") +
            '"'
        );
      }

      if (hasQuery) {
        payloadKeys.push(
          'query: "' + documentsetQuery.replace(/"/g, "'") + '"'
        );
      }

      let payload = "{\n\t\t";
      for (let i = 0; i < payloadKeys.length; i++) {
        payload += payloadKeys[i];
        if (i < payloadKeys.length - 1) {
          payload += ",\n\t\t";
        }
      }
      payload += "\n\t}";

      text += "Clarity.createDocumentSet(" + payload + ");\n\n";
    }

    this.handleSubmit(text);
    this.setState({
      documentSets: [...this.state.documentSets, documentsetName]
    });
  };

  insertDocumentLimit = () => {
    let { limit } = this.state;
    let text = "limit " + limit + ";\n\n";

    this.handleSubmit(text);
  };

  insertTermset = () => {
    let {
      termsetName,
      termsetTerms,
      termsetSynonyms,
      termsetPlurals,
      termsetVerbInflections
    } = this.state;

    if (termsetSynonyms || termsetPlurals || termsetVerbInflections) {
      let payload = "termset " + termsetName + ": [";

      if (termsetSynonyms) {
        payload += 'Clarity.Synonyms("' + termsetTerms + '"),';
      }
      if (termsetPlurals) {
        payload += 'Clarity.Plurals("' + termsetTerms + '"),';
      }
      if (termsetVerbInflections) {
        payload += 'Clarity.VerbInflections("' + termsetTerms + '"),';
      }

      payload = payload.slice(0, payload.length - 1); //removing the last extra ',' character
      payload += "];";

      fetch(this.state.termExpanderUrl, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain"
        },
        body: payload
      })
        .then(response => {
          return response.text().then(data => {
            data = data.replace(":", ":\n\t");

            this.handleSubmit(data);
            let editor = window.ace.edit("editor");
            editor.insert("\n\n");
          });
        })
        .catch(err => {
          alert("Term Expander Unavailable. Reason: " + err.message);
        });
    } else {
      let text = "termset " + termsetName + ":\n";
      text = text + "\t" + this.buildArrayString(termsetTerms) + "\n\n";

      this.handleSubmit(text);
    }

    this.setState({
      termSets: [...this.state.termSets, termsetName]
    });
  };

  insertCohort = () => {
    const { cohortName, cohortID } = this.state;

    let text =
      "cohort " + cohortName + ": OHDSI.getCohort(" + cohortID + ");\n\n";

    this.handleSubmit(text);
    this.setState({
      cohorts: [...this.state.cohorts, cohortName]
    });
  };

  insertLogicalContext = () => {
    let { logicalContext } = this.state;
    let text = "context " + logicalContext + ";\n\n";

    this.handleSubmit(text);
  };

  insertFeature = () => {
    const {
      featureName,
      featureAlgorithm,
      customTermset,
      customTermset2,
      customDocumentset,
      customSections,
      customEnumList,
      customCohort,
      customGroupby,
      customNgramN,
      customMinFreq,
      customVocabulary,
      customWordDist,
      customMinVal,
      customMaxVal,
      customAnyOrder,
      customFilterNums,
      customFilterStops,
      customFilterPunct,
      customLemmas,
      customLimitTermset,
      customSynonyms,
      customDescendants,
      customAncestors,
      customCaseSensitive
    } = this.state;

    let payload = [];

    if (featureAlgorithm === "None") {
      return;
    }

    //termset
    if (customTermset.length > 0 && customTermset[0].length > 0) {
      if (featureAlgorithm === "TermProximityTask") {
        payload.push("termset1: " + this.buildArrayString(customTermset));
      } else {
        payload.push("termset: " + this.buildArrayString(customTermset));
      }
    }

    //termset2
    if (customTermset2.length > 0 && customTermset2[0].length > 0) {
      payload.push("termset2: " + this.buildArrayString(customTermset2));
    }

    //documentset
    if (customDocumentset.length > 0 && customDocumentset[0].length > 0) {
      payload.push("documentset: " + this.buildArrayString(customDocumentset));
    }

    // cohort
    if (customCohort != null && customCohort.length > 0) {
      payload.push('cohort: "' + customCohort.trim() + '"');
    }

    // groupBy
    if (customGroupby != null && customGroupby.length > 0) {
      payload.push('group_by: "' + customGroupby.trim() + '"');
    }

    //sections
    if (customSections.length > 0 && customSections[0].length > 0) {
      payload.push("sections: " + this.buildArrayString(customSections));
    }

    if (featureAlgorithm === "ngram") {
      //ngram-n
      if (customNgramN != null && customNgramN.length > 0) {
        payload.push('n: "' + customNgramN.trim() + '"');
      }

      //min-Frequency
      if (customMinFreq != null && customMinFreq.length > 0) {
        payload.push("min_freq: " + customMinFreq.trim());
      }

      //filter-nums
      payload.push("filter_nums: " + customFilterNums);

      //filter-stops
      payload.push("filter_stops: " + customFilterStops);

      //filter-punct
      payload.push("filter_punct: " + customFilterPunct);

      //lemmas
      payload.push("lemmas: " + customLemmas);

      // limit termset
      payload.push("limit_to_termset: " + customLimitTermset);
    }

    if (
      featureAlgorithm === "ProviderAssertion" ||
      featureAlgorithm === "TermFinder"
    ) {
      //Synonyms
      payload.push("include_synonyms: " + customSynonyms);

      // descendants
      payload.push("include_descendants: " + customDescendants);

      // include_ancestors
      payload.push("include_ancestors: " + customAncestors);

      // vocabulary
      if (customVocabulary != null && customVocabulary.length > 0) {
        payload.push('vocabulary: "' + customVocabulary.trim() + '"');
      }
    }

    if (featureAlgorithm === "TermProximityTask") {
      // word distance
      if (customWordDist != null && customWordDist.length > 0) {
        payload.push("word_distance: " + customWordDist.trim());
      }

      //anyorder
      payload.push("any_order: " + customAnyOrder);
    }

    if (featureAlgorithm === "ValueExtraction") {
      //enum list
      if (customEnumList.length > 0 && customEnumList[0].length > 0) {
        payload.push("enum_list: " + this.buildArrayString(customEnumList));
      }

      // min val
      if (customMinVal != null && customMinVal.length > 0) {
        payload.push("minimum_value: " + customMinVal.trim());
      }

      // max val
      if (customMaxVal != null && customMaxVal.length > 0) {
        payload.push("maximum_value: " + customMaxVal.trim());
      }

      // case Sensitive
      payload.push("case_sensitive: " + customCaseSensitive);
    }

    // Constructing custom task element
    let text = "define " + featureName + ":\n\t";
    text += "Clarity." + featureAlgorithm + "({\n\t\t";
    for (let i = 0; i < payload.length; i++) {
      text += payload[i];
      if (i < payload.length - 1) {
        text += ",\n\t\t";
      }
    }
    text += "\n\t});\n\n";

    this.handleSubmit(text);
    this.setState({
      features: [
        ...this.state.features,
        {
          name: featureName,
          algorithm: featureAlgorithm
        }
      ]
    });
  };

  insertResult = () => {
    const {
      resultsName,
      resultsLogic,
      resultsFeature,
      resultsBooleanOperator,
      resultsSubField
    } = this.state;

    let text =
      "define final " +
      resultsName +
      ":\n\twhere " +
      resultsFeature +
      "." +
      resultsSubField +
      " " +
      resultsBooleanOperator +
      " " +
      resultsLogic +
      ";\n\n";

    this.handleSubmit(text);
  };

  clear = () => {
    let editor = window.ace.edit("editor");
    editor.setValue("");
    this.setState({ phenotypePresent: false });
  };

  componentDidMount() {
    let editor = window.ace.edit("editor");
    editor.setTheme("ace/theme/eclipse");
    editor.getSession().setMode("ace/mode/java");
    editor.setOptions({
      autoScrollEditorIntoView: true,
      copyWithEmptySelection: true,
      minLines: 35,
      maxLines: 35
    });
  }

  render() {
    return (
      <div className="NLPQLQueryBuilder">
        <Row>
          <Col md="3">
            <LimitModal
              id="limitDocumentModal"
              buttonLabel="Limit Results"
              limit={this.state.limit}
              isDisabled={false}
              handleInputChange={this.handleInputChange}
              handleSubmit={this.insertDocumentLimit}
            />
            <PhenotypeModal
              id="phenotypeModal"
              buttonLabel="Add Phenotype"
              isDisabled={this.state.phenotypePresent}
              phenotypeName={this.state.phenotypeName}
              phenotypeVersion={this.state.phenotypeVersion}
              handleInputChange={this.handleInputChange}
              handleSubmit={this.insertPhenotype}
            />
            <DocumentSetModal
              id="documentSetModal"
              buttonLabel="Add Document Set"
              documentsetName={this.state.documentsetName}
              documentsetType={this.state.documentsetType}
              documentsetReportTypes={this.state.documentsetReportTypes}
              documentsetReportTags={this.state.documentsetReportTags}
              documentsetSource={this.state.documentsetSource}
              documentsetFilterQuery={this.state.documentsetFilterQuery}
              documentsetQuery={this.state.documentsetQuery}
              isDisabled={!this.state.phenotypePresent}
              handleInputChange={this.handleInputChange}
              handleSubmit={this.insertDocumentSet}
            />
            <TermsetModal
              id="termsetModal"
              buttonLabel="Add Term Set"
              termsetName={this.state.termsetName}
              termsetTerms={this.state.termsetTerms}
              termsetSynonyms={this.state.termsetSynonyms}
              termsetPlurals={this.state.termsetPlurals}
              termsetVerbInflections={this.state.termsetVerbInflections}
              isDisabled={!this.state.phenotypePresent}
              handleInputChange={this.handleInputChange}
              handleSubmit={this.insertTermset}
            />
            <CohortModal
              id="cohortModal"
              buttonLabel="Add OHDSI Cohort"
              cohortName={this.state.cohortName}
              cohortID={this.state.cohortID}
              isDisabled={!this.state.phenotypePresent}
              handleInputChange={this.handleInputChange}
              handleSubmit={this.insertCohort}
            />
            <LogicalContextModal
              id="logicalContextModal"
              buttonLabel="Select Logical Context"
              logicalContext={this.state.logicalContext}
              isDisabled={!this.state.phenotypePresent}
              handleInputChange={this.handleInputChange}
              handleSubmit={this.insertLogicalContext}
            />
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

          <Col md="9">
            <div id="editor" />
          </Col>
        </Row>
      </div>
    );
  }
}
