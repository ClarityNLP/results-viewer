import React, { Component } from "react";
import axios from "axios";
import _ from "lodash";
import ReactJson from "react-json-view";
import QueryBuilder from "./QueryBuilder";
import { Button, Row, Col } from "reactstrap";

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
    this.handleButtonAction = this.handleButtonAction.bind(this);
    this.clear = this.clear.bind(this);

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

  componentDidMount() {}

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
      <div className="JobRunner container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="NLPQLAreaHeader">
              <span className="h4 SubHeader">NLPQL Runner</span>
              {"  "}
              <a
                href="https://github.com/ClarityNLP/ClarityNLP/tree/master/nlpql"
                target="_blank"
                className="SampleLink"
                rel="noopener noreferrer"
              >
                View Samples
              </a>
            </div>
            <QueryBuilder
              query={nlpql}
              updateNLPQL={this.updateNLPQL}
              response_view={response_view}
              clear={this.clear}
            />
            {/* <Button
                color="link"
                onClick={() => this.handleButtonAction("nlpql_expander")}
              >
                Expand Terms
              </Button>{" "} */}
            <Row className="justify-content-end mt-4">
              <Col md="2">
                <Button
                  color="warning"
                  onClick={() => this.handleButtonAction("nlpql_tester")}
                >
                  Test NLPQL
                </Button>
              </Col>
              <Col md="2">
                <Button
                  color="success"
                  onClick={() => this.handleButtonAction("nlpql")}
                >
                  Run NLPQL
                </Button>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

export default JobRunner;
