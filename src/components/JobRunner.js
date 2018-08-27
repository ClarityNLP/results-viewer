import React, { Component } from 'react';
import { Button, FormText, Input } from 'reactstrap';
import axios from 'axios';

class JobRunner extends Component {


    constructor(props) {
        super(props);
        this.base_url = props.url;

        this.state = {
            jobs: [],
            job: {},
            show_list: true
        };
    }



    componentDidMount() {

    }



    render() {
        return (
            <div className="JobRunner container-fluid">
                <div className="row">
                    <div className="col-8">
                        <h4 className="SubHeader">NLPQL Runner</h4>
                        <Input className="NLPQLArea" type="textarea" name="text" id="nlpql" rows="15" />
                    </div>
                    <div className="col-4">
                        <h5 className="SubHeader">Results</h5>
                    </div>
                </div>
                <div className="row">
                    &nbsp;
                </div>
                <div className="row">
                    <div className="col-8">
                        <Button color="info">Expand Terms</Button>
                        {" "}
                        <Button color="success">Run NLPQL</Button>

                    </div>

                </div>
            </div>
        );
    }
}

export default JobRunner;