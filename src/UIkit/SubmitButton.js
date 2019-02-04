import React from "react";

class SubmitButton extends React.Component {
    render() {
        return (
            <div className="level-right">
                <div className="column is-5">
                    {this.props.children}
                    <button
                        className="button is-primary"
                        type="submit"
                        onClick={this.props.handleSubmit}
                    >
                        {this.props.label}
                    </button>
                </div>
            </div>
        );
    }
}

export default SubmitButton;
