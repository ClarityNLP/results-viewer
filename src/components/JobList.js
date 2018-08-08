import React, { Component } from 'react';
import { TableSimple } from 'react-pagination-table';
import axios from 'axios';

const Header = ["Job ID", "Name", "Phenotype ID", "Owner", "Date" ];
const base_url = process.env.REACT_APP_CLARITY_NLP_URL;

class JobList extends Component {


    constructor(props) {
        super(props);
        this.state = {
            jobs: []
        };
    }

    componentDidMount() {
        let url = base_url + 'phenotype_jobs/COMPLETED';
        axios.get(url).then(response => {
            console.log(response)
        });
    }

    render() {
        return (
            <div className="JobList">
                <TableSimple
                    title="Phenotype Jobs"
                    data={ this.state.jobs }
                    headers={ Header }
                    columns="nlp_job_id.name.phenotype_id.owner.date"
                    arrayOption={ [] }
                />
            </div>
        );
    }
}

export default JobList;