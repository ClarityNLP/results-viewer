import React, { Component } from "react";
import ReactJson from "react-json-view";

export default class TestResponse extends Component {
    toggleLimitModal = () => {
        this.props.toggle();
        this.props.toggleLimitModal();
    };

    componentDidMount() {
        let htmlClasses = document.getElementsByTagName("html")[0].classList;

        htmlClasses.add("is-clipped");
    }

    componentWillUnmount() {
        let htmlClasses = document.getElementsByTagName("html")[0].classList;

        htmlClasses.remove("is-clipped");
    }

    render() {
        const { data, toggle, valid } = this.props;

        return (
            <div className="modal is-active">
                <div className="modal-background" />
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">
                            {" "}
                            Your NLPQL is&nbsp;
                            {valid ? (
                                <span className="has-text-success">VALID</span>
                            ) : (
                                <span className="has-text-danger">INVALID</span>
                            )}
                            :
                        </p>
                        <button
                            className="delete"
                            aria-label="close"
                            onClick={toggle}
                        />
                    </header>
                    <section className="modal-card-body">
                        <div className="response-json">
                            <ReactJson
                                src={data}
                                displayObjectSize={false}
                                displayDataTypes={false}
                            />
                        </div>
                    </section>
                    <footer className="modal-card-foot">
                        <div className="column is-5 is-offset-7">
                            <button
                                disabled={!valid}
                                className="button is-large is-primary"
                                onClick={this.toggleLimitModal}
                            >
                                Run Query
                            </button>
                        </div>
                    </footer>
                </div>
            </div>
        );
    }
}
