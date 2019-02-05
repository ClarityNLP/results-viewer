import React, { Component } from "react";
import ReactJson from "react-json-view";
import { Link } from "react-router-dom";

export default class RunResponse extends Component {
    render() {
        const { data, toggle, valid, clear } = this.props;

        return (
            <div className={"modal is-active"}>
                <div className="modal-background" />
                <div className="modal-content">
                    <div className="card">
                        <header className="card-header">
                            <p className="card-header-title">
                                Your NLPQL is&nbsp;
                                {valid ? (
                                    <span className="has-text-success">
                                        VALID
                                    </span>
                                ) : (
                                    <span className="has-text-danger">
                                        INVALID
                                    </span>
                                )}
                                :
                            </p>
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
                            <a className="card-footer-item" onClick={clear}>
                                Build Another Query
                            </a>
                            <Link className="card-footer-item" to="/results">
                                See Results
                            </Link>
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
