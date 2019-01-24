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

class DocumentSetModal extends React.Component {
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
          <ModalHeader toggle={this.toggle}>Document Set</ModalHeader>
          <Form>
            <ModalBody>
              <FormGroup>
                <Label for="documentsetName">Name</Label>
                <Input
                  type="text"
                  id="documentsetName"
                  name="documentsetName"
                  value={this.props.documentsetName}
                  onChange={this.props.handleInputChange}
                />
              </FormGroup>

              <FormGroup>
                <Label for="documentsetSource">Data Source</Label>
                <Input
                  type="text"
                  id="documentsetSource"
                  name="documentsetSource"
                  value={this.props.documentsetSource}
                  onChange={this.props.handleInputChange}
                  placeholder="Enter comma separated terms."
                />
              </FormGroup>

              <div id="documentsetList">
                <FormGroup>
                  <Label for="documentsetReportTypes">Report Types</Label>
                  <Input
                    type="text"
                    id="documentsetReportTypes"
                    name="documentsetReportTypes"
                    value={this.props.documentsetReportTypes}
                    onChange={this.props.handleInputChange}
                    placeholder="Enter comma separated terms."
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="documentsetReportTags">Report Tags</Label>
                  <Input
                    type="text"
                    id="documentsetReportTags"
                    name="documentsetReportTags"
                    value={this.props.documentsetReportTags}
                    onChange={this.props.handleInputChange}
                    placeholder="Enter comma separated terms."
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="documentsetFilterQuery">Filter Query</Label>
                  <Input
                    type="text"
                    id="documentsetFilterQuery"
                    name="documentsetFilterQuery"
                    value={this.props.documentsetFilterQuery}
                    onChange={this.props.handleInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="documentsetQuery">Query</Label>
                  <Input
                    type="text"
                    id="documentsetQuery"
                    name="documentsetQuery"
                    value={this.props.documentsetQuery}
                    onChange={this.props.handleInputChange}
                  />
                </FormGroup>
              </div>
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

export default DocumentSetModal;
