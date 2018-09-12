import React, { Component } from 'react';
import axios from 'axios';
import EntityFrame from './EntityFrame';
import { FaCheck, FaTimes, FaStickyNote } from 'react-icons/fa';
import { Button } from 'reactstrap';

const suffixes = ['_x', '_y'];

class PhenotypeDetail extends Component {

    constructor(props) {
        super(props);
        this.resetViewAll = this.resetViewAll.bind(this);
        this.state = {
            view_mode: "all",
            selected_result_index: props.selected_result_index,
            selected_result: props.selected_result,
            results: []
        };
        this.url = props.url;
        this.detailed_results = {};

        this.ids = [];
        if ('_id' in props.selected_result) this.ids.push(props.selected_result['_id']);
        if ('_id_x' in props.selected_result) this.ids.push(props.selected_result['_id_x']);
        if ('_id_y' in props.selected_result) this.ids.push(props.selected_result['_id_y']);
        if ('_id_z' in props.selected_result) this.ids.push(props.selected_result['_id_z']);
        this.id_string = this.ids.join();
    }


    resetViewAll(detail_results) {
        if (!detail_results) {
            detail_results = this.detailed_results;
        }
        let {selected_result} = this.state;
        let results = [];
        if ('sentence_x' in selected_result) {
            results = suffixes.map((s, index) => {
                let id = selected_result['_id' + s];
                let detail = {};
                if (id in detail_results['indexes']) {
                    let detail_idx = detail_results['indexes'][id];
                    detail = detail_results['results'][detail_idx];
                }
                return {
                    "index": index,
                    "feature": selected_result['nlpql_feature' + s],
                    "report_date": selected_result['report_date' + s],
                    "text": selected_result['sentence' + s],
                    "id": id,
                    "detail": detail,
                    "report_id": selected_result['report_id' + s]

                };
            });
        } else {
            results.push({
                "index": 0,
                "feature": selected_result['nlpql_feature'],
                "report_date": selected_result['report_date'],
                "text": selected_result['sentence'],
                "id": selected_result['_id'],
                "detail": selected_result,
                "report_id": selected_result['report_id']
            })
        }

        this.setState({
            results: results
        });
    }

    componentDidMount() {
        let get_url = this.url + 'phenotype_results_by_id/' + this.id_string;
        axios.get(get_url).then(response => {
            this.detailed_results = response.data;
            this.resetViewAll(response.data);
        });

    }

    componentDidUpdate(prevProps) {
        if (this.props.selected_result_index !== this.state.selected_result_index) {
            this.setState({
                selected_result_index: this.props.selected_result_index,
                selected_result: this.props.selected_result
            }, this.resetViewAll);
        }
    }

    render() {
        let {selected_result, selected_result_index, results} = this.state;
        let results_view = results.map((d) => {
             return (
                <EntityFrame key={d['index']} data={d} url={this.url} showPhenotypeTypDetail={this.props.showPhenotypeTypDetail}
                    nlpql_feature={selected_result.nlpql_feature}
                />
            );
        });
        return (
            <div >
                {selected_result_index > -1 ?
                    <div className="PhenotypeDetailMain">
                        <div><span className="h4"> {selected_result.nlpql_feature} </span>
                            {selected_result.raw_definition_text && selected_result.raw_definition_text.length > 0 ?
                            <small>  ({selected_result.raw_definition_text})</small> :
                                <span />}
                            <span className="float-lg-right">
                                <Button outline size="sm" color="success"><FaCheck/></Button> { " " }
                                <Button outline size="sm" color="danger"><FaTimes/></Button> { " " }
                                <Button outline size="sm" color="info"><FaStickyNote/></Button> { " " }
                            </span>
                        </div>
                        {results_view}

                    </div> :
                    <span/>
                }
            </div>
        )
    }
}

export default PhenotypeDetail;
