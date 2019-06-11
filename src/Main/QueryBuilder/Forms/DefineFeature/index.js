/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from "react";
import Select from "react-select";
import SubmitButton from "../SubmitButton";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

const initialState = {
    collapse: true,
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

        this.state = initialState;
    }

    toggle = () => {
        this.setState(prevState => ({
            collapse: !prevState.collapse
        }));
    };

    handleInputChange = event => {
        const target = event.target;
        const value =
            target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    };

    handleAlgorithmChange = value => {
        this.setState({
            featureAlgorithm: value
        });
    };

    handleTermSetSelect = value => {
        this.setState({
            customTermset: value
        });
    };

    handleTermSet2Select = value => {
        this.setState({
            customTermset2: value
        });
    };

    handleDocumentSetSelect = value => {
        this.setState({
            customDocumentset: value
        });
    };

    handleCohortSelect = value => {
        this.setState({
            customCohort: value
        });
    };

    buildArrayStringWithQuotes = s => {
        const arr = s.split(",");

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

    renderFeatureCount = () => {
        const count = this.props.features.length;

        if (count > 0) {
            return <span className="tag">{count}</span>;
        }

        return null;
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

        const payload = [];

        const algorithm = featureAlgorithm.value;

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
                "documentset: " +
                    this.buildArrayStringWithoutQuotes(documentSets)
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

        if (algorithm === "Ngram") {
            //Ngram-n
            if (customNgramN != null && customNgramN.length > 0) {
                payload.push('n: "' + customNgramN.trim() + '"');
            }

            //min-Frequency
            if (customMinFreq != null && customMinFreq.length > 0) {
                payload.push("min_freq: " + customMinFreq.trim());
            }

            //filter-nums
            if (customFilterNums) {
                payload.push("filter_nums: " + customFilterNums);
            }

            //filter-stops
            if (customFilterStops) {
                payload.push("filter_stops: " + customFilterStops);
            }

            //filter-punct
            if (customFilterPunct) {
                payload.push("filter_punct: " + customFilterPunct);
            }

            //lemmas
            if (customLemmas) {
                payload.push("lemmas: " + customLemmas);
            }

            // limit termset
            if (customLimitTermset) {
                payload.push("limit_to_termset: " + customLimitTermset);
            }
        }

        if (algorithm === "ProviderAssertion" || algorithm === "TermFinder") {
            //Synonyms
            if (customSynonyms) {
                payload.push("include_synonyms: " + customSynonyms);
            }

            // descendants
            if (customDescendants) {
                payload.push("include_descendants: " + customDescendants);
            }

            // include_ancestors
            if (customAncestors) {
                payload.push("include_ancestors: " + customAncestors);
            }

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
            if (customAnyOrder) {
                payload.push("any_order: " + customAnyOrder);
            }
        }

        if (algorithm === "ValueExtraction") {
            //enum list
            if (customEnumList.length > 0 && customEnumList[0].length > 0) {
                payload.push(
                    "enum_list: " +
                        this.buildArrayStringWithQuotes(customEnumList)
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
            if (customCaseSensitive) {
                payload.push("case_sensitive: " + customCaseSensitive);
            }
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

        const customTermsetDiv = (
            <div className="field">
                <label className="label">Term Set</label>
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
            </div>
        );

        const customTermset2Div = (
            <div className="field">
                <label className="label">Term Set 2</label>
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
            </div>
        );

        const customDocumentsetDiv = (
            <div className="field">
                <label className="label">Document Set</label>
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
            </div>
        );

        const customSectionsDiv = (
            <div className="field">
                <label className="label">Sections</label>
                <input
                    className="input"
                    type="text"
                    name="customSections"
                    value={customSections}
                    onChange={this.handleInputChange}
                    placeholder="Separate entries with a comma."
                />
            </div>
        );

        const customEnumListDiv = (
            <div className="field">
                <label className="label">Enum List</label>
                <input
                    className="input"
                    type="text"
                    name="customEnumList"
                    value={customEnumList}
                    onChange={this.handleInputChange}
                    placeholder="Separate entries with a comma."
                />
            </div>
        );

        const customCohortDiv = (
            <div className="field">
                <label className="label">Cohort</label>
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
            </div>
        );

        const customGroupbyDiv = (
            <div className="field">
                <label className="label">Group By</label>
                <input
                    className="input"
                    type="text"
                    name="customGroupby"
                    value={customGroupby}
                    onChange={this.handleInputChange}
                />
            </div>
        );

        const customNgramNDiv = (
            <div className="field">
                <label className="label">n</label>
                <input
                    className="input"
                    type="text"
                    name="customNgramN"
                    value={customNgramN}
                    onChange={this.handleInputChange}
                />
            </div>
        );

        const customMinFreqDiv = (
            <div className="field">
                <label className="label">Minimum Frequency</label>
                <input
                    className="input"
                    type="text"
                    name="customMinFreq"
                    value={customMinFreq}
                    onChange={this.handleInputChange}
                />
            </div>
        );

        const customVocabularyDiv = (
            <div className="field">
                <label className="label">Vocabulary</label>
                <input
                    className="input"
                    type="text"
                    name="customVocabulary"
                    value={customVocabulary}
                    onChange={this.handleInputChange}
                />
            </div>
        );

        const customWordDistDiv = (
            <div className="field">
                <label className="label">Word Distance</label>
                <input
                    className="input"
                    type="text"
                    name="customWordDist"
                    value={customWordDist}
                    onChange={this.handleInputChange}
                />
            </div>
        );

        const customMinValDiv = (
            <div className="field">
                <label className="label">Minimum Value</label>
                <input
                    className="input"
                    type="text"
                    name="customMinVal"
                    value={customMinVal}
                    onChange={this.handleInputChange}
                />
            </div>
        );

        const customMaxValDiv = (
            <div className="field">
                <label className="label">Maximum Value</label>
                <input
                    className="input"
                    type="text"
                    name="customMaxVal"
                    value={customMaxVal}
                    onChange={this.handleInputChange}
                />
            </div>
        );

        const customAnyOrderDiv = (
            <div className="field">
                <label className="checkbox">
                    <input
                        type="checkbox"
                        name="customAnyOrder"
                        checked={customAnyOrder}
                        onChange={this.handleInputChange}
                    />{" "}
                    Any Order
                </label>
            </div>
        );

        const customFilterNumsDiv = (
            <div className="field">
                <label className="checkbox">
                    <input
                        type="checkbox"
                        name="customFilterNums"
                        checked={customFilterNums}
                        onChange={this.handleInputChange}
                    />{" "}
                    Filter Numbers
                </label>
            </div>
        );

        const customFilterStopsDiv = (
            <div className="field">
                <label className="checkbox">
                    <input
                        type="checkbox"
                        name="customFilterStops"
                        checked={customFilterStops}
                        onChange={this.handleInputChange}
                    />{" "}
                    Filter Stops
                </label>
            </div>
        );

        const customFilterPunctDiv = (
            <div className="field">
                <label className="checkbox">
                    <input
                        type="checkbox"
                        name="customFilterPunct"
                        checked={customFilterPunct}
                        onChange={this.handleInputChange}
                    />{" "}
                    Filter Punctuations
                </label>
            </div>
        );

        const customLemmasDiv = (
            <div className="field">
                <label className="checkbox">
                    <input
                        type="checkbox"
                        name="customLemmas"
                        checked={customLemmas}
                        onChange={this.handleInputChange}
                    />{" "}
                    Lemmas
                </label>
            </div>
        );

        const customLimitTermsetDiv = (
            <div className="field">
                <label className="checkbox">
                    <input
                        type="checkbox"
                        name="customLimitTermset"
                        checked={customLimitTermset}
                        onChange={this.handleInputChange}
                    />{" "}
                    Limit to Termset
                </label>
            </div>
        );

        const customSynonymsDiv = (
            <div className="field">
                <label className="checkbox">
                    <input
                        type="checkbox"
                        name="customSynonyms"
                        checked={customSynonyms}
                        onChange={this.handleInputChange}
                    />{" "}
                    Synonyms
                </label>
            </div>
        );

        const customDescendantsDiv = (
            <div className="field">
                <label className="checkbox" check>
                    <input
                        type="checkbox"
                        name="customDescendants"
                        checked={customDescendants}
                        onChange={this.handleInputChange}
                    />{" "}
                    Descendants
                </label>
            </div>
        );

        const customAncestorsDiv = (
            <div className="field">
                <label className="checkbox">
                    <input
                        type="checkbox"
                        name="customAncestors"
                        checked={customAncestors}
                        onChange={this.handleInputChange}
                    />{" "}
                    Ancestors
                </label>
            </div>
        );

        const customCaseSensitiveDiv = (
            <div className="field">
                <label className="checkbox">
                    <input
                        type="checkbox"
                        name="customCaseSensitive"
                        checked={customCaseSensitive}
                        onChange={this.handleInputChange}
                    />{" "}
                    Case Sensitive
                </label>
            </div>
        );

        const isFinalDiv = (
            <div className="field">
                <label className="checkbox is-large">
                    <input
                        type="checkbox"
                        name="isFinal"
                        checked={isFinal}
                        onChange={this.handleInputChange}
                    />{" "}
                    Include in Final Results
                </label>
            </div>
        );

        const algorithm = featureAlgorithm.value;

        if (algorithm === "") {
            return;
        }

        return (
            <React.Fragment>
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
                {algorithm === "ValueExtraction"
                    ? customCaseSensitiveDiv
                    : null}
                {algorithm === "TextStats" ? customGroupbyDiv : null}
                {algorithm === "Ngram" ? customNgramNDiv : null}
                {algorithm === "Ngram" ? customMinFreqDiv : null}
                {algorithm === "Ngram" ? customFilterNumsDiv : null}
                {algorithm === "Ngram" ? customFilterStopsDiv : null}
                {algorithm === "Ngram" ? customFilterPunctDiv : null}
                {algorithm === "Ngram" ? customLemmasDiv : null}
                {algorithm === "Ngram" ? customLimitTermsetDiv : null}
                {algorithm !== "" ? isFinalDiv : null}
            </React.Fragment>
        );
    };

    render() {
        const { collapse, featureName, featureAlgorithm } = this.state;

        return (
            <React.Fragment>
                <header className="card-header" onClick={this.toggle}>
                    <p className="card-header-title">
                        Feature {this.renderFeatureCount()}
                    </p>
                    <span
                        className="card-header-icon"
                        aria-label="more options"
                    >
                        <span className="icon">
                            {collapse ? <FaAngleDown /> : <FaAngleUp />}
                        </span>
                    </span>
                </header>
                <div
                    className={
                        collapse ? "card-content hidden" : "card-content"
                    }
                >
                    <form>
                        <div className="field">
                            <label className="label">Feature Name</label>
                            <input
                                className="input"
                                type="text"
                                name="featureName"
                                value={featureName}
                                onChange={this.handleInputChange}
                            />
                        </div>

                        <div className="field">
                            <label className="label">Select Algorithm</label>
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
                                        value: "Ngram",
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
                                        label:
                                            "Transfusion Nursing Notes Parser"
                                    }
                                ]}
                            />
                        </div>

                        {this.renderInputsForAlgorithm()}

                        <SubmitButton
                            handleSubmit={this.handleSubmit}
                            label="Add Feature"
                        />
                    </form>
                </div>
            </React.Fragment>
        );
    }
}

export default DefineFeatureForm;
