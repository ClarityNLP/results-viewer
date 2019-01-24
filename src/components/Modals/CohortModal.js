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

class CohortModal extends React.Component {
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
          <ModalHeader toggle={this.toggle}>OHDSI Cohort</ModalHeader>
          <Form>
            <ModalBody>
              <FormGroup>
                <Label for="cohortName">Name</Label>
                <Input
                  type="text"
                  id="cohortName"
                  name="cohortName"
                  value={this.props.cohortName}
                  onChange={this.props.handleInputChange}
                />
              </FormGroup>

              <FormGroup>
                <Label for="cohortID">ID</Label>
                <Input
                  type="number"
                  id="cohortID"
                  name="cohortID"
                  value={this.props.cohortID}
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

export default CohortModal;
