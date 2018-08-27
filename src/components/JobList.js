import React, { Component } from 'react';
import axios from 'axios';
import ResultViewer from './ResultViewer';
import TableJobs from './TableJobs';

class JobList extends Component {


    constructor(props) {
        super(props);
        this.base_url = props.url;
        this.selectJob = this.selectJob.bind(this);
        this.resetJobsList = this.resetJobsList.bind(this);

        this.state = {
            jobs: [],
            job: {},
            show_list: true,
            job_param: props.job
        };
    }



    componentDidMount() {
        let url = this.base_url + 'phenotype_jobs/COMPLETED';
        axios.get(url).then(response => {
            this.setState(prevState => ({
                jobs: response.data
            }));
        });
        if (this.state.job_param !== null) {
            let url = this.base_url + 'phenotype_job_by_id/' + this.state.job_param;
            console.log(this.state.job_param);
            axios.get(url).then(response => {
                this.setState(prevState => ({
                    job: response.data,
                    show_list: false
                }));
            });
        }
    }

    resetJobsList() {
        this.setState(prevState => ({
            job: {},
            show_list: true
        }));
    }

    selectJob(p, e) {
        //console.log(p);
        if (p !== null && p['nlp_job_id'] !== -1) {
            this.setState(prevState => ({
                job: p,
                show_list: false
            }));
        }

    }

    render() {
        return (
            <div className="JobList">
                {this.state.show_list ?
                    <TableJobs jobs={this.state.jobs} selectJob={this.selectJob} url={this.props.url}/> :
                    <ResultViewer resetJobsList={this.resetJobsList} job={this.state.job} url={this.props.url}/>}
            </div>
        );
    }
}

export default JobList;