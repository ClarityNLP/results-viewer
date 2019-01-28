/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from "react";
import {
  Button,
  Collapse,
  Form,
  FormGroup,
  Label,
  Input,
  CardHeader,
  CardBody,
  Row,
  Col
} from "reactstrap";
import plus_icon from "../../assets/img/icon--plus.png";

class LimitModal extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = { limit: "", collapse: false };
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

    let { limit } = this.state;
    let text = "limit " + limit + ";\n\n";

    this.props.updateNLPQL(text);
    this.toggle();
  }

  render() {
    const { collapse, limit } = this.state;

    return (
      <div>
        <CardHeader onClick={this.toggle}>
          <img src={plus_icon} className="mr-2" /> Query Limit
        </CardHeader>
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

              <Row className="justify-content-end">
                <Col md="4">
                  <Button
                    color="success"
                    type="submit"
                    id="submit"
                    size="lg"
                    onClick={this.handleSubmit}
                  >
                    Save changes
                  </Button>
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Collapse>
      </div>
    );
  }
}

export default LimitModal;
