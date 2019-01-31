/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from "react";
import {
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

import SubmitButton from "../../UIkit/SubmitButton";

import algorithmParameters from "./algorithms";
import plus from "../../assets/icons/svg/plus.svg";
import minus from "../../assets/icons/svg/minus.svg";

class DefineResultModal extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFeatureInputChange = this.handleFeatureInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      icon: plus,
      collapse: false,
      algorithm: "",
      name: "",
      feature: "",
      subField: "",
      booleanOperator: "",
      valueToCompare: ""
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

  renderSubFieldSelect() {
    const { algorithm, subField } = this.state;

    if (algorithm !== "") {
      return (
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
      );
    }

    return null;
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
      icon,
      collapse,
      name,
      feature,
      booleanOperator,
      valueToCompare
    } = this.state;

    return (
      <div>
        <CardHeader onClick={this.toggle}>
          <Row className="justify-content-between">
            <Col>Result</Col>
            <Col className="text-right">
              <img height="16px" src={icon} alt />
            </Col>
          </Row>
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
                  <Col>{this.renderSubFieldSelect()}</Col>
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

              <SubmitButton handleSubmit={this.handleSubmit} />
            </Form>
          </CardBody>
        </Collapse>
      </div>
    );
  }
}

export default DefineResultModal;
