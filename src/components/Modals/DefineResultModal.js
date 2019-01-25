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
  Input,
  Row,
  Col
} from "reactstrap";
import algorithmParameters from "./algorithms";

class DefineResultModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      algorithm: ""
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

  handleInputChange = e => {
    const { features } = this.props;
    let target = e.target;
    let value = target.value;

    let algorithm = "";

    for (let i = 0; i < features.length; i++) {
      if (features[i].name === value) {
        algorithm = features[i].algorithm;
      }
    }

    this.setState({
      algorithm: algorithm
    });
    this.props.handleInputChange(e);
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
          <ModalHeader toggle={this.toggle}>Define Result</ModalHeader>
          <Form>
            <ModalBody>
              <FormGroup>
                <Label for="resultsName">Name</Label>
                <Input
                  type="text"
                  id="resultsName"
                  name="resultsName"
                  value={this.props.resultsName}
                  onChange={this.props.handleInputChange}
                />
              </FormGroup>

              <FormGroup>
                <Label>Logic</Label>
                <Row>
                  <Col>
                    <Input
                      type="select"
                      id="resultsFeature"
                      name="resultsFeature"
                      value={this.props.resultsFeature}
                      onChange={this.handleInputChange}
                    >
                      <option value="" />
                      {this.props.features.map((value, index) => {
                        return (
                          <option key={index} value={value.name}>
                            {value.name}
                          </option>
                        );
                      })}
                    </Input>
                  </Col>
                  <Col>
                    {this.state.algorithm !== "" ? (
                      <Input
                        type="select"
                        id="resultsSubField"
                        name="resultsSubField"
                        value={this.props.resultsSubField}
                        onChange={this.props.handleInputChange}
                      >
                        <option />
                        {algorithmParameters[this.state.algorithm].map(
                          (value, index) => {
                            return (
                              <option key={index} value={value}>
                                {value}
                              </option>
                            );
                          }
                        )}
                      </Input>
                    ) : null}
                  </Col>
                  <Col>
                    <Input
                      type="select"
                      id="resultsBooleanOperator"
                      name="resultsBooleanOperator"
                      onChange={this.props.handleInputChange}
                    >
                      <option />
                      <option value="or">OR</option>
                      <option value="and">AND</option>
                      <option value="xor">XOR</option>
                      <option value=">">&gt;</option>
                      <option value="<">&lt;</option>
                      <option value="=">=</option>
                      <option value=">=">&ge;</option>
                      <option value="<=">&le;</option>
                    </Input>
                  </Col>
                  <Col>
                    <Input
                      type="text"
                      id="resultsLogic"
                      name="resultsLogic"
                      onChange={this.props.handleInputChange}
                    />
                  </Col>
                </Row>
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

export default DefineResultModal;
