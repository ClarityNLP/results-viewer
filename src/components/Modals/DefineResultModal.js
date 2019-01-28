/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from "react";
import {
  Button,
  Collapse,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  CardHeader,
  CardBody
} from "reactstrap";
import algorithmParameters from "./algorithms";
import plus_icon from "../../assets/img/icon--plus.png";

class DefineResultModal extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFeatureInputChange = this.handleFeatureInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      collapse: false,
      algorithm: "",
      name: "",
      feature: "",
      subField: "",
      booleanOperator: "",
      valueToCompare: ""
    };
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

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

  handleFeatureInputChange(event) {
    const { features } = this.props;

    let target = event.target;
    let value = target.value;

    let algorithm = "";
    let feature = "";

    for (let i = 0; i < features.length; i++) {
      if (features[i].name === value) {
        algorithm = features[i].algorithm;
        feature = features[i].name;
      }
    }

    this.setState({
      algorithm: algorithm,
      feature: feature
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    const {
      name,
      valueToCompare,
      feature,
      booleanOperator,
      subField
    } = this.state;

    let text = "define final " + name + ":\n\twhere " + feature;

    if (subField.trim() !== "") {
      text += "." + subField;
    }

    text += " " + booleanOperator + " " + valueToCompare + ";\n\n";

    this.props.updateNLPQL(text);
    this.toggle();
  }

  render() {
    const {
      collapse,
      name,
      feature,
      subField,
      booleanOperator,
      valueToCompare,
      algorithm
    } = this.state;

    return (
      <div>
        <CardHeader onClick={this.toggle}>
          <img src={plus_icon} className="mr-2" /> Result
        </CardHeader>
        <Collapse isOpen={collapse}>
          <CardBody>
            <Form>
              <FormGroup>
                <Label for="name">Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={this.handleInputChange}
                />
              </FormGroup>

              <FormGroup>
                <Label>Logic</Label>
                <Row>
                  <Col>
                    <Input
                      type="select"
                      id="feature"
                      name="feature"
                      value={feature}
                      onChange={this.handleFeatureInputChange}
                    >
                      <option value="" />
                      {this.props.features.map((value, index) => {
                        return (
                          <option key={index} value={value.name}>
                            {value.name}
                          </option>
                        );
                      })}
                    </Input>
                  </Col>
                  <Col>
                    {algorithm !== "" ? (
                      <Input
                        type="select"
                        id="subField"
                        name="subField"
                        value={subField}
                        onChange={this.handleInputChange}
                      >
                        <option />
                        {algorithmParameters[algorithm].map((value, index) => {
                          return (
                            <option key={index} value={value}>
                              {value}
                            </option>
                          );
                        })}
                      </Input>
                    ) : null}
                  </Col>
                  <Col>
                    <Input
                      type="select"
                      id="booleanOperator"
                      name="booleanOperator"
                      value={booleanOperator}
                      onChange={this.handleInputChange}
                    >
                      <option />
                      <option value="or">OR</option>
                      <option value="and">AND</option>
                      <option value="xor">XOR</option>
                      <option value=">">&gt;</option>
                      <option value="<">&lt;</option>
                      <option value="=">=</option>
                      <option value=">=">&ge;</option>
                      <option value="<=">&le;</option>
                    </Input>
                  </Col>
                  <Col>
                    <Input
                      type="text"
                      id="valueToCompare"
                      name="valueToCompare"
                      value={valueToCompare}
                      onChange={this.handleInputChange}
                    />
                  </Col>
                </Row>
              </FormGroup>

              <Button
                color="success"
                type="submit"
                id="submit"
                onClick={this.handleSubmit}
              >
                Save changes
              </Button>
            </Form>
          </CardBody>
        </Collapse>
      </div>
    );
  }
}

export default DefineResultModal;
