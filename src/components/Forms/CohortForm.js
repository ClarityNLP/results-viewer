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
  CardBody,
  Badge
} from "reactstrap";

import SubmitButton from "../../UIkit/SubmitButton";

import plus from "../../assets/icons/svg/plus.svg";
import minus from "../../assets/icons/svg/minus.svg";

const initialState = {
  icon: plus,
  collapse: false,
  name: "",
  id: ""
};

class CohortForm extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderCohortCount = this.renderCohortCount.bind(this);

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

    const { name, id } = this.state;

    let text = "cohort " + name + ": OHDSI.getCohort(" + id + ");\n\n";

    this.props.appendCohort(name);
    this.props.updateNLPQL(text);
    this.toggle();
    this.setState(initialState);
  }

  renderCohortCount() {
    let count = this.props.cohorts.length;

    if (count === 0) {
      return <span className="text-muted font-italic"> - Optional</span>;
    }

    return <Badge color="dark">{count}</Badge>;
  }

  render() {
    const { icon, collapse, name, id } = this.state;

    return (
      <div>
        <CardHeader onClick={this.toggle}>
          <Row className="justify-content-between">
            <Col>OHDSI Cohort {this.renderCohortCount()}</Col>
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
                <Label for="id">ID</Label>
                <Input
                  type="number"
                  id="id"
                  name="id"
                  value={id}
                  onChange={this.handleInputChange}
                />
              </FormGroup>

              <SubmitButton
                handleSubmit={this.handleSubmit}
                label="Add Cohort"
              />
            </Form>
          </CardBody>
        </Collapse>
      </div>
    );
  }
}

export default CohortForm;
