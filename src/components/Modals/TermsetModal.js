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

class TermsetModal extends React.Component {
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
          <ModalHeader toggle={this.toggle}>Term Set</ModalHeader>
          <Form>
            <ModalBody>
              <FormGroup>
                <Label for="termsetName">Name</Label>
                <Input
                  type="text"
                  id="termsetName"
                  name="termsetName"
                  value={this.props.termsetName}
                  onChange={this.props.handleInputChange}
                />
              </FormGroup>

              <FormGroup>
                <Label for="termsetTerms">Terms</Label>
                <Input
                  type="text"
                  id="termsetTerms"
                  name="termsetTerms"
                  value={this.props.termsetTerms}
                  onChange={this.props.handleInputChange}
                  placeholder="Enter comma separated terms."
                />
              </FormGroup>

              <FormGroup check>
                <Label check>
                  <Input
                    type="checkbox"
                    id="termsetSynonyms"
                    name="termsetSynonyms"
                    checked={this.props.termsetSynonyms}
                    onChange={this.props.handleInputChange}
                  />{" "}
                  Synonyms
                </Label>
              </FormGroup>

              <FormGroup check>
                <Label check>
                  <Input
                    type="checkbox"
                    id="termsetPlurals"
                    name="termsetPlurals"
                    checked={this.props.termsetPlurals}
                    onChange={this.props.handleInputChange}
                  />{" "}
                  Plurals
                </Label>
              </FormGroup>

              <FormGroup check>
                <Label check>
                  <Input
                    type="checkbox"
                    id="termsetVerbInflections"
                    name="termsetVerbInflections"
                    checked={this.props.termsetVerbInflections}
                    onChange={this.props.handleInputChange}
                  />{" "}
                  Verb Inflections
                </Label>
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

export default TermsetModal;
