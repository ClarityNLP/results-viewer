/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from "react";
import { Button, Collapse, Form, FormGroup, Label, Input } from "reactstrap";

class DefineFeatureModal extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      collapse: false,
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
      customCaseSensitive: false
    };
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

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

  handleSubmit = event => {
    event.preventDefault();

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
        payload.push(
          "termset1: " + this.buildArrayStringWithoutQuotes(customTermset)
        );
      } else {
        payload.push(
          "termset: " + this.buildArrayStringWithoutQuotes(customTermset)
        );
      }
    }

    //termset2
    if (customTermset2.length > 0 && customTermset2[0].length > 0) {
      payload.push(
        "termset2: " + this.buildArrayStringWithoutQuotes(customTermset2)
      );
    }

    //documentset
    if (customDocumentset.length > 0 && customDocumentset[0].length > 0) {
      payload.push(
        "documentset: " + this.buildArrayStringWithoutQuotes(customDocumentset)
      );
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
      payload.push(
        "sections: " + this.buildArrayStringWithQuotes(customSections)
      );
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
        payload.push(
          "enum_list: " + this.buildArrayStringWithQuotes(customEnumList)
        );
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

    this.appendFeature({
      name: featureName,
      algorithm: featureAlgorithm
    });
    this.props.updateNLPQL(text);
    this.toggle();
  };

  renderInputsForAlgorithm = () => {
    const { featureAlgorithm, termSets, documentSets, cohorts } = this.props;

    let customTermsetDiv = (
      <FormGroup>
        <Label for="customTermset">Term Set</Label>
        <Input
          type="select"
          id="customTermset"
          name="customTermset"
          onChange={this.handleInputChange}
          multiple
        >
          <option />
          {termSets.map((value, index) => {
            return (
              <option key={index} value={value}>
                {value}
              </option>
            );
          })}
        </Input>
      </FormGroup>
    );

    let customTermset2Div = (
      <FormGroup>
        <Label for="customTermset2">Term Set 2</Label>
        <Input
          type="select"
          id="customTermset2"
          name="customTermset2"
          onChange={this.handleInputChange}
          multiple
        >
          <option />
          {termSets.map((value, index) => {
            return (
              <option key={index} value={value}>
                {value}
              </option>
            );
          })}
        </Input>
      </FormGroup>
    );

    let customDocumentsetDiv = (
      <FormGroup>
        <Label for="customDocumentset">Document Set</Label>
        <Input
          type="select"
          id="customDocumentset"
          name="customDocumentset"
          onChange={this.handleInputChange}
          multiple
        >
          <option />
          {documentSets.map((value, index) => {
            return (
              <option key={index} value={value}>
                {value}
              </option>
            );
          })}
        </Input>
      </FormGroup>
    );

    let customSectionsDiv = (
      <FormGroup>
        <Label for="customSections">Sections</Label>
        <Input
          type="text"
          id="customSections"
          name="customSections"
          value={this.props.customSections}
          onChange={this.handleInputChange}
          placeholder="Enter comma separated terms."
        />
      </FormGroup>
    );

    let customEnumListDiv = (
      <FormGroup>
        <Label for="customEnumList">Enum List</Label>
        <Input
          type="text"
          id="customEnumList"
          name="customEnumList"
          value={this.props.customEnumList}
          onChange={this.handleInputChange}
          placeholder="Enter comma separated terms."
        />
      </FormGroup>
    );

    let customCohortDiv = (
      <FormGroup>
        <Label for="customCohort">Cohort</Label>
        <Input
          type="select"
          id="customCohort"
          name="customCohort"
          onChange={this.handleInputChange}
          multiple
        >
          <option />
          {cohorts.map((value, index) => {
            return (
              <option key={index} value={value}>
                {value}
              </option>
            );
          })}
        </Input>
      </FormGroup>
    );

    let customGroupbyDiv = (
      <FormGroup>
        <Label for="customGroupby">Group By</Label>
        <Input
          type="text"
          id="customGroupby"
          name="customGroupby"
          value={this.props.customGroupby}
          onChange={this.handleInputChange}
        />
      </FormGroup>
    );

    let customNgramNDiv = (
      <FormGroup>
        <Label for="customNgramN">n</Label>
        <Input
          type="text"
          id="customNgramN"
          name="customNgramN"
          value={this.props.customNgramN}
          onChange={this.handleInputChange}
        />
      </FormGroup>
    );

    let customMinFreqDiv = (
      <FormGroup>
        <Label for="customMinFreq">Minimum Frequency</Label>
        <Input
          type="text"
          id="customMinFreq"
          name="customMinFreq"
          value={this.props.customMinFreq}
          onChange={this.handleInputChange}
        />
      </FormGroup>
    );

    let customVocabularyDiv = (
      <FormGroup>
        <Label for="customVocabulary">Vocabulary</Label>
        <Input
          type="text"
          id="customVocabulary"
          name="customVocabulary"
          value={this.props.customVocabulary}
          onChange={this.handleInputChange}
        />
      </FormGroup>
    );

    let customWordDistDiv = (
      <FormGroup>
        <Label for="customWordDist">Word Distance</Label>
        <Input
          type="text"
          id="customWordDist"
          name="customWordDist"
          value={this.props.customWordDist}
          onChange={this.handleInputChange}
        />
      </FormGroup>
    );

    let customMinValDiv = (
      <FormGroup>
        <Label for="customMinVal">Minimum Value</Label>
        <Input
          type="text"
          id="customMinVal"
          name="customMinVal"
          value={this.props.customMinVal}
          onChange={this.handleInputChange}
        />
      </FormGroup>
    );

    let customMaxValDiv = (
      <FormGroup>
        <Label for="customMaxVal">Maximum Value</Label>
        <Input
          type="text"
          id="customMaxVal"
          name="customMaxVal"
          value={this.props.customMaxVal}
          onChange={this.handleInputChange}
        />
      </FormGroup>
    );

    let customAnyOrderDiv = (
      <FormGroup check>
        <Label check>
          <Input
            type="checkbox"
            id="customAnyOrder"
            name="customAnyOrder"
            checked={this.props.customAnyOrder}
            onChange={this.handleInputChange}
          />{" "}
          Any Order
        </Label>
      </FormGroup>
    );

    let customFilterNumsDiv = (
      <FormGroup check>
        <Label check>
          <Input
            type="checkbox"
            id="customFilterNums"
            name="customFilterNums"
            checked={this.props.customFilterNums}
            onChange={this.handleInputChange}
          />{" "}
          Filter Numbers
        </Label>
      </FormGroup>
    );

    let customFilterStopsDiv = (
      <FormGroup check>
        <Label check>
          <Input
            type="checkbox"
            id="customFilterStops"
            name="customFilterStops"
            checked={this.props.customFilterStops}
            onChange={this.handleInputChange}
          />{" "}
          Filter Stops
        </Label>
      </FormGroup>
    );

    let customFilterPunctDiv = (
      <FormGroup check>
        <Label check>
          <Input
            type="checkbox"
            id="customFilterPunct"
            name="customFilterPunct"
            checked={this.props.customFilterPunct}
            onChange={this.handleInputChange}
          />{" "}
          Filter Punctuations
        </Label>
      </FormGroup>
    );

    let customLemmasDiv = (
      <FormGroup check>
        <Label check>
          <Input
            type="checkbox"
            id="customLemmas"
            name="customLemmas"
            checked={this.props.customLemmas}
            onChange={this.handleInputChange}
          />{" "}
          Lemmas
        </Label>
      </FormGroup>
    );

    let customLimitTermsetDiv = (
      <FormGroup check>
        <Label check>
          <Input
            type="checkbox"
            id="customLimitTermset"
            name="customLimitTermset"
            checked={this.props.customLimitTermset}
            onChange={this.handleInputChange}
          />{" "}
          Limit to Termset
        </Label>
      </FormGroup>
    );

    let customSynonymsDiv = (
      <FormGroup check>
        <Label check>
          <Input
            type="checkbox"
            id="customSynonyms"
            name="customSynonyms"
            checked={this.props.customSynonyms}
            onChange={this.handleInputChange}
          />{" "}
          Include Synonyms
        </Label>
      </FormGroup>
    );

    let customDescendantsDiv = (
      <FormGroup check>
        <Label check>
          <Input
            type="checkbox"
            id="customDescendants"
            name="customDescendants"
            checked={this.props.customDescendants}
            onChange={this.handleInputChange}
          />{" "}
          Include Descendants
        </Label>
      </FormGroup>
    );

    let customAncestorsDiv = (
      <FormGroup check>
        <Label check>
          <Input
            type="checkbox"
            id="customAncestors"
            name="customAncestors"
            checked={this.props.customAncestors}
            onChange={this.handleInputChange}
          />{" "}
          Include Ancestors
        </Label>
      </FormGroup>
    );

    let customCaseSensitiveDiv = (
      <FormGroup check>
        <Label check>
          <Input
            type="checkbox"
            id="customCaseSensitive"
            name="customCaseSensitive"
            checked={this.props.customCaseSensitive}
            onChange={this.handleInputChange}
          />{" "}
          Case Sensitive
        </Label>
      </FormGroup>
    );

    if (featureAlgorithm === "None") {
      return;
    }

    return (
      <div>
        {customTermsetDiv}
        {featureAlgorithm === "TermProximityTask" ? customTermset2Div : null}
        {customDocumentsetDiv}
        {customCohortDiv}
        {featureAlgorithm === "ValueExtraction" ? customEnumListDiv : null}
        {featureAlgorithm === "ProviderAssertion" ||
        featureAlgorithm === "TermFinder" ||
        featureAlgorithm === "MeasurementFinder" ||
        featureAlgorithm === "NamedEntityRecognition"
          ? customSectionsDiv
          : null}
        {featureAlgorithm === "ProviderAssertion" ||
        featureAlgorithm === "TermFinder"
          ? customVocabularyDiv
          : null}
        {featureAlgorithm === "ProviderAssertion" ||
        featureAlgorithm === "TermFinder"
          ? customSynonymsDiv
          : null}
        {featureAlgorithm === "ProviderAssertion" ||
        featureAlgorithm === "TermFinder"
          ? customDescendantsDiv
          : null}
        {featureAlgorithm === "ProviderAssertion" ||
        featureAlgorithm === "TermFinder"
          ? customAncestorsDiv
          : null}
        {featureAlgorithm === "TermProximityTask" ? customWordDistDiv : null}
        {featureAlgorithm === "TermProximityTask" ? customAnyOrderDiv : null}
        {featureAlgorithm === "ValueExtraction" ? customMinValDiv : null}
        {featureAlgorithm === "ValueExtraction" ? customMaxValDiv : null}
        {featureAlgorithm === "ValueExtraction" ? customCaseSensitiveDiv : null}
        {featureAlgorithm === "TextStats" ? customGroupbyDiv : null}
        {featureAlgorithm === "ngram" ? customNgramNDiv : null}
        {featureAlgorithm === "ngram" ? customMinFreqDiv : null}
        {featureAlgorithm === "ngram" ? customFilterNumsDiv : null}
        {featureAlgorithm === "ngram" ? customFilterStopsDiv : null}
        {featureAlgorithm === "ngram" ? customFilterPunctDiv : null}
        {featureAlgorithm === "ngram" ? customLemmasDiv : null}
        {featureAlgorithm === "ngram" ? customLimitTermsetDiv : null}
      </div>
    );
  };

  render() {
    const { collapse, featureName, featureAlgorithm } = this.state;

    return (
      <div>
        <Button color="primary" onClick={this.toggle}>
          Add a Feature
        </Button>
        <Collapse isOpen={collapse}>
          <Form>
            <FormGroup>
              <Label for="featureName">Feature Name</Label>
              <Input
                type="text"
                id="featureName"
                name="featureName"
                value={featureName}
                onChange={this.handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <Label for="featureAlgorithm">Select Algorithm</Label>
              <Input
                type="select"
                id="featureAlgorithm"
                name="featureAlgorithm"
                value={featureAlgorithm}
                onChange={this.handleInputChange}
              >
                <option value="None" />
                <option value="MeasurementFinder">Measurement Finder</option>
                <option value="NamedEntityRecognition">
                  Named Entity Recognition
                </option>
                <option value="ngram">Ngram</option>
                <option value="POSTagger">POS Tagger</option>
                <option value="ProviderAssertion">Provider Assertion</option>
                <option value="TermProximityTask">Term Proximity Task</option>
                <option value="TermFinder">Term Finder</option>
                <option value="ValueExtraction">Value Extraction</option>
                <option value="GleasonScoreTask">Gleason Score Task</option>
                <option value="RaceFinderTask">Race Finder Task</option>
                <option value="PFTFinder">PFT Finder</option>
                <option value="TextStats">Text Stats</option>
                <option value="TNMStager">TNM Stager</option>
                <option value="TransfusionNursingNotesParser">
                  Transfusion Nursing Notes Parser
                </option>
              </Input>
            </FormGroup>

            {this.renderInputsForAlgorithm()}

            <Button
              color="success"
              type="submit"
              id="submit"
              onClick={this.handleSubmit}
            >
              Save changes
            </Button>
          </Form>
        </Collapse>
      </div>
    );
  }
}

export default DefineFeatureModal;
