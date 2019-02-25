/* eslint no-eval: 0 */

import React, { Component } from "react";
import axios from "axios";
import _ from "lodash";
import uuid from "uuid";

const ALL = 4;
const page_size = 100;

class ResultData {
    constructor(callback, job, get_url) {
        this._dataList = [];
        this._end = page_size;
        this._pending = false;
        this._dataVersion = 0;
        this._callback = callback;
        this.job = job;
        this.get_url = get_url;
        this.new_last_id = "";
        this.size = page_size;
        this.no_more = false;
        this.columns = [];

        this.getDataStore(job, get_url, true);
    }

    getDataStore(job, get_url, first, resolve) {
        if (first) {
            axios.get(get_url).then(response => {
                if (response.data.success) {
                    let results = response.data.results;
                    this.new_last_id = response.data.new_last_id;
                    this.size = response.data.count;
                    this.no_more = response.data.no_more;
                    this.columns = response.data.columns;
                    this._dataList = results;
                }
                this._callback(page_size);
            });
        } else {
            axios
                .get(get_url + "?last_id=" + this.new_last_id)
                .then(response => {
                    if (response.data.success) {
                        let results = response.data.results;
                        if (resolve !== null) {
                            resolve({
                                last_id: response.data.new_last_id,
                                no_more: response.data.no_more,
                                results: results
                            });
                        }
                    }
                });
        }
    }

    appendResults(results) {
        this._dataList = _.concat(this._dataList, results);
    }

    getDataVersion() {
        return this._dataVersion;
    }

    getSize() {
        return this.size;
    }

    fetchRange(end) {
        if (this._pending) {
            return;
        }

        this._pending = true;
        return new Promise(resolve => {
            this.getDataStore(this.job, this.get_url, false, resolve);
        }).then(res => {
            console.log("done loading data store");
            this._pending = false;
            this._end = end;
            this._dataVersion++;
            this.new_last_id = res.last_id;
            this.no_more = res.no_more;
            this.appendResults(res.results);

            this._callback(end);
        });
    }

    getObjectAt(index) {
        if (index >= this._end) {
            this.fetchRange(Math.min(this.size, index + page_size));
            return null;
        }
        if (this._dataList.length > index) {
            return this._dataList[index];
        }
        return null;
    }
}

class RawResultsView extends Component {
    constructor(props) {
        super(props);

        this.updateData = this.updateData.bind(this);
        this.checkExportApiHealth = this.checkExportApiHealth.bind(this);
        this.openExportModal = this.openExportModal.bind(this);
        this.toggle = this.toggle.bind(this);
        this.toggleAlert = this.toggleAlert.bind(this);

        let final_results = props.mode === ALL;
        let job_id = props.job.nlp_job_id;
        let get_url =
            this.props.url +
            "phenotype_paged_results/" +
            job_id +
            "/" +
            final_results;

        this.state = {
            ResultData: new ResultData(this.updateData, props.job, get_url),
            end: 0,
            mode: props.mode,
            modal: false,
            successAlert: false,
            failureAlert: false,
            alertMessage: "",
            exportApiHealth: false
        };

        this.checkExportApiHealth();
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    checkExportApiHealth() {
        let __this = this;
        axios
            .get(process.env.REACT_APP_EXPORT_URL)
            .then(function(response) {
                __this.setState({
                    exportApiHealth: true
                });
            })
            .catch(function(error) {
                __this.setState({
                    exportApiHealth: false
                });
            });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.mode !== this.props.mode) {
            let final_results = this.props.mode === ALL;
            let job_id = this.props.job.nlp_job_id;
            let get_url =
                this.props.url +
                "phenotype_paged_results/" +
                job_id +
                "/" +
                final_results;

            this.setState({
                ResultData: new ResultData(
                    this.updateData,
                    this.props.job,
                    get_url
                ),
                mode: this.props.mode
            });
        }
    }

    updateData(end) {
        this.setState({
            end: end
        });
    }

    componentWillUnmount() {
        this.setState({
            successAlert: false,
            failureAlert: true
        });
    }

    toggleAlert(response) {
        if (response === true) {
            this.setState({
                successAlert: true,
                failureAlert: false
            });
        } else {
            this.setState({
                successAlert: false,
                failureAlert: true
            });
        }
    }

    openExportModal() {
        this.toggle();
        this.setState({
            successAlert: false,
            failureAlert: false
        });
    }

