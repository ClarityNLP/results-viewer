/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from "react";
import { Button, Collapse, Form, FormGroup, Label, Input } from "reactstrap";

class PhenotypeModal extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      collapse: false,
      phenotypeName: "",
      phenotypeVersion: ""
    };
  }

  toggle = () => {
    this.setState({
      collapse: !this.state.collapse
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

  handleSubmit = event => {
    event.preventDefault();

    const { phenotypeName, phenotypeVersion } = this.state;
    let text =
      'phenotype "' +
      phenotypeName +
      '" version "' +
      phenotypeVersion +
      '";\n\n' +
      'include ClarityCore version "1.0" called Clarity;\n\n';

    this.props.updateNLPQL(text);
    this.toggle();
  };

  render() {
    const { phenotypeName, phenotypeVersion, collapse } = this.state;

    return (
      <div>
        <Button color="primary" onClick={this.toggle}>
          Add Phenotype
        </Button>
        <Collapse isOpen={collapse}>
          <Form>
            <FormGroup>
              <Label for="phenotypeName">Phenotype Name</Label>
              <Input
                type="text"
                id="phenotypeName"
                name="phenotypeName"
                value={phenotypeName}
                onChange={this.handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="phenotypeVersion">Phenotype Version</Label>
              <Input
                type="text"
                id="phenotypeVersion"
                name="phenotypeVersion"
                value={phenotypeVersion}
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

export default PhenotypeModal;
