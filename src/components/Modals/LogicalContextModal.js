/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from "react";
import { Button, Collapse, Form, FormGroup, Label, Input } from "reactstrap";

class LogicalContextModal extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      collapse: false,
      logicalContext: "Patient"
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

    const { logicalContext } = this.state;

    let text = "context " + logicalContext + ";\n\n";

    this.props.updateNLPQL(text);
    this.toggle();
  }

  render() {
    const { collapse, logicalContext } = this.state;

    return (
      <div>
        <Button color="primary" onClick={this.toggle}>
          Set Logical Context
        </Button>
        <Collapse isOpen={collapse}>
          <Form>
            <FormGroup>
              <Label for="logicalContext">Name</Label>
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

export default LogicalContextModal;
