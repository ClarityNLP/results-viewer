import React, { Component } from "react";
import axios from "axios";
import _ from "lodash";
import ReactJson from "react-json-view";
import QueryBuilder from "./QueryBuilder";
import { Button, Row, Col, Container } from "reactstrap";
import LimitModal from "./Modals/LimitModal";
import PhenotypeModal from "./Modals/PhenotypeModal";

const RunResponse = ({ data, ...props }) => {
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

const TestResponse = ({ data, ...props }) => {
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
    this.base_url = props.url;

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
    let url = this.base_url + "nlpql_text/" + nlpql_filename;
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
    let url = this.base_url + action;

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
          response_view: <RunResponse data={response.data} />
        });
      } else {
        this.setState({
          response_view: <TestResponse data={response.data} />
        });
      }
    });
  }

  render() {
    const { response_view, nlpql } = this.state;

    return (
      <Container className="JobRunner">
        <PhenotypeModal
          updateNLPQL={this.updateNLPQL}
          toggle={this.disablePhenotypeModal}
          modal={this.state.togglePhenotype}
        />
        <Row className="NLPQLAreaHeader justify-content-between mt-4">
          <Col md="6">
            <Row>
              <Col md="6">
                <Button
                  block
                  outline
                  color="secondary"
                  size="lg"
                  onClick={() => this.handleButtonAction("nlpql_expander")}
                >
                  Expand
                </Button>
              </Col>
              <Col md="6">
                <Button
                  block
                  outline
                  color="secondary"
                  size="lg"
                  onClick={() => this.handleButtonAction("nlpql_tester")}
                >
                  Test
                </Button>
              </Col>
            </Row>
          </Col>
          <Col md="6">
            <Row className="justify-content-end">
              <Col md="6">
                <LimitModal
                  updateNLPQL={this.updateNLPQL}
                  handleSubmit={() => this.handleButtonAction("nlpql")}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <QueryBuilder
          query={nlpql}
          updateNLPQL={this.updateNLPQL}
          overwriteNLPQL={this.overwriteNLPQL}
          response_view={response_view}
          clear={this.clear}
        />
      </Container>
    );
  }
}

export default JobRunner;
