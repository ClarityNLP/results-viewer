import React, { Component } from 'react';
import { Table } from 'reactstrap';
import axios from "axios";

class ExploreResultsSubjects extends Component {

    constructor(props) {
        super(props);
        this.selectSubject = this.selectSubject.bind(this);
        this.state = {
            show_subject_list: true,
            subjects: [],
            selected_subject: {}
        };
    }

    selectSubject(subject, event) {

    }

    componentDidMount() {

        let phenotype_final = true;
        let job_id = this.props.job.nlp_job_id;
        let url = this.props.url + 'phenotype_subjects/' + job_id + '/' + phenotype_final;
        axios.get(url).then(response => {
            this.setState(prevState => ({
                subjects: response.data
            }));
        });
    }

    render() {
        const header_items =  ["Subject", "Count" ].map((h) => {
            return <th key={h}>{h}</th>;
        });
        const subjects = this.state.subjects.map((p) => {
            return <tr className="SubjectRow" key={p._id} onClick={(e) => this.selectSubject(p, e)}>
                <th>{p._id}</th>
                <th>{p.count}</th>
            </tr>;
        });

        return (
            <div>
                {this.state.show_subject_list ?
                    <Table className="SubjectTable" striped>
                        <thead>
                        <tr>
                            {header_items}
                        </tr>
                        </thead>
                        <tbody>
                        {subjects}
                        </tbody>
                    </Table>
                    :
                    <div>

                    </div>
                }
            </div>
        )
    }
}

export default ExploreResultsSubjects;