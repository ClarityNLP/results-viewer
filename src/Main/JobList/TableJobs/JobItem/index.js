import React, { Component } from 'react';
import { FaCode, FaFileAlt, FaStop, FaTrash } from 'react-icons/fa';
import Moment from 'react-moment';
import 'moment-timezone';
import axios from 'axios';

export default class JobItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cohort_size: null,
      accuracy: null
    };
  }

  componentDidMount() {
    this.setPerformanceAndStats();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.stats !== prevProps.stats ||
      this.props.performance !== prevProps.performance
    ) {
      this.setPerformanceAndStats();
    }
  }

  setPerformanceAndStats = () => {
    const { job, stats, performance } = this.props;
    let new_cohort_size = null;
    let new_accuracy = null;

    if (stats[job.nlp_job_id]) {
      new_cohort_size = stats[job.nlp_job_id].final_subjects;
    }

    if (performance[job.nlp_job_id]) {
      new_accuracy = performance[job.nlp_job_id].accuracy_score;
    }

    this.setState({
      cohort_size: new_cohort_size,
      accuracy: new_accuracy
    });
  };

  download = (url, fileName) => {
    const { accessToken, downloadLink } = this.props;
    const { current: node } = downloadLink;

    axios
      .get(url, {
        headers: { Authorization: 'Bearer ' + accessToken }
      })
      .then(response => {
        let binaryData = [];
        binaryData.push(response.data);

        const windowUrl = window.URL || window.webkitURL;
        const url = windowUrl.createObjectURL(
          new Blob(binaryData, { type: 'text/csv' })
        );

        node.href = url;
        node.download = `${fileName}.csv`;
        node.click();
        windowUrl.revokeObjectURL(url);
      })
      .catch(err => {
        console.error(err);
      });
  };

  getStatus = row => {
    const { luigi } = this.props;

    if (row.status !== 'IN_PROGRESS') {
      return <span>{row.status}</span>;
    } else {
      let luigi_link =
        luigi +
        '/static/visualiser/index.html#search__search=job=' +
        row.nlp_job_id;
      return (
        <span>
          <a target='_blank' href={luigi_link}>
            {row.status}
          </a>
        </span>
      );
    }
  };

  render() {
    const { cohort_size, accuracy } = this.state;
    const { job, url } = this.props;

    return (
      <tr className='JobRow' key={job.nlp_job_id}>
        <td
          onClick={e => this.props.selectJob(job, e)}
          className='PhenotypeName'
        >
          <span>{job.phenotype_name}</span>
        </td>
        <td
          style={{ minWidth: '120px' }}
          onClick={e => this.props.selectJob(job, e)}
        >
          <Moment format='MMM D, YYYY h:mm a'>{job.date_started}</Moment>
        </td>
        <td onClick={e => this.props.selectJob(job, e)}>
          {this.getStatus(job)}
        </td>
        <td>{cohort_size}</td>
        <td>{accuracy}</td>
        <td className='has-text-centered'>
          <a
            onClick={() =>
              this.download(
                `${url}/job_results/${job.nlp_job_id}/phenotype_intermediate`,
                'phenotype_intermediate'
              )
            }
          >
            Features
          </a>
          <span> | </span>
          <a
            onClick={() =>
              this.download(
                `${url}/job_results/${job.nlp_job_id}/phenotype`,
                'phenotype'
              )
            }
          >
            Cohort
          </a>
          <br />
          <a
            onClick={() =>
              this.download(
                `${url}/job_results/${job.nlp_job_id}/annotations`,
                'annotations'
              )
            }
          >
            Annotations
          </a>
        </td>
        <td style={{ minWidth: '100px' }}>
          <span
            title='View NLPQL'
            className='JobListIcons'
            onClick={e => this.props.showNLPQL(job, e)}
          >
            <FaFileAlt />
          </span>
          <span title='View JSON' onClick={e => this.props.showJSON(job, e)}>
            <FaCode />
          </span>
          <span style={{ paddingRight: '20px' }}>&nbsp;</span>
          {job.status === 'IN_PROGRESS' ? (
            <span
              title='Kill Job'
              onClick={e => this.props.killJob(job.nlp_job_id)}
            >
              <FaStop />
            </span>
          ) : (
            <span
              title='Delete Job'
              onClick={e => this.props.deleteJob(job.nlp_job_id)}
            >
              <FaTrash />
            </span>
          )}
        </td>
      </tr>
    );
  }
}