    // Function to export intermediate results to OMOP database
    exportToOMOP() {
        let __this = this;
        let data = JSON.stringify({
            job_id: this.props.job.nlp_job_id,
            result_name: document.getElementById("omopResultName").value,
            omop_domain: document.getElementById("omopDomain").value,
            concept_id: document.getElementById("omopConceptId").value
        });

        axios
            .post(process.env.REACT_APP_EXPORT_URL, data, {
                headers: {
                    "Content-Type": "application/json"
                }
            })

            .then(function(response) {
                let data = eval(response);
                let message = data["data"];
                __this.toggleAlert(true);
                __this.setState({
                    alertMessage: message
                });
            })
            .catch(function(error) {
                let data = eval(error.response);
                let message = data["data"];
                __this.toggleAlert(false);
                __this.setState({
                    alertMessage: message
                });
            });
    }

    populateResultListInModal(result_names) {
        let array = Array.from(result_names);
        let items = [];
        for (let i = 0; i < array.length; i++) {
            items.push(<option key={array[i]}>{array[i]}</option>);
        }
        return items;
    }

    getHeadings = () => {
        const { ResultData } = this.state;
        let tmp = [];
        const result = ResultData._dataList[0];

        for (let prop in result) {
            if (result.hasOwnProperty(prop)) {
                tmp.push(<th key={uuid.v4()}>{prop}</th>);
            }
        }

        return <tr key={uuid.v4()}>{tmp}</tr>;
    };

    getRows = () => {
        const { ResultData } = this.state;

        return ResultData._dataList.map(result => {
            let tmp = [];

            for (let prop in result) {
                if (result.hasOwnProperty(prop)) {
                    tmp.push(<td key={uuid.v4()}>{result[prop]}</td>);
                }
            }

            return <tr key={uuid.v4()}>{tmp}</tr>;
        });
    };

    render() {
        let { ResultData } = this.state;

        // iterating over the results to get the unique nlpql_feature names
        let result_names = new Set();

        ResultData._dataList.forEach(function(resultData) {
            result_names.add(resultData.nlpql_feature);
        });

        return (
            <React.Fragment>
                {this.state.ResultData.getSize() > 0 ? (
                    <div className="RawResultsTable column is-full">
                        <table className="table is-striped is-bordered">
                            <thead>{this.getHeadings()}</thead>
                            <tbody>{this.getRows()}</tbody>
                        </table>

                        {this.state.exportApiHealth === true ? (
                            <div className="exportButton">
                                <button
                                    className="button is-priamry is-large"
                                    onClick={this.openExportModal}
                                >
                                    Export Results
                                </button>
                            </div>
                        ) : null}

                        <div id="exportResultModal">
                            <div
                                className={
                                    this.state.modal
                                        ? "modal is-active"
                                        : "modal"
                                }
                            >
                                <div className="modal-background" />
                                <div className="modal-card">
                                    <header className="modal-card-head">
                                        <p className="modal-card-title">
                                            Export Results - Job ID:{" "}
                                            {this.props.job.nlp_job_id}
                                        </p>
                                        <button
                                            className="delete"
                                            aria-label="close"
                                            onClick={this.toggle}
                                        />
                                    </header>
                                    <section className="modal-card-body">
                                        <form>
                                            {this.state.successAlert ===
                                            true ? (
                                                <div class="notification is-success">
                                                    {this.state.alertMessage}
                                                </div>
                                            ) : null}
                                            {this.state.failureAlert ===
                                            true ? (
                                                <div class="notification is-danger">
                                                    {this.state.alertMessage}
                                                </div>
                                            ) : null}
                                            <div className="field">
                                                <label
                                                    className="label"
                                                    htmlFor="resultName"
                                                >
                                                    Result Name
                                                </label>
                                                <select
                                                    className="input"
                                                    name="resultName"
                                                    id="omopResultName"
                                                >
                                                    {this.populateResultListInModal(
                                                        result_names
                                                    )}
                                                </select>
                                            </div>
                                            <div className="field">
                                                <label
                                                    className="label"
                                                    htmlFor="conceptId"
                                                >
                                                    Concept ID
                                                </label>
                                                <input
                                                    className="input"
                                                    type="text"
                                                    name="conceptId"
                                                    id="omopConceptId"
                                                    placeholder="Enter Concept ID"
                                                />
                                            </div>
                                            <div className="field">
                                                <label
                                                    className="label"
                                                    htmlFor="domain"
                                                >
                                                    OMOP Domain
                                                </label>
                                                <select
                                                    className="input"
                                                    name="domain"
                                                    id="omopDomain"
                                                >
                                                    <option>Observation</option>
                                                    <option>Condition</option>
                                                    <option>Measurement</option>
                                                </select>
                                            </div>
                                            <pre>{this.state.report_text}</pre>
                                        </form>
                                    </section>
                                    <footer className="modal-card-foot">
                                        <div className="column is-5 is-offset-7">
                                            <button
                                                className="button is-primary"
                                                onClick={this.exportToOMOP}
                                            >
                                                Export
                                            </button>
                                        </div>
                                    </footer>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>No results present.</p>
                )}
            </React.Fragment>
        );
    }
}

export default RawResultsView;
