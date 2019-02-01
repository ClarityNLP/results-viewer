/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from "react";
import {
  Modal,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  ModalBody
} from "reactstrap";

import SubmitButton from "../../UIkit/SubmitButton";

const initialState = { limit: "", modal: false };

class LimitForm extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.noLimit = this.noLimit.bind(this);

    this.state = initialState;
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal
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

    let { limit } = this.state;
    let text = "limit " + limit + ";\n\n";

    this.props.updateNLPQL(text);
    this.toggle();
    this.setState(initialState);
    this.props.handleSubmit();
  }

  noLimit() {
    this.toggle();
    this.props.handleSubmit();
  }

  render() {
    const { modal, limit } = this.state;

    return (
      <div>
        <Button block outline color="primary" size="lg" onClick={this.toggle}>
          Run
        </Button>
        <Modal isOpen={modal} data-parent="#formAccordion">
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="limit">Limit Results</Label>
                <Input
                  type="number"
                  id="limit"
                  name="limit"
                  value={limit}
                  onChange={this.handleInputChange}
                />
              </FormGroup>

              <SubmitButton handleSubmit={this.handleSubmit} label="Run Query">
                <Button outline color="link" onClick={this.noLimit}>
                  No, thanks
                </Button>
              </SubmitButton>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default LimitForm;
