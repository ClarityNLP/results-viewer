/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from "react";

import SubmitButton from "../../UIkit/SubmitButton";

import plus from "../../assets/icons/svg/plus.svg";
import minus from "../../assets/icons/svg/minus.svg";

const initialState = {
    icon: plus,
    collapse: true,
    name: "",
    reportTypes: "",
    reportTags: "",
    sources: "",
    filterQuery: "",
    query: ""
};

class DocumentSetForm extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = initialState;
    }

    toggle = () => {
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

    renderDocumentSetCount() {
        let count = this.props.documentSets.length;

        if (count === 0) {
            return null;
        }

        return <span class="tag">{count}</span>;
    }

    handleSubmit = event => {
        event.preventDefault();

        const {
            name,
            reportTypes,
            reportTags,
            sources,
            filterQuery,
            query
        } = this.state;

        let hasTypes = reportTypes.length > 0 && reportTypes[0].length > 0;
        let hasTags = reportTags.length > 0 && reportTags[0].length > 0;
        let hasSource = sources.length > 0 && sources[0].length > 0;
        let hasFilterQuery = filterQuery.length > 0;
        let hasQuery = query.length > 0;

        let text = "documentset " + name + ":\n\t";

        if (
            hasTypes &&
            !hasTags &&
            !hasSource &&
            !hasFilterQuery &&
            !hasQuery
        ) {
            text +=
                "Clarity.createReportTypeList(" +
                this.buildArrayStringWithQuotes(reportTypes) +
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
                this.buildArrayStringWithQuotes(reportTags) +
                ");\n\n";
        } else {
            let payloadKeys = [];

            if (hasTypes) {
                payloadKeys.push(
                    "report_types: " +
                        this.buildArrayStringWithQuotes(reportTypes)
                );
            }

            if (hasTags) {
                payloadKeys.push(
                    "report_tags: " +
                        this.buildArrayStringWithQuotes(reportTags)
                );
            }

            if (hasSource) {
                payloadKeys.push(
                    "source: " + this.buildArrayStringWithQuotes(sources)
                );
            }

            if (hasFilterQuery) {
                payloadKeys.push(
                    'filter_query: "' + filterQuery.replace(/"/g, "'") + '"'
                );
            }

            if (hasQuery) {
                payloadKeys.push('query: "' + query.replace(/"/g, "'") + '"');
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

        this.props.appendDocumentSet(name);
        this.props.updateNLPQL(text);
        this.toggle();
        this.setState(initialState);
    };

    render() {
        const {
            collapse,
            name,
            sources,
            query,
            reportTypes,
            reportTags,
            filterQuery,
            icon
        } = this.state;

        return (
            <React.Fragment>
                <header className="card-header" onClick={this.toggle}>
                    <p className="card-header-title">
                        Document Set {this.renderDocumentSetCount()}
                    </p>
                    <a
                        href="#"
                        className="card-header-icon"
                        aria-label="more options"
                    >
                        <span className="icon">
                            <img height="16px" src={icon} alt="" />
                        </span>
                    </a>
                </header>
                <div
                    className={
                        collapse ? "card-content hidden" : "card-content"
                    }
                >
                    <form>
                        {/* NAME INPUT */}
                        <div className="field">
                            <label className="label">Name</label>
                            <input
                                className="input"
                                type="text"
                                name="name"
                                value={name}
                                onChange={this.handleInputChange}
                            />
                        </div>

                        <div className="field">
                            <label className="label">Data Source</label>
                            <input
                                className="input"
                                type="text"
                                name="sources"
                                value={sources}
                                onChange={this.handleInputChange}
                                placeholder="Separate entries with a comma."
                            />
                        </div>

                        <div className="field">
                            <label className="label">Query</label>
                            <input
                                className="input"
                                type="text"
                                name="query"
                                value={query}
                                onChange={this.handleInputChange}
                            />
                        </div>

                        <div id="documentsetList">
                            <div className="field">
                                <label className="label">Report Types</label>
                                <input
                                    className="input"
                                    type="text"
                                    name="reportTypes"
                                    value={reportTypes}
                                    onChange={this.handleInputChange}
                                    placeholder="Separate entries with a comma."
                                />
                            </div>

                            <div className="field">
                                <label className="label">Report Tags</label>
                                <input
                                    className="input"
                                    type="text"
                                    name="reportTags"
                                    value={reportTags}
                                    onChange={this.handleInputChange}
                                    placeholder="Separate entries with a comma."
                                />
                            </div>

                            <div className="field">
                                <label className="label">Filter Query</label>
                                <input
                                    className="input"
                                    type="text"
                                    name="filterQuery"
                                    value={filterQuery}
                                    onChange={this.handleInputChange}
                                />
                            </div>
                        </div>

                        <SubmitButton
                            handleSubmit={this.handleSubmit}
                            label="Add Document Set"
                        />
                    </form>
                </div>
            </React.Fragment>
        );
    }
}

export default DocumentSetForm;
