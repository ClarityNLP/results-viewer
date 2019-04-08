import React, { Component } from 'react';
import Moment from 'react-moment';
import 'moment-timezone';
import { FaCode, FaFileAlt, FaStop, FaTrash } from 'react-icons/fa';
import ReactJson from 'react-json-view';
import axios from 'axios';

class TableJobs extends Component {
  constructor(props) {
    super(props);

    this.downloadLink = React.createRef();

    if (props.filter !== '') {
      props.getFilter(props.filter);
    }

    this.state = {
      jobs: props.jobs,
      current_jobs: [],
      stats: {},
      performance: {},
      modal: false,
      modal_title: 'View NLPQL',
      modal_type: 'NLPQL',
      nlpql: '',
      config: {},
      job_items: [],
      job_modal: false,
      job_modal_title: 'Kill Job',
      job_modal_type: 'KILL',
      job_id: '-1',
      job_danger_status: '',
      can_continue_action: true,
      filter: props.filter,
      page_limit: 20,
      page: 1,
      num_pages: 0
    };
  }

  download = (url, fileName) => {
    const { current: node } = this.downloadLink;

    axios
      .get(url, {
        headers: { Authorization: 'Bearer ' + this.props.accessToken }
      })
      .then(response => {
        var binaryData = [];
        binaryData.push(response.data);
        var windowUrl = window.URL || window.webkitURL;
        var url = windowUrl.createObjectURL(
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

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  };

  jobToggle = () => {
    this.setState(prevState => ({
      job_modal: !prevState.job_modal
    }));
  };

  showJSON = job => {
    this.setState({
      modal: true,
      config: JSON.parse(job.config),
      modal_title: 'JSON: ',
      modal_type: 'JSON',
      nlpql: ''
    });
  };

  showNLPQL = job => {
    this.setState({
      modal: true,
      config: {},
      modal_title: 'NLPQL: ',
      modal_type: 'NLPQL',
      nlpql: job.nlpql
    });
  };

  killJob = jobId => {
    this.setState({
      job_modal: true,
      job_modal_title: 'Kill job ' + jobId,
      job_modal_type: 'KILL',
      job_id: jobId,
      job_danger_status: ''
    });
  };

  deleteJob = jobId => {
    this.setState({
      job_modal: true,
      job_modal_title: 'Delete job ' + jobId,
      job_modal_type: 'DELETE',
      job_id: jobId,
      job_danger_status: ''
    });
  };

  takeSeriousAction = () => {
    const { job_id, job_modal_type } = this.state;

    this.setState({
      can_continue_action: false
    });

    let action_url = this.props.url + '/delete_job/' + job_id;

    if (job_modal_type === 'KILL') {
      action_url = this.props.url + '/kill_job/' + job_id;
    }

    axios
      .get(action_url, {
        headers: { Authorization: 'Bearer ' + this.props.accessToken }
      })
      .then(response => {
        this.setState({
          job_danger_status: response.data,
          job_id: -1
        });
        this.props.refreshJobs();
        setTimeout(() => {
          this.setState({
            job_modal: false,
            can_continue_action: true
          });
        }, 100);
      });
  };

  getStatus = row => {
    if (row.status !== 'IN_PROGRESS') {
      return <span>{row.status}</span>;
    } else {
      let luigi =
        this.props.luigi +
        '/static/visualiser/index.html#search__search=job=' +
        row.nlp_job_id;
      return (
        <span>
          <a target='_blank' href={luigi}>
            {row.status}
          </a>
        </span>
      );
    }
  };

  getJobStats = IDs => {
    const url = this.props.url + `/stats/${IDs}`;

    axios
      .get(url, {
        headers: { Authorization: 'Bearer ' + this.props.accessToken }
      })
      .then(response => {
        this.setState({
          stats: response.data
        });
      })
      .catch(err => {
        console.error(err);
      });
  };

  getJobPerformance = IDs => {
    const url = this.props.url + `/performance/${IDs}`;

    axios
      .get(url, {
        headers: { Authorization: 'Bearer ' + this.props.accessToken }
      })
      .then(response => {
        this.setState({
          performance: response.data
        });
      })
      .catch(err => {
        console.error(err);
      });
  };

  keyUpHandler = () => {
    let txt = document.getElementById('jobs_filter').value.toLowerCase();
    this.props.getFilter(txt);
  };

  componentDidUpdate(prevProps) {
    const { jobs, filter } = this.props;
    const { page_limit } = this.state;

    const tmp_num_pages = Math.ceil(jobs.length / page_limit);

    if (jobs.length !== prevProps.jobs.length) {
      this.setState(
        {
          jobs: jobs,
          num_pages: tmp_num_pages
        },
        this.setCurrentJobs
      );
    }

    if (filter !== this.state.filter) {
      this.setState({
        filter: this.props.filter
      });
    }
  }

  componentDidMount() {
    const { jobs } = this.props;
    const { filter, page_limit } = this.state;

    const tmp_num_pages = Math.ceil(jobs.length / page_limit);

    if (filter !== '') {
      document.getElementById('jobs_filter').value = filter;
    }

    this.setState(
      {
        num_pages: tmp_num_pages
      },
      this.setCurrentJobs
    );
  }

  setCurrentJobs = () => {
    const { jobs, page, page_limit } = this.state;

    this.setState(
      {
        current_jobs: jobs.slice((page - 1) * page_limit, page * page_limit)
      },
      this.setJobItems
    );
  };

  setJobItems = () => {
    const { current_jobs, stats, performance } = this.state;

    const IDs = current_jobs.map(job => {
      return job.nlp_job_id;
    });

    this.getJobPerformance(IDs);
    this.getJobStats(IDs);

    const tmp_jobItems = [];

    for (let i = 0; i < current_jobs.length; i++) {
      let p = current_jobs[i];
      let cohort_size = null;
      let accuracy = null;

      if (stats[p.nlp_job_id]) {
        cohort_size = stats[p.nlp_job_id].final_subjects;
      }

      if (performance[p.nlp_job_id]) {
        accuracy = performance[p.nlp_job_id].accuracy_score;
      }

      tmp_jobItems.push(
        <tr className='JobRow' key={p.nlp_job_id}>
          <td
            onClick={e => this.props.selectJob(p, e)}
            className='PhenotypeName'
          >
            <span>{p.phenotype_name}</span>
          </td>
          <td
            style={{ minWidth: '120px' }}
            onClick={e => this.props.selectJob(p, e)}
          >
            <Moment format='MMM D, YYYY h:mm a'>{p.date_started}</Moment>
          </td>
          <td onClick={e => this.props.selectJob(p, e)}>{this.getStatus(p)}</td>
          <td>{cohort_size}</td>
          <td>{accuracy}</td>
          <td className='has-text-centered'>
            <a
              onClick={() =>
                this.download(
                  `${this.props.url}/job_results/${
                    p.nlp_job_id
                  }/phenotype_intermediate`,
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
                  `${this.props.url}/job_results/${p.nlp_job_id}/phenotype`,
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
                  `${this.props.url}/job_results/${p.nlp_job_id}/annotations`,
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
              onClick={e => this.showNLPQL(p, e)}
            >
              <FaFileAlt />
            </span>
            <span title='View JSON' onClick={e => this.showJSON(p, e)}>
              <FaCode />
            </span>
            <span style={{ paddingRight: '20px' }}>&nbsp;</span>
            {p.status === 'IN_PROGRESS' ? (
              <span title='Kill Job' onClick={e => this.killJob(p.nlp_job_id)}>
                <FaStop />
              </span>
            ) : (
              <span
                title='Delete Job'
                onClick={e => this.deleteJob(p.nlp_job_id)}
              >
                <FaTrash />
              </span>
            )}
          </td>
        </tr>
      );
    }

    this.setState({
      job_items: tmp_jobItems
    });
  };

  nextPage = () => {
    const { page, num_pages } = this.state;
    const next_page = page + 1;

    if (next_page > num_pages) {
      return;
    }

    this.setState(
      {
        page: next_page
      },
      this.setCurrentJobs()
    );
  };

  prevPage = () => {
    const { page } = this.state;
    const prev_page = page - 1;

    if (prev_page < 1) {
      return;
    }

    console.log(prev_page);

    this.setState(
      {
        page: prev_page
      },
      this.setCurrentJobs()
    );
  };

  render() {
    const {
      job_items,
      job_modal,
      job_modal_type,
      job_modal_title,
      modal_type,
      modal,
      modal_title,
      nlpql,
      config,
      page,
      num_pages
    } = this.state;

    return (
      <div>
        <div className='SubHeader columns'>
          <div className='column is-half'>
            <div className='field'>
              <label className='label'>NLPQL Results</label>
              <input
                id='jobs_filter'
                className='input'
                type='text'
                name='filter'
                onKeyUp={this.keyUpHandler}
                placeholder='Search...'
              />
            </div>
          </div>
        </div>
        <nav className='pagination' aria-label='pagination'>
          <a className='pagination-previous' onClick={this.prevPage}>
            Previous
          </a>
          <a className='pagination-next' onClick={this.nextPage}>
            Next
          </a>
          <ul className='pagination-list'>
            <li>
              <span className='pagination-ellipsis'>{page}</span>
            </li>
            <li>
              <span className='pagination-ellipsis'>of</span>
            </li>
            <li>
              <span className='pagination-ellipsis'>{num_pages}</span>
            </li>
          </ul>
        </nav>
        <table className='JobTable table is-striped'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Status</th>
              <th>N</th>
              <th>Accuracy</th>
              <th>Download CSV</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{job_items}</tbody>
        </table>
        <div className={modal ? 'modal is-active' : 'modal'}>
          <div className='modal-background' />
          <div className='modal-card'>
            <header className='modal-card-head'>
              <p className='modal-card-title'>{modal_title}</p>
              <button
                className='delete'
                aria-label='close'
                onClick={this.toggle}
              />
            </header>
            <section className='modal-card-body'>
              {modal_type === 'NLPQL' ? (
                <div className='ReportTextPreview'>{nlpql}</div>
              ) : (
                <ReactJson
                  src={config}
                  displayObjectSize={false}
                  displayDataTypes={false}
                />
              )}
            </section>
            <footer className='modal-card-foot' />
          </div>
        </div>
        <div className={job_modal ? 'modal is-active' : 'modal'}>
          <div className='modal-background' />
          <div className='modal-card'>
            <header className='modal-card-head'>
              <p className='modal-card-title'>{job_modal_title}</p>
              <button
                className='delete'
                aria-label='close'
                onClick={this.jobToggle}
              />
            </header>
            <section className='modal-card-body'>
              {'Are you sure you want to ' +
                job_modal_type.toLowerCase() +
                ' this job?'}
            </section>
            <footer className='modal-card-foot'>
              <button
                className='button is-text'
                onClick={this.takeSeriousAction}
              >
                Continue
              </button>
              <button className='button is-primary' onClick={this.jobToggle}>
                Cancel
              </button>
            </footer>
          </div>
        </div>
        <a className='download-link' ref={this.downloadLink} />
      </div>
    );
  }
}

export default TableJobs;
