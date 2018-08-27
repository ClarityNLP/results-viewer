import React, {Component} from 'react';
import {Cell, Column, Table} from 'fixed-data-table-2';
import axios from 'axios';
import _ from 'lodash';

const ALL = 4;
const page_size = 100;
const row_height = 80;
const header_height = 50;


// Based on example from https://github.com/schrodinger/fixed-data-table-2/blob/master/examples/PaginationExample.js
class PendingCell extends React.PureComponent {
    render() {
        const {data, rowIndex, columnKey, dataVersion, ...props} = this.props;
        const rowObject = data.getObjectAt(rowIndex);
        return (
            <Cell {...props}>
                {rowObject ? rowObject[columnKey] : 'pending'}
            </Cell>
        );
    }
}

const PagedCell = ({data, ...props}) => {
    const dataVersion = data.getDataVersion();
    return (
        <PendingCell
            data={data}
            dataVersion={dataVersion}
            {...props}>
        </PendingCell>
    );
};

class ResultData {
    constructor(callback, job, get_url) {

        this._dataList = [];
        this._end = page_size;
        this._pending = false;
        this._dataVersion = 0;
        this._callback = callback;
        this.job = job;
        this.get_url = get_url;
        this.new_last_id = '';
        this.size = page_size;
        this.no_more = false;
        this.columns = [];

        this.getDataStore(job, get_url, true);

    }

    getDataStore(job, get_url, first, resolve) {

        if (first) {
            axios.get(get_url).then(response => {
                if (response.data.success) {
                    let results = response.data.results;
                    this.new_last_id = response.data.new_last_id;
                    this.size = response.data.count;
                    this.no_more = response.data.no_more;
                    this.columns = response.data.columns;
                    this._dataList = results;
                }
                this._callback(page_size);


            });
        } else {
            axios.get(get_url + '?last_id=' + this.new_last_id).then(response => {
                if (response.data.success) {
                    let results = response.data.results;
                    if (resolve !== null) {
                        resolve({
                                last_id: response.data.new_last_id,
                                no_more: response.data.no_more,
                                results: results
                            });
                    }
                }
            });
        }

    }

    appendResults(results) {
        this._dataList = _.concat(this._dataList, results);
        console.log(this._dataList.length)
    }

    getDataVersion() {
        return this._dataVersion;
    }

    getSize() {
        return this.size;
    }

    fetchRange(end) {
        if (this._pending) {
            return;
        }

        this._pending = true;
        return new Promise((resolve) => {
           this.getDataStore(this.job, this.get_url, false, resolve);

        })
        .then((res) => {
            console.log('done loading data store');
            this._pending = false;
            this._end = end;
            this._dataVersion++;
            this.new_last_id = res.last_id;
            this.no_more = res.no_more;
            this.appendResults(res.results);

            this._callback(end);
        });
    }

    getObjectAt(index) {
        if (index >= this._end) {
            this.fetchRange(Math.min(this.size, index + page_size));
            return null;
        }
        if (this._dataList.length > index) {
            return this._dataList[index];
        }
        return null;
    }
}


class RawResultsView extends Component {


    constructor(props) {
        super(props);
        this.updateData = this.updateData.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        let final_results = (props.mode === ALL);
        let job_id = props.job.nlp_job_id;
        let get_url = this.props.url + 'phenotype_paged_results/' + job_id + '/' + final_results;
        this.state = {
            ResultData: new ResultData(this.updateData, props.job, get_url),
            end: 0,
            width: 0,
            height: 0,
            mode: props.mode
        };
    }

    componentDidUpdate(prevProps) {
        // console.log(this.props)
        if (prevProps.mode !== this.props.mode) {

            let final_results = (this.props.mode === ALL);
            let job_id = this.props.job.nlp_job_id;
            let get_url = this.props.url + 'phenotype_paged_results/' + job_id + '/' + final_results;
            this.setState({
                ResultData: new ResultData(this.updateData, this.props.job, get_url),
                mode: this.props.mode
            });
        }
    }

    updateData(end) {
        this.setState({
            end: end
        });
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({
            width: window.innerWidth,
            height: window.innerHeight
        });
    }


    render() {
        const filter_out_columns = ['_id', 'inserted_date', 'phenotype_final', '_id_x', '_id_y', '_id_z'];
        const long_columns = ['sentence', 'sentence_x', 'sentence_y', 'sentence_z'];
        const med_columns = ['term', 'section', 'report_date', 'report_id', 'job_date'];
        let {ResultData, width} = this.state;

        let w = width - 100;
        let columns = ResultData.columns
            .filter(c => filter_out_columns.indexOf(c) < 0)
            .map((c) => {
                let col_width = 75;
                if (long_columns.indexOf(c) >= 0) {
                    col_width = 500;
                } else if (med_columns.indexOf(c) >= 0) {
                    col_width = 200;
                } else if (c.length > 12) {
                    col_width = 200;
                } else if (c.length > 8) {
                    col_width = 150;
                }
            return (
                <Column
                columnKey={c} key={c}
                header={<Cell>{c}</Cell>}
                cell={<PagedCell data={ResultData} />}
                width={col_width}
            />);
        });
        return (
            <div className="RawResultsTable">

                <Table
                    rowHeight={row_height}
                    rowsCount={ResultData.getSize()}
                    headerHeight={header_height}
                    width={w}
                    height={Math.min(600, (ResultData.getSize() * (row_height + 3)) + header_height + 5)}
                    {...this.props}>
                    {columns}
                </Table>
            </div>
        )
    }
}

export default RawResultsView;