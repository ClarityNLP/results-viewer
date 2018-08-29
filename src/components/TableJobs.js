import React, { Component } from 'react';
import { Table } from 'reactstrap';
import Moment from 'react-moment';
import 'moment-timezone';

class TableJobs extends Component {

    constructor(props) {
        super(props);
        this.getStatus = this.getStatus.bind(this);
        this.state = {
        };
    }

    getStatus(row) {
        if (row.status === "COMPLETED") {
            return (
                <span>COMPLETED</span>
            );
        } else {
            let luigi = this.props.luigi + '/static/visualiser/index.html#search__search=job=' + row.nlp_job_id;
            return <span><a target="_blank" href={luigi}>{row.status}</a></span>
        }
    }
    render() {
        const header_items =  ["Job ID", "Name", "Phenotype ID", "Status", "Date", "Download" ].map((h) => {
            return <th key={h}>{h}</th>;
        });
        const job_items = this.props.jobs.map((p) => {
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