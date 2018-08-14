import React, { Component } from 'react';
import { Button,  ButtonGroup } from 'reactstrap';
import { FaArrowLeft } from 'react-icons/fa';
import RawResultsView from './RawResultsView';
import ExploreResultsSubjects from './ExploreResultsSubjects';

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

    componentDidMount() {
    }

    componentDidUpdate(prevProps) {
        // console.log(this.props)
    }

    onRadioBtnClick(mode_selected) {
        this.setState({ mode_selected });
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col">
                        <h3><small><Button className="btn btn-light ArrowButtons" onClick={this.props.resetJobsList}><FaArrowLeft/></Button>
                        </small><span className="PhenotypeTitle">{this.props.job.name}</span>
                            <small className="float-sm-right ToggleButtons"><ButtonGroup>
                                <Button onClick={() => this.onRadioBtnClick(EXPLORE)} active={this.state.mode_selected === EXPLORE}>Explore</Button>
                                <Button onClick={() => this.onRadioBtnClick(INTERMEDIATE)} active={this.state.mode_selected === INTERMEDIATE}>Intermediate</Button>
                                <Button onClick={() => this.onRadioBtnClick(ALL)} active={this.state.mode_selected === ALL}>Final</Button>
                            </ButtonGroup></small>
                            { this.state.mode_selected === EXPLORE || this.state.mode_selected === ANNOTATE ?
                                <div>
                                    <ExploreResultsSubjects job={this.props.job} url={this.props.url} />
                                </div>:
                                <div>
                                    <RawResultsView job={this.props.job} mode={this.state.mode_selected} url={this.props.url} />
                                </div>
                                
                            }
                        </h3>
                    </div>
                </div>

            </div>
        )
    }
}

export default ResultViewer;