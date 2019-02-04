import React, { Component } from "react";
import axios from "axios";
import _ from "lodash";
import ReactJson from "react-json-view";
import QueryBuilder from "./QueryBuilder";
import { Button, Row, Col, Container } from "reactstrap";
import LimitForm from "./Forms/LimitForm";
import PhenotypeForm from "./Forms/PhenotypeForm";

const base_url = process.env.REACT_APP_CLARITY_NLP_URL;

const ResponseView = data => {
    return (
        <div>
            <ReactJson
                src={data}
                displayObjectSize={false}
                displayDataTypes={false}
            />
        </div>
    );
};

class JobRunner extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.disablePhenotypeModal = this.disablePhenotypeModal.bind(this);
        this.getNLPQLSample = this.getNLPQLSample.bind(this);
        this.updateNLPQL = this.updateNLPQL.bind(this);
        this.overwriteNLPQL = this.overwriteNLPQL.bind(this);
        this.handleButtonAction = this.handleButtonAction.bind(this);
        this.clear = this.clear.bind(this);

        this.state = {
            dropdownOpen: false,
            nlpql: "",
            response_view: <div />,
            togglePhenotype: true
        };
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    disablePhenotypeModal() {
        this.setState({
            togglePhenotype: false
        });
    }

    clear() {
        this.setState({
            nlpql: "",
            response_view: <div />,
            togglePhenotype: true
        });
    }

    getNLPQLSample(nlpql_filename) {
        let url = base_url + "nlpql_text/" + nlpql_filename;
        axios.get(url).then(response => {
            this.setState(prevState => ({
                nlpql: prevState.nlpql + "\n" + response.data
            }));
        });
    }

    updateNLPQL(query) {
        this.setState({
            nlpql: this.state.nlpql + query
        });
    }

    overwriteNLPQL(query) {
        this.setState({
            nlpql: query
        });
    }

    handleButtonAction(action) {
        let url = base_url + action;

        axios({
            method: "post",
            url: url,
            data: this.state.nlpql,
            headers: { "Content-Type": "text/plain" }
        }).then(response => {
            if (action === "nlpql_expander") {
                this.setState({
                    nlpql: response.data
                });
            } else if (action === "nlpql_tester") {
                this.setState({
                    response_view: <ResponseView data={response.data} />
                });
            } else {
                this.setState({
                    response_view: <ResponseView data={response.data} />
                });
            }
        });
    }

    render() {
        const { response_view, nlpql } = this.state;

        return (
            <div className="JobRunner container">
                <PhenotypeForm
                    updateNLPQL={this.updateNLPQL}
                    toggle={this.disablePhenotypeModal}
                    modal={this.state.togglePhenotype}
                />
                <div className="NLPQLAreaHeader columns">
                    <div className="column is-half">
                        <div className="columns level">
                            <div className="column is-one-third">
                                <button
                                    className="button is-large"
                                    onClick={() =>
                                        this.handleButtonAction(
                                            "nlpql_expander"
                                        )
                                    }
                                >
                                    Expand
                                </button>
                            </div>
                            <div className="column is-one-third level-right">
                                <button
                                    className="button is-large"
                                    onClick={() =>
                                        this.handleButtonAction("nlpql_tester")
                                    }
                                >
                                    Test
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="column is-half level">
                        <div className="columns level-right">
                            <div className="column is-half">
                                <LimitForm
                                    updateNLPQL={this.updateNLPQL}
                                    handleSubmit={() =>
                                        this.handleButtonAction("nlpql")
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <QueryBuilder
                    query={nlpql}
                    updateNLPQL={this.updateNLPQL}
                    overwriteNLPQL={this.overwriteNLPQL}
                    response_view={response_view}
                    clear={this.clear}
                />
            </div>
        );
    }
}

export default JobRunner;
