/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from "react";
import {
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Modal,
  ModalBody
} from "reactstrap";

import SubmitButton from "../../UIkit/SubmitButton";

class PhenotypeModal extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.allInputsAreValid = this.allInputsAreValid.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      modal: false,
      name: "",
      version: "",
      limit: "",
      validation: {
        name: "",
        version: "",
        limit: ""
      }
    };
  }

  componentDidMount() {
    this.toggle();
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

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

    const { name, version, limit } = this.state;
    let valid = this.allInputsAreValid();
    let text = "";

    if (!valid) {
      return;
    }

    if (limit) {
      text += "limit " + limit + ";\n\n";
    }

    text +=
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
    const { name, version, modal, validation, limit } = this.state;

    return (
      <div>
        <Modal isOpen={modal} toggle={this.toggle}>
          <ModalBody className="p-3">
            <Form>
              <FormGroup>
                <FormGroup>
                  <Label for="limit">
                    Query Limit{" "}
                    <span className="text-muted font-italic">- Optional</span>
                  </Label>
                  <Input
                    type="number"
                    id="limit"
                    name="limit"
                    value={limit}
                    onChange={this.handleInputChange}
                  />
                </FormGroup>

                <Label for="name">Phenotype Name</Label>
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
                <Label for="version">Phenotype Version</Label>
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

              <SubmitButton handleSubmit={this.handleSubmit} />
            </Form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default PhenotypeModal;
