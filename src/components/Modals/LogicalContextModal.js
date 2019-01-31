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

const initialState = {
  icon: plus,
  collapse: false,
  logicalContext: "Patient"
};

class LogicalContextModal extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
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

  handleInputChange(event) {
    const target = event.target;
    let value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    const { logicalContext } = this.state;

    let text = "context " + logicalContext + ";\n\n";

    this.props.updateNLPQL(text);
    this.toggle();
    this.setState(initialState);
  }

  render() {
    const { icon, collapse, logicalContext } = this.state;

    return (
      <div>
        <CardHeader onClick={this.toggle}>
          <Row className="justify-content-between">
            <Col>Logical Context</Col>
            <Col className="text-right">
              <img height="16px" src={icon} alt />
            </Col>
          </Row>
        </CardHeader>
        <Collapse isOpen={collapse}>
          <CardBody>
            <Form>
              <FormGroup>
                <Label for="logicalContext">Logical Context</Label>
                <Input
                  type="select"
                  id="logicalContext"
                  name="logicalContext"
                  value={logicalContext}
                  onChange={this.handleInputChange}
                >
                  <option value="Patient">Patient</option>
                  <option value="Document">Document</option>
                </Input>
              </FormGroup>

              <SubmitButton
                handleSubmit={this.handleSubmit}
                label="Add Logical Context"
              />
            </Form>
          </CardBody>
        </Collapse>
      </div>
    );
  }
}

export default LogicalContextModal;
