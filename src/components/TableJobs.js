import React, { Component } from 'react';
import { Table } from 'reactstrap';

class TableJobs extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }


    render() {
        const header_items =  ["Job ID", "Name", "Phenotype ID", "Owner", "Date" ].map((h) => {
            return <th key={h}>{h}</th>;
        });
        const job_items = this.props.jobs.map((p) => {
            return <tr className="JobRow" key={p.nlp_job_id} onClick={(e) => this.props.selectJob(p, e)}>
                <th>{p.nlp_job_id}</th>
                <th>{p.name}</th>
                <th>{p.phenotype_id}</th>
                <th>{p.owner}</th>
                <th>{p.date_started}</th>
            </tr>;
        });

        return (
            <div>
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