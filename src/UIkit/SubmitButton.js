import React from "react";
import { Row, Col, Button } from "reactstrap";

class SubmitButton extends React.Component {
  render() {
    return (
      <Row className="justify-content-end">
        {this.props.children}
        <Col md="5">
          <Button
            outline
            block
            color="dark"
            type="submit"
            id="submit"
            onClick={this.props.handleSubmit}
          >
            {this.props.label}
          </Button>
        </Col>
      </Row>
    );
  }
}

export default SubmitButton;
