import React from "react";
import { Row, Col, Button } from "reactstrap";

class SubmitButton extends React.Component {
  render() {
    return (
      <Row className="justify-content-end">
        <Col md="4">
          <Button
            outline
            block
            color="dark"
            type="submit"
            id="submit"
            onClick={this.props.handleSubmit}
          >
            Save Changes
          </Button>
        </Col>
      </Row>
    );
  }
}

export default SubmitButton;
