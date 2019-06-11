import React, { Component } from "react";

export default class ResponseModal extends Component {
    render() {
        const { content } = this.props;

        return (
            <div className="modal is-active">
                <div className="modal-background" />
                <div className="modal-content">
                    <div className="box has-text-centered">{content}</div>
                </div>
                <button
                    className="modal-close is-large"
                    aria-label="close"
                    onClick={this.props.toggle}
                />
            </div>
        );
    }
}
