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
                    <div class="card">
                        <header class="card-header">
                            <p className="card-header-title">Your Query:</p>
                        </header>
                        <div class="card-content">
                            <div class="content">
                                <div className="response-json">
                                    <ReactJson
                                        src={data}
                                        displayObjectSize={false}
                                        displayDataTypes={false}
                                    />
                                </div>
                            </div>
                        </div>
                        <footer class="card-footer">
                            <a class="card-footer-item" onClick={toggle}>
                                Close
                            </a>
                            <a
                                class="card-footer-item"
                                onClick={this.toggleLimitModal}
                            >
                                Run Query
                            </a>
                        </footer>
                    </div>
                </div>
                <button
                    class="modal-close is-large"
                    aria-label="close"
                    onClick={toggle}
                />
            </div>
        );
    }
}
