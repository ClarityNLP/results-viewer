/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from "react";
import {
  Row,
  Col,
  Collapse,
  Form,
  FormGroup,
  Label,
  Input,
  CardHeader,
  CardBody
} from "reactstrap";
import Select from "react-select";

import SubmitButton from "../../UIkit/SubmitButton";

import plus from "../../assets/icons/svg/plus.svg";
import minus from "../../assets/icons/svg/minus.svg";

const initialState = {
  icon: plus,
  collapse: false,
  featureName: "",
  featureAlgorithm: { value: "", label: "" },
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
  customFilterStops: true,
  customFilterPunct: true,
  customLemmas: true,
  customLimitTermset: false,
  customSynonyms: false,
  customDescendants: false,
  customAncestors: false,
  customCaseSensitive: false,
  isFinal: false
};

class DefineFeatureForm extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleAlgorithmChange = this.handleAlgorithmChange.bind(this);
    this.handleTermSetSelect = this.handleTermSetSelect.bind(this);
    this.handleTermSet2Select = this.handleTermSet2Select.bind(this);
    this.handleDocumentSetSelect = this.handleDocumentSetSelect.bind(this);
    this.handleCohortSelect = this.handleCohortSelect.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = initialState;
  }

  toggle() {
    const { icon } = this.state;
    let tmp = null;

    if (icon === plus) {
      tmp = minus;
    } else {
      tmp = plus;
    }

    this.setState({
      collapse: !this.state.collapse,
      icon: tmp
    });
  }

  handleInputChange(event) {
    const target = event.target;
    let value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleAlgorithmChange(value) {
    this.setState({
      featureAlgorithm: value
    });
  }

  handleTermSetSelect(value) {
    this.setState({
      customTermset: value
    });
  }

  handleTermSet2Select(value) {
    this.setState({
      customTermset2: value
    });
  }

  handleDocumentSetSelect(value) {
    this.setState({
      customDocumentset: value
    });
  }

  handleCohortSelect(value) {
    this.setState({
      customCohort: value
    });
  }

  updateOptions(arr) {}

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

  buildArrayStringWithoutQuotes = arr => {
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
      customCaseSensitive,
      isFinal
    } = this.state;

    let payload = [];

    let algorithm = featureAlgorithm.value;

    if (algorithm === "") {
      return;
    }

    //termset
    if (customTermset.length > 0) {
      const termSets = customTermset.map(value => {
        return value.value;
      });

      if (algorithm === "TermProximityTask") {
        payload.push(
          "termset1: " + this.buildArrayStringWithoutQuotes(termSets)
        );
      } else {
        payload.push(
          "termset: " + this.buildArrayStringWithoutQuotes(termSets)
        );
      }
    }

    //termset2
    if (customTermset2.length > 0) {
      const termSets2 = customTermset2.map(value => {
        return value.value;
      });

      payload.push(
        "termset2: " + this.buildArrayStringWithoutQuotes(termSets2)
      );
    }

    //documentset
    if (customDocumentset.length > 0) {
      const documentSets = customDocumentset.map(value => {
        return value.value;
      });

      payload.push(
        "documentset: " + this.buildArrayStringWithoutQuotes(documentSets)
      );
    }

    // cohort
    if (customCohort.length > 0) {
      const cohorts = customCohort.map(value => {
        return value.value;
      });

      payload.push('cohort: "' + cohorts + '"');
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

    if (algorithm === "ngram") {
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

    if (algorithm === "ProviderAssertion" || algorithm === "TermFinder") {
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

    if (algorithm === "TermProximityTask") {
      // word distance
      if (customWordDist != null && customWordDist.length > 0) {
        payload.push("word_distance: " + customWordDist.trim());
      }

      //anyorder
      payload.push("any_order: " + customAnyOrder);
    }

    if (algorithm === "ValueExtraction") {
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
    let text = "define ";
    if (isFinal) {
      text += "final ";
    }
    text += featureName + ":\n\t";
    text += "Clarity." + algorithm + "({\n\t\t";

    for (let i = 0; i < payload.length; i++) {
      text += payload[i];
      if (i < payload.length - 1) {
        text += ",\n\t\t";
      }
    }
    text += "\n\t});\n\n";

    this.props.appendFeature({
      name: featureName,
      algorithm: algorithm
    });

    this.props.updateNLPQL(text);
    this.toggle();
    this.setState(initialState);
  };

  renderInputsForAlgorithm = () => {
    const {
      customTermset,
      customTermset2,
      customDocumentSet,
      customCohort,
      featureAlgorithm,
      customSections,
      customEnumList,
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
      customCaseSensitive,
      isFinal
    } = this.state;
    const { termSets, documentSets, cohorts } = this.props;

    let customTermsetDiv = (
      <FormGroup>
        <Label>Term Set</Label>
        <Select
          isMulti={true}
          value={customTermset}
          onChange={this.handleTermSetSelect}
          options={termSets.map(value => {
            return {
              value: value,
              label: value
            };
          })}
        />
      </FormGroup>
    );

    let customTermset2Div = (
      <FormGroup>
        <Label>Term Set 2</Label>
        <Select
          isMulti={true}
          value={customTermset2}
          onChange={this.handleTermSet2Select}
          options={termSets.map(value => {
            return {
              value: value,
              label: value
            };
          })}
        />
      </FormGroup>
    );

    let customDocumentsetDiv = (
      <FormGroup>
        <Label>Document Set</Label>
        <Select
          isMulti={true}
          value={customDocumentSet}
          onChange={this.handleDocumentSetSelect}
          options={documentSets.map(value => {
            return {
              value: value,
              label: value
            };
          })}
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
          value={customSections}
          onChange={this.handleInputChange}
          placeholder="Separate entries with a comma."
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
          value={customEnumList}
          onChange={this.handleInputChange}
          placeholder="Separate entries with a comma."
        />
      </FormGroup>
    );

    let customCohortDiv = (
      <FormGroup>
        <Label>Cohort</Label>
        <Select
          isMulti={true}
          value={customCohort}
          onChange={this.handleCohortSelect}
          options={cohorts.map(value => {
            return {
              value: value,
              label: value
            };
          })}
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
          value={customGroupby}
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
          value={customNgramN}
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
          value={customMinFreq}
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
          value={customVocabulary}
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
          value={customWordDist}
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
          value={customMinVal}
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
          value={customMaxVal}
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
            checked={customAnyOrder}
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
            checked={customFilterNums}
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
            checked={customFilterStops}
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
            checked={customFilterPunct}
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
            checked={customLemmas}
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
            checked={customLimitTermset}
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
            checked={customSynonyms}
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
            checked={customDescendants}
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
            checked={customAncestors}
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
            checked={customCaseSensitive}
            onChange={this.handleInputChange}
          />{" "}
          Case Sensitive
        </Label>
      </FormGroup>
    );

    let isFinalDiv = (
      <FormGroup check className="mt-3 mb-3">
        <Label check size="lg">
          <Input
            type="checkbox"
            id="isFinal"
            name="isFinal"
            checked={isFinal}
            onChange={this.handleInputChange}
          />
          Include in final results
        </Label>
      </FormGroup>
    );

    let algorithm = featureAlgorithm.value;

    if (algorithm === "") {
      return;
    }

    return (
      <div>
        {customTermsetDiv}
        {algorithm === "TermProximityTask" ? customTermset2Div : null}
        {customDocumentsetDiv}
        {customCohortDiv}
        {algorithm === "ValueExtraction" ? customEnumListDiv : null}
        {algorithm === "ProviderAssertion" ||
        algorithm === "TermFinder" ||
        algorithm === "MeasurementFinder" ||
        algorithm === "NamedEntityRecognition"
          ? customSectionsDiv
          : null}
        {algorithm === "ProviderAssertion" || algorithm === "TermFinder"
          ? customVocabularyDiv
          : null}
        {algorithm === "ProviderAssertion" || algorithm === "TermFinder"
          ? customSynonymsDiv
          : null}
        {algorithm === "ProviderAssertion" || algorithm === "TermFinder"
          ? customDescendantsDiv
          : null}
        {algorithm === "ProviderAssertion" || algorithm === "TermFinder"
          ? customAncestorsDiv
          : null}
        {algorithm === "TermProximityTask" ? customWordDistDiv : null}
        {algorithm === "TermProximityTask" ? customAnyOrderDiv : null}
        {algorithm === "ValueExtraction" ? customMinValDiv : null}
        {algorithm === "ValueExtraction" ? customMaxValDiv : null}
        {algorithm === "ValueExtraction" ? customCaseSensitiveDiv : null}
        {algorithm === "TextStats" ? customGroupbyDiv : null}
        {algorithm === "ngram" ? customNgramNDiv : null}
        {algorithm === "ngram" ? customMinFreqDiv : null}
        {algorithm === "ngram" ? customFilterNumsDiv : null}
        {algorithm === "ngram" ? customFilterStopsDiv : null}
        {algorithm === "ngram" ? customFilterPunctDiv : null}
        {algorithm === "ngram" ? customLemmasDiv : null}
        {algorithm === "ngram" ? customLimitTermsetDiv : null}
        {algorithm !== "" ? isFinalDiv : null}
      </div>
    );
  };

  render() {
    const { icon, collapse, featureName, featureAlgorithm } = this.state;

    return (
      <div>
        <CardHeader onClick={this.toggle}>
          <Row className="justify-content-between">
            <Col>Feature</Col>
            <Col className="text-right">
              <img height="16px" src={icon} alt="" />
            </Col>
          </Row>
        </CardHeader>
        <Collapse isOpen={collapse}>
          <CardBody>
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
                <Select
                  value={featureAlgorithm}
                  onChange={this.handleAlgorithmChange}
                  options={[
                    {
                      value: "",
                      label: ""
                    },
                    {
                      value: "MeasurementFinder",
                      label: "Measurement Finder"
                    },
                    {
                      value: "NamedEntityRecognition",
                      label: "Named Entity Recognition"
                    },
                    {
                      value: "ngram",
                      label: "Ngram"
                    },
                    {
                      value: "POSTagger",
                      label: "POS Tagger"
                    },
                    {
                      value: "ProviderAssertion",
                      label: "Provider Assertion"
                    },
                    {
                      value: "TermProximityTask",
                      label: "Term Proximity Task"
                    },
                    {
                      value: "TermFinder",
                      label: "Term Finder"
                    },
                    {
                      value: "ValueExtraction",
                      label: "Value Extraction"
                    },
                    {
                      value: "GleasonScoreTask",
                      label: "Gleason Score Task"
                    },
                    {
                      value: "RaceFinderTask",
                      label: "Race Finder Task"
                    },
                    {
                      value: "PFTFinder",
                      label: "PFT Finder"
                    },
                    {
                      value: "TextStats",
                      label: "Text Stats"
                    },
                    {
                      value: "TNMStager",
                      label: "TNM Stager"
                    },
                    {
                      value: "TransfusionNursingNotesParser",
                      label: "Transfusion Nursing Notes Parser"
                    }
                  ]}
                />
              </FormGroup>

              {this.renderInputsForAlgorithm()}

              <SubmitButton
                handleSubmit={this.handleSubmit}
                label="Add Feature"
              />
            </Form>
          </CardBody>
        </Collapse>
      </div>
    );
  }
}

export default DefineFeatureForm;
