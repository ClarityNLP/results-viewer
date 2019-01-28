/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from "react";
import {
  Button,
  Collapse,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  CardHeader,
  CardBody
} from "reactstrap";
import plus_icon from "../../assets/img/icon--plus.png";

class PhenotypeModal extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.allInputsAreValid = this.allInputsAreValid.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      collapse: false,
      name: "",
      version: "",
      validation: {
        name: "",
        version: ""
      }
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
    let isValid = value.trim() !== "" ? "is-valid" : "is-invalid";

    this.setState({
      [name]: value,
      validation: {
        ...this.state.validation,
        [name]: isValid
      }
    });
  }

  allInputsAreValid() {
    const { validation } = this.state;

    let allValidInputs = true;
    let validCheck = {
      name: "",
      version: ""
    };

    if (validation.name !== "is-valid") {
      validCheck.name = "is-invalid";
      allValidInputs = false;
    } else {
      validCheck.name = "is-valid";
    }

    if (validation.version !== "is-valid") {
      validCheck.version = "is-invalid";
      allValidInputs = false;
    } else {
      validCheck.version = "is-valid";
    }

    this.setState({
      validation: validCheck
    });

    return allValidInputs;
  }

  handleSubmit = event => {
    event.preventDefault();

    const { name, version } = this.state;
    let valid = this.allInputsAreValid();

    if (!valid) {
      return;
    }

    let text =
      'phenotype "' +
      name +
      '" version "' +
      version +
      '";\n\n' +
      'include ClarityCore version "1.0" called Clarity;\n\n';

    this.props.updateNLPQL(text);
    this.toggle();
  };

  render() {
    const { name, version, collapse, validation } = this.state;

    return (
      <div>
        <CardHeader onClick={this.toggle}>
          <img src={plus_icon} className="mr-2" /> Phenotype
        </CardHeader>
        <Collapse isOpen={collapse} data-parent="#formAccordion">
          <CardBody>
            <Form>
              <FormGroup>
                <Label for="name">Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  className={validation.name}
                  onChange={this.handleInputChange}
                />
                <FormFeedback>Please enter a name.</FormFeedback>
              </FormGroup>

              <FormGroup>
                <Label for="version">Version</Label>
                <Input
                  type="text"
                  id="version"
                  name="version"
                  value={version}
                  className={validation.version}
                  onChange={this.handleInputChange}
                />
                <FormFeedback>Please enter a version.</FormFeedback>
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

export default PhenotypeModal;
