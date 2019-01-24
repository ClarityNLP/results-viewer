/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input
} from "reactstrap";

class DefineFeatureModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.props.handleSubmit();
    this.toggle();
  };

  renderInputsForAlgorithm = () => {
    let { featureAlgorithm, termSets } = this.props;

    let customTermsetDiv = (
      <FormGroup>
        <Label for="customTermset">Term Set</Label>
        <Input
          type="select"
          id="customTermset"
          name="customTermset"
          onChange={this.props.handleInputChange}
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
          onChange={this.props.handleInputChange}
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
          type="text"
          id="customDocumentset"
          name="customDocumentset"
          value={this.props.customDocumentset}
          onChange={this.props.handleInputChange}
          placeholder="Enter comma separated terms."
        />
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
          onChange={this.props.handleInputChange}
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
          onChange={this.props.handleInputChange}
          placeholder="Enter comma separated terms."
        />
      </FormGroup>
    );

    let customCohortDiv = (
      <FormGroup>
        <Label for="customCohort">Cohort</Label>
        <Input
          type="text"
          id="customCohort"
          name="customCohort"
          value={this.props.customCohort}
          onChange={this.props.handleInputChange}
        />
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
          onChange={this.props.handleInputChange}
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
          onChange={this.props.handleInputChange}
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
          onChange={this.props.handleInputChange}
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
          onChange={this.props.handleInputChange}
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
          onChange={this.props.handleInputChange}
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
          onChange={this.props.handleInputChange}
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
          onChange={this.props.handleInputChange}
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
            onChange={this.props.handleInputChange}
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
            onChange={this.props.handleInputChange}
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
            onChange={this.props.handleInputChange}
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
            onChange={this.props.handleInputChange}
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
            onChange={this.props.handleInputChange}
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
            onChange={this.props.handleInputChange}
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
            onChange={this.props.handleInputChange}
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
            onChange={this.props.handleInputChange}
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
            onChange={this.props.handleInputChange}
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
            onChange={this.props.handleInputChange}
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
        {featureAlgorithm === "ValueExtraction" ? customEnumListDiv : null}
        {featureAlgorithm === "ProviderAssertion" ||
        featureAlgorithm === "TermFinder" ||
        featureAlgorithm === "MeasurementFinder" ||
        featureAlgorithm === "NamedEntityRecognition"
          ? customSectionsDiv
          : null}
        {customCohortDiv}
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
    return (
      <div className="modal-container">
        <Button
          color="primary"
          onClick={this.toggle}
          disabled={this.props.isDisabled}
        >
          {this.props.buttonLabel}
        </Button>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={this.props.className}
          id={this.props.id}
        >
          <ModalHeader toggle={this.toggle}>Define Feature</ModalHeader>
          <Form>
            <ModalBody>
              <FormGroup>
                <Label for="featureName">Feature Name</Label>
                <Input
                  type="text"
                  id="featureName"
                  name="featureName"
                  value={this.props.featureName}
                  onChange={this.props.handleInputChange}
                />
              </FormGroup>

              <FormGroup>
                <Label for="featureAlgorithm">Select Algorithm</Label>
                <Input
                  type="select"
                  id="featureAlgorithm"
                  name="featureAlgorithm"
                  value={this.props.featureAlgorithm}
                  onChange={this.props.handleInputChange}
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
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                type="submit"
                id="submit"
                onClick={this.handleSubmit}
              >
                Save changes
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default DefineFeatureModal;
