import React, { Component } from "react";
import { Button } from "reactstrap";
import axios from "axios";
import _ from "lodash";
import ReactJson from "react-json-view";
import QueryBuilder from "./QueryBuilder";

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
      test_response: {},
      run_response: {}
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  updateNLPQL(evt) {
    this.setState({
      nlpql: evt.target.value
    });
  }

  clear() {
    this.setState({
      nlpql: ""
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

  componentDidMount() {}

  handleButtonAction(action) {
    let input = window.ace.edit("editor").getValue();

    let url = this.base_url + action;
    axios({
      method: "post",
      url: url,
      data: input,
      headers: { "Content-Type": "text/plain" }
    }).then(response => {
      console.log(response);
      if (action === "nlpql_expander") {
        this.setState(
          prevState => ({
            nlpql: response.data
          }),
          () => {
            window.ace.edit("editor").setValue(response.data);
          }
        );
      } else if (action === "nlpql_tester") {
        console.log(response.data);
        this.setState({
          test_response: response.data,
          run_response: {}
        });
      } else {
        console.log(response.data);
        this.setState({
          test_response: {},
          run_response: response.data
        });
      }
    });
  }

  render() {
    let response_view = <div />;
    if (!_.isEmpty(this.state.test_response)) {
      response_view = <TestResponse data={this.state.test_response} />;
    } else if (!_.isEmpty(this.state.run_response)) {
      response_view = <RunResponse data={this.state.run_response} />;
    }
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
            <QueryBuilder />
            <div>
              <Button
                color="info"
                onClick={() => this.handleButtonAction("nlpql_expander")}
              >
                Expand Terms
              </Button>{" "}
              <Button
                color="warning"
                onClick={() => this.handleButtonAction("nlpql_tester")}
              >
                Test NLPQL
              </Button>{" "}
              <span className="float-lg-right">
                <Button
                  color="success"
                  onClick={() => this.handleButtonAction("nlpql")}
                >
                  Run NLPQL
                </Button>
              </span>
            </div>
          </div>
          <div className="col-12">
            <h5 className="SubHeader">Response</h5>
            <div>{response_view}</div>
          </div>
        </div>
        <div className="row">&nbsp;</div>
      </div>
    );
  }
}

export default JobRunner;
