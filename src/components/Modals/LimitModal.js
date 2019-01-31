/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from "react";
import {
  Collapse,
  Form,
  FormGroup,
  Label,
  Input,
  CardHeader,
  CardBody
} from "reactstrap";

import SubmitButton from "../../UIkit/SubmitButton";

class LimitModal extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = { limit: "", collapse: false };
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

  handleSubmit(event) {
    event.preventDefault();

    let { limit } = this.state;
    let text = "limit " + limit + ";\n\n";

    this.props.updateNLPQL(text);
    this.toggle();
  }

  render() {
    const { collapse, limit } = this.state;

    return (
      <div>
        <CardHeader onClick={this.toggle}>Query Limit</CardHeader>
        <Collapse isOpen={collapse} data-parent="#formAccordion">
          <CardBody>
            <Form>
              <FormGroup>
                <Label for="limit">Limit</Label>
                <Input
                  type="number"
                  id="limit"
                  name="limit"
                  value={limit}
                  onChange={this.handleInputChange}
                />
              </FormGroup>

              <SubmitButton handleSubmit={this.handleSubmit} />
            </Form>
          </CardBody>
        </Collapse>
      </div>
    );
  }
}

export default LimitModal;
