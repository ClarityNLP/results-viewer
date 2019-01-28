/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from "react";
import { Button, Collapse, Form, FormGroup, Label, Input } from "reactstrap";

class CohortModal extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      collapse: false,
      name: "",
      id: ""
    };
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

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
  }

  render() {
    const { collapse, name, id } = this.state;

    return (
      <div>
        <Button color="primary" onClick={this.toggle}>
          Add OHDSI Cohort
        </Button>
        <Collapse isOpen={collapse}>
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

            <Button
              color="success"
              type="submit"
              id="submit"
              onClick={this.handleSubmit}
            >
              Save changes
            </Button>
          </Form>
        </Collapse>
      </div>
    );
  }
}

export default CohortModal;
