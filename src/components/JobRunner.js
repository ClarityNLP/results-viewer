import React, { Component } from "react";
import axios from "axios";
import _ from "lodash";
import ReactJson from "react-json-view";
import QueryBuilder from "./QueryBuilder";
import { Button, Row, Col, Container } from "reactstrap";

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
    this.getNLPQLSample = this.getNLPQLSample.bind(this);
    this.updateNLPQL = this.updateNLPQL.bind(this);
    this.overwriteNLPQL = this.overwriteNLPQL.bind(this);
    this.handleButtonAction = this.handleButtonAction.bind(this);
    this.clear = this.clear.bind(this);
    this.startOver = this.startOver.bind(this);

    this.state = {
      dropdownOpen: false,
      nlpql: "",
      response_view: <div />
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  clear() {
    this.setState({
      nlpql: "",
      response_view: <div />
    });
  }

  startOver() {
    this.clear();
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
        <Row className="NLPQLAreaHeader justify-content-end mt-4">
          {/* <Col md="3">
            <h4>NLPQL Runner</h4>
            <Row>
              <Col md="6">
                <Button
                  color="link"
                  href="https://github.com/ClarityNLP/ClarityNLP/tree/master/nlpql"
                  target="_blank"
                  className="d-block"
                >
                  View Samples
                </Button>
              </Col>
              <Col md="6">
                <Button
                  color="link"
                  onClick={() => this.handleButtonAction("nlpql_expander")}
                >
                  Expand Terms
                </Button>
              </Col>
            </Row>
          </Col> */}
          <Col md="6">
            <Row>
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
              <Col md="6">
                <Button
                  block
                  outline
                  color="primary"
                  size="lg"
                  onClick={() => this.handleButtonAction("nlpql")}
                >
                  Run
                </Button>
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
