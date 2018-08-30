import React, { Component } from 'react';
import { Table, Input } from 'reactstrap';
import Moment from 'react-moment';
import 'moment-timezone';

class TableJobs extends Component {

    constructor(props) {
        super(props);
        this.getStatus = this.getStatus.bind(this);
        this.keyUpHandler = this.keyUpHandler.bind(this);

        this.state = {
            filter: '',
            jobs: props.jobs
        };
    }

    getStatus(row) {
        if (row.status !== "IN_PROGRESS") {
            return (
                <span>{row.status}</span>
            );
        } else {
            let luigi = this.props.luigi + '/static/visualiser/index.html#search__search=job=' + row.nlp_job_id;
            return <span><a target="_blank" href={luigi}>{row.status}</a></span>
        }
    }

    keyUpHandler() {
        let txt = document.getElementById('jobs_filter').value.toLowerCase();

        setTimeout(() => {
            let new_jobs = this.props.jobs.filter((f) => {
                let name = f.phenotype_name.toLowerCase();
                return name.indexOf(txt) >= 0;
            });
            this.setState({
                filter: txt,
                jobs: new_jobs
            });
        }, 25);

    };

    componentDidUpdate(prevProps) {
        if (this.props.jobs.length !== prevProps.jobs.length) {
            this.setState({
                jobs: this.props.jobs
            })
        }
    }

    render() {
        const header_items =  ["Job ID", "Name", "Phenotype ID", "Status", "Date", "Download" ].map((h) => {
            return <th key={h}>{h}</th>;
        });
        let job_items = this.state.jobs.map((p) => {
            return <tr className="JobRow" key={p.nlp_job_id} >
                <td onClick={(e) => this.props.selectJob(p, e)}>{p.nlp_job_id}</td>
                <td onClick={(e) => this.props.selectJob(p, e)} className="PhenotypeName"><span>{p.phenotype_name}</span></td>
                <td onClick={(e) => this.props.selectJob(p, e)}>{p.phenotype_id}</td>
                <td onClick={(e) => this.props.selectJob(p, e)}>{this.getStatus(p)}</td>
                <td onClick={(e) => this.props.selectJob(p, e)}><Moment format="MMM D, YYYY h:mm a">
                    {p.date_started}
                </Moment></td>
                <td>
                    <a href={ this.props.url + "job_results/" + p.nlp_job_id + "/phenotype_intermediate"}>Features</a>
                    <span> | </span>
                    <a href={ this.props.url + "job_results/" + p.nlp_job_id + "/phenotype"}>Cohort</a>
                </td>
            </tr>;
        });

        return (
            <div>
                <div className="SubHeader">
                    NLPQL Results
                    <div className="float-lg-right">
                        <Input type="text" name="filter" id="jobs_filter" placeholder="Search..." onKeyUp={this.keyUpHandler} />
                    </div>
                </div>
                <Table striped>
                    <thead>
                        <tr>
                         {header_items}
                        </tr>
                    </thead>
                    <tbody>
                        {job_items}
                    </tbody>
                </Table>
            </div>
        )
    }
}

export default TableJobs;