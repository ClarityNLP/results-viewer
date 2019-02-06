import React, { Component } from "react";
import ReactJson from "react-json-view";

export default class TestResponse extends Component {
    toggleLimitModal = () => {
        this.props.toggle();
        this.props.toggleLimitModal();
    };

    render() {
        const { data, toggle } = this.props;

        return (
            <div className={"modal is-active"}>
                <div className="modal-background" />
                <div className="modal-content">
                    <div className="card">
                        <header className="card-header">
                            <p className="card-header-title">Your Query:</p>
                        </header>
                        <div className="card-content">
                            <div className="content">
                                <div className="response-json">
                                    <ReactJson
                                        src={data}
                                        displayObjectSize={false}
                                        displayDataTypes={false}
                                    />
                                </div>
                            </div>
                        </div>
                        <footer className="card-footer">
                            <a className="card-footer-item" onClick={toggle}>
                                Close
                            </a>
                            <a
                                className="card-footer-item"
                                onClick={this.toggleLimitModal}
                            >
                                Run Query
                            </a>
                        </footer>
                    </div>
                </div>
                <button
                    className="modal-close is-large"
                    aria-label="close"
                    onClick={toggle}
                />
            </div>
        );
    }
}
