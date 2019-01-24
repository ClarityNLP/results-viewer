/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input
} from "reactstrap";

class PhenotypeModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.props.handleSubmit();
    this.toggle();
  };

  render() {
    return (
      <div className="modal-container">
        <Button
          color="primary"
          onClick={this.toggle}
          disabled={this.props.isDisabled}
        >
          {this.props.buttonLabel}
        </Button>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={this.props.className}
          id={this.props.id}
        >
          <ModalHeader toggle={this.toggle}>Phenotype</ModalHeader>
          <Form>
            <ModalBody>
              <FormGroup>
                <Label for="phenotypeName">Phenotype Name</Label>
                <Input
                  type="text"
                  id="phenotypeName"
                  name="phenotypeName"
                  value={this.props.phenotypeName}
                  onChange={this.props.handleInputChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="phenotypeVersion">Phenotype Version</Label>
                <Input
                  type="text"
                  id="phenotypeVersion"
                  name="phenotypeVersion"
                  value={this.props.phenotypeVersion}
                  onChange={this.props.handleInputChange}
                />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                type="submit"
                id="submit"
                onClick={this.handleSubmit}
              >
                Save changes
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default PhenotypeModal;
