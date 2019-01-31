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

import SubmitButton from "../../UIkit/SubmitButton";

import plus from "../../assets/icons/svg/plus.svg";
import minus from "../../assets/icons/svg/minus.svg";

class TermsetModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      icon: plus,
      termExpanderUrl: "http://18.220.133.76:5000/nlpql_expander",
      collapse: false,
      termsetName: "",
      termsetTerms: "",
      termsetSynonyms: false,
      termsetPlurals: false,
      termsetVerbInflections: false
    };
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

  handleSubmit = event => {
    event.preventDefault();

    const {
      termExpanderUrl,
      termsetName,
      termsetTerms,
      termsetSynonyms,
      termsetPlurals,
      termsetVerbInflections
    } = this.state;

    if (termsetSynonyms || termsetPlurals || termsetVerbInflections) {
      let payload = "termset " + termsetName + ": [";

      if (termsetSynonyms) {
        payload += 'Clarity.Synonyms("' + termsetTerms + '"),';
      }
      if (termsetPlurals) {
        payload += 'Clarity.Plurals("' + termsetTerms + '"),';
      }
      if (termsetVerbInflections) {
        payload += 'Clarity.VerbInflections("' + termsetTerms + '"),';
      }

      payload = payload.slice(0, payload.length - 1); //removing the last extra ',' character
      payload += "];";

      fetch(termExpanderUrl, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain"
        },
        body: payload
      })
        .then(response => {
          return response.text().then(data => {
            data = data.replace(":", ":\n\t");
            let text = data + "\n\n";

            this.props.updateNLPQL(text);
          });
        })
        .catch(err => {
          alert("Term Expander Unavailable. Reason: " + err.message);
        });
    } else {
      let text = "termset " + termsetName + ":\n";
      text =
        text + "\t" + this.buildArrayStringWithQuotes(termsetTerms) + "\n\n";

      this.props.updateNLPQL(text);
    }

    this.props.appendTermSet(termsetName);
    this.toggle();
  };

  render() {
    const {
      icon,
      collapse,
      termsetName,
      termsetTerms,
      termsetSynonyms,
      termsetPlurals,
      termsetVerbInflections
    } = this.state;

    return (
      <div>
        <CardHeader onClick={this.toggle}>
          <Row className="justify-content-between">
            <Col>Term Set</Col>
            <Col className="text-right">
              <img height="16px" src={icon} alt />
            </Col>
          </Row>
        </CardHeader>
        <Collapse isOpen={collapse}>
          <CardBody>
            <Form>
              <FormGroup>
                <Label for="termsetName">Name</Label>
                <Input
                  type="text"
                  id="termsetName"
                  name="termsetName"
                  value={termsetName}
                  onChange={this.handleInputChange}
                />
              </FormGroup>

              <FormGroup>
                <Label for="termsetTerms">Terms</Label>
                <Input
                  type="text"
                  id="termsetTerms"
                  name="termsetTerms"
                  value={termsetTerms}
                  onChange={this.handleInputChange}
                  placeholder="Enter comma separated terms."
                />
              </FormGroup>

              <FormGroup check>
                <Label check>
                  <Input
                    type="checkbox"
                    id="termsetSynonyms"
                    name="termsetSynonyms"
                    checked={termsetSynonyms}
                    onChange={this.handleInputChange}
                  />{" "}
                  Synonyms
                </Label>
              </FormGroup>

              <FormGroup check>
                <Label check>
                  <Input
                    type="checkbox"
                    id="termsetPlurals"
                    name="termsetPlurals"
                    checked={termsetPlurals}
                    onChange={this.handleInputChange}
                  />{" "}
                  Plurals
                </Label>
              </FormGroup>

              <FormGroup check>
                <Label check>
                  <Input
                    type="checkbox"
                    id="termsetVerbInflections"
                    name="termsetVerbInflections"
                    checked={termsetVerbInflections}
                    onChange={this.handleInputChange}
                  />{" "}
                  Verb Inflections
                </Label>
              </FormGroup>

              <SubmitButton handleSubmit={this.handleSubmit} />
            </Form>
          </CardBody>
        </Collapse>
      </div>
    );
  }
}

export default TermsetModal;
