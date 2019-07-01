import React, { Component } from 'react';
import ReactJson from 'react-json-view';
import axios from 'axios';
import JobItem from './JobItem';

export default class TableJobs extends Component {
  constructor(props) {
    super(props);
    this.downloadLink = React.createRef();

    if (props.filter !== '') {
      props.getFilter(props.filter);
    }

    this.state = {
      limit: 20,
      page: 1,
      jobs: props.jobs,
      stats: {},
      performance: {},
      modal: false,
      modal_title: 'View NLPQL',
      modal_type: 'NLPQL',
      nlpql: '',
      config: {},
      job_modal: false,
      job_modal_title: 'Kill Job',
      job_modal_type: 'KILL',
      job_id: '-1',
      job_danger_status: '',
      can_continue_action: true,
      filter: props.filter
    };
  }

  componentDidMount() {
    const { filter } = this.state;
    this.setJobs();

    if (filter !== '') {
      document.getElementById('jobs_filter').value = filter;
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.jobs !== prevProps.jobs) {
      this.setJobs();
    }

    if (this.props.filter !== this.state.filter) {
      this.setState({
        filter: this.props.filter
      });
    }
  }

  toggle = () => {
    this.setState(state => ({
      modal: !state.modal
    }));
  };

  jobToggle = () => {
    this.setState(state => ({
      job_modal: !state.job_modal
    }));
  };

  showJSON = (job, event) => {
    this.setState({
      modal: true,
      config: JSON.parse(job.config),
      modal_title: 'JSON: ',
      modal_type: 'JSON',
      nlpql: ''
    });
  };

  showNLPQL = (job, event) => {
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
    const { url, accessToken, refreshJobs } = this.props;
    let action_url = url + '/delete_job/' + job_id;

    this.setState({
      can_continue_action: false
    });

    if (job_modal_type === 'KILL') {
      action_url = url + '/kill_job/' + job_id;
    }

    axios
      .get(action_url, {
        headers: { Authorization: 'Bearer ' + accessToken }
      })
      .then(response => {
        this.setState({
          job_danger_status: response.data,
          job_id: -1
        });
        refreshJobs();
        setTimeout(() => {
          this.setState({
            job_modal: false,
            can_continue_action: true
          });
        }, 100);
      });
  };

  getJobStats = IDs => {
    const { url, accessToken } = this.props;
    const stats_url = url + `/stats/${IDs}`;

    axios
      .get(stats_url, {
        headers: { Authorization: 'Bearer ' + accessToken }
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
    const { url, accessToken } = this.props;
    const performance_url = url + `/performance/${IDs}`;

    axios
      .get(performance_url, {
        headers: { Authorization: 'Bearer ' + accessToken }
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

  setJobs = () => {
    const { jobs } = this.props;
    const { limit, page } = this.state;
    const start = (page - 1) * limit;
    const limitedJobs = jobs.slice(start, start + limit);

    this.setState(
      {
        jobs: limitedJobs
      },
      () => {
        const IDs = limitedJobs.map(job => {
          return job.nlp_job_id;
        });

        this.getJobPerformance(IDs);
        this.getJobStats(IDs);
      }
    );
  };

  nextPage = () => {
    const { jobs } = this.props;
    const { limit, page } = this.state;
    const last_page = Math.ceil(jobs.length / limit);
    const next = page + 1;

    if (next > last_page) {
      return;
    }

    this.setState(
      state => ({
        page: state.page + 1
      }),
      this.setJobs
    );
  };

  prevPage = () => {
    const { page } = this.state;
    const prev = page - 1;

    if (prev < 1) {
      return;
    }

    this.setState(
      state => ({
        page: state.page - 1
      }),
      this.setJobs
    );
  };

  render() {
    const {
      stats,
      performance,
      page,
      limit,
      jobs,
      modal,
      modal_title,
      modal_type,
      nlpql,
      config,
      job_modal,
      job_modal_title,
      job_modal_type
    } = this.state;
    const { url, luigi } = this.props;

    const header_items = [
      'Name',
      'Date',
      'Status',
      'N',
      'Accuracy',
      'Download CSV',
      'Actions'
    ].map(h => {
      return <th key={h}>{h}</th>;
    });

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
        <nav className='pagination'>
          <a className='pagination-previous' onClick={this.prevPage}>
            Previous
          </a>
          <a className='pagination-next' onClick={this.nextPage}>
            Next page
          </a>
          <ul className='pagination-list'>
            <li>
              <span className='pagination-ellipsis'>{page}</span>
            </li>
            <li>
              <span className='pagination-ellipsis'>of</span>
            </li>
            <li>
              <span className='pagination-ellipsis'>
                {Math.ceil(this.props.jobs.length / limit)}
              </span>
            </li>
          </ul>
        </nav>
        <table className='JobTable table is-striped'>
          <thead>
            <tr>{header_items}</tr>
          </thead>
          <tbody>
            {jobs.map((job, index) => {
              return (
                <JobItem
                  key={'job' + index}
                  luigi={luigi}
                  selectJob={this.props.selectJob}
                  showNLPQL={this.showNLPQL}
                  showJSON={this.showJSON}
                  killJob={this.killJob}
                  deleteJob={this.deleteJob}
                  job={job}
                  url={url}
                  stats={stats}
                  performance={performance}
                  downloadLink={this.downloadLink}
                />
              );
            })}
          </tbody>
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
