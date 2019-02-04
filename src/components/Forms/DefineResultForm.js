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
  CardBody,
  Button
} from "reactstrap";

import SubmitButton from "../../UIkit/SubmitButton";

import algorithmParameters from "./algorithms";
import plus from "../../assets/icons/svg/plus.svg";
import minus from "../../assets/icons/svg/minus.svg";

const initialState = {
  icon: plus,
  collapse: false,
  algorithm: "",
  name: "",
  feature: "",
  subField: "",
  isFinal: false,
  logic: ""
};
class DefineResultForm extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFeatureInputChange = this.handleFeatureInputChange.bind(this);
    this.addFeatureToLogic = this.addFeatureToLogic.bind(this);
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

  addFeatureToLogic() {
    const { feature, subField } = this.state;
    let text = feature;

    if (subField.trim() !== "") {
      text += "." + subField;
    }

    this.setState({
      logic: this.state.logic + text
    });
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

  renderSubFieldSelect() {
    const { algorithm, subField } = this.state;

    console.log(algorithm);

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

    const { name, logic, isFinal } = this.state;

    const { logicalContext } = this.state;

    let text = "context " + logicalContext + ";\n\n define ";

    if (isFinal) {
      text += "final ";
    }

    text += name + ":\n\twhere " + logic;

    text += ";\n\n";

    this.props.updateNLPQL(text);
    this.toggle();
    this.setState(initialState);
  }

  render() {
    const { icon, collapse, name, feature, logic, isFinal } = this.state;

    return (
      <div>
        <CardHeader onClick={this.toggle}>
          <Row className="justify-content-between">
            <Col>Result</Col>
            <Col className="text-right">
              <img height="16px" src={icon} alt="" />
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
                <Label>Feature</Label>
                <Row>
                  <Col sm="5">
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
                  <Col sm="5">{this.renderSubFieldSelect()}</Col>
                  <Col sm="2">
                    <Button
                      outline
                      color="primary"
                      onClick={this.addFeatureToLogic}
                    >
                      +
                    </Button>
                  </Col>
                  <Col xs="12" className="mt-3">
                    <Label>Logic</Label>
                    <Input
                      type="text"
                      id="logic"
                      name="logic"
                      value={logic}
                      onChange={this.handleInputChange}
                    />
                  </Col>
                </Row>
              </FormGroup>

              <FormGroup check className="mt-3 mb-3">
                <Label check size="lg">
                  <Input
                    type="checkbox"
                    id="isFinal"
                    name="isFinal"
                    checked={isFinal}
                    onChange={this.handleInputChange}
                  />
                  Include in final results
                </Label>
              </FormGroup>

              <SubmitButton
                handleSubmit={this.handleSubmit}
                label="Add Result"
              />
            </Form>
          </CardBody>
        </Collapse>
      </div>
    );
  }
}

export default DefineResultForm;
