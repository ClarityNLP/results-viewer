import React, { Component } from 'react';
import { Table } from 'reactstrap';

class TableJobs extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }


    render() {
        const header_items =  ["Job ID", "Name", "Phenotype ID", "Owner", "Date", "Download" ].map((h) => {
            return <th key={h}>{h}</th>;
        });
        const job_items = this.props.jobs.map((p) => {
            return <tr className="JobRow" key={p.nlp_job_id} >
                <td onClick={(e) => this.props.selectJob(p, e)}>{p.nlp_job_id}</td>
                <td onClick={(e) => this.props.selectJob(p, e)}>{p.phenotype_name}</td>
                <td onClick={(e) => this.props.selectJob(p, e)}>{p.phenotype_id}</td>
                <td onClick={(e) => this.props.selectJob(p, e)}>{p.owner}</td>
                <td onClick={(e) => this.props.selectJob(p, e)}>{p.date_started}</td>
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