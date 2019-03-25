import React, { Component } from "react";
import { FaArrowLeft } from "react-icons/fa";
import RawResultsView from "./RawResultsView";
import ExploreResultsSubjects from "./ExploreResultsSubjects";

const EXPLORE = 1;
const ANNOTATE = 2;
const INTERMEDIATE = 3;
const ALL = 4;

class ResultViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode_selected: 1
        };
    }

    onRadioBtnClick(mode_selected) {
        this.setState({ mode_selected });
    }

    render() {
        return (
            <React.Fragment>
                <div className="columns">
                    <div className="column is-1">
                        <button
                            className="button"
                            onClick={this.props.resetJobsList}
                        >
                            <FaArrowLeft />
                        </button>
                    </div>
                    <div className="column is-8 has-text-centered">
                        <h3 className="has-text-weight-bold">
                            {this.props.job.phenotype_name}
                            <span className="PatientCount">
                                {this.state.patient_count}
                            </span>
                        </h3>
                    </div>
                    <div className="column is-3">
                        <div className="ToggleButtons">
                            <div className="field has-addons">
                                <div className="control">
                                    <button
                                        className="button"
                                        onClick={() =>
                                            this.onRadioBtnClick(EXPLORE)
                                        }
                                        disabled={
                                            this.state.mode_selected === EXPLORE
                                        }
                                    >
                                        Explore
                                    </button>
                                </div>
                                <div className="control">
                                    <button
                                        className="button"
                                        onClick={() =>
                                            this.onRadioBtnClick(INTERMEDIATE)
                                        }
                                        disabled={
                                            this.state.mode_selected ===
                                            INTERMEDIATE
                                        }
                                    >
                                        Features
                                    </button>
                                </div>
                                <div className="control">
                                    <button
                                        className="button"
                                        onClick={() =>
                                            this.onRadioBtnClick(ALL)
                                        }
                                        disabled={
                                            this.state.mode_selected === ALL
                                        }
                                    >
                                        Cohort
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="columns">
                    {this.state.mode_selected === EXPLORE ||
                    this.state.mode_selected === ANNOTATE ? (
                        <ExploreResultsSubjects
                            job={this.props.job}
                            url={this.props.url}
                            accessToken={this.props.accessToken}
                        />
                    ) : (
                        <RawResultsView
                            job={this.props.job}
                            mode={this.state.mode_selected}
                            url={this.props.url}
                            accessToken={this.props.accessToken}
                        />
                    )}
                </div>
            </React.Fragment>
        );
    }
}

export default ResultViewer;
