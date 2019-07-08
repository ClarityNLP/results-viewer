import React, { Component } from 'react';
import axios from 'axios';
import uuid from 'uuid';
import ResultData from './ResultData';

const ALL = 4;

class RawResultsView extends Component {
  constructor(props) {
    super(props);

    let final_results = props.mode === ALL;
    let job_id = props.job.nlp_job_id;
    let get_url =
      props.url + '/phenotype_paged_results/' + job_id + '/' + final_results;

    this.state = {
      ResultData: new ResultData(
        this.updateData,
        props.job,
        get_url,
        props.accessToken
      ),
      end: 0,
      mode: props.mode,
      modal: false,
      successAlert: false,
      failureAlert: false,
      alertMessage: '',
      exportApiHealth: false
    };

    this.checkExportApiHealth();
  }

  componentDidUpdate(prevProps) {
    const { mode, job, url, accessToken } = this.props;

    if (prevProps.mode !== mode) {
      let final_results = mode === ALL;
      let job_id = job.nlp_job_id;
      let get_url =
        url + '/phenotype_paged_results/' + job_id + '/' + final_results;

      this.setState({
        ResultData: new ResultData(this.updateData, job, get_url, accessToken),
        mode: mode
      });
    }
  }

  componentWillUnmount() {
    this.setState({
      successAlert: false,
      failureAlert: true
    });
  }

  toggle = () => {
    this.setState(state => ({
      modal: !state.modal
    }));
  };

  checkExportApiHealth = () => {
    const { accessToken } = this.props;

    axios
      .get(`https://${window._env_.REACT_APP_API_HOST}/nlp/export_ohdsi`, {
        headers: { Authorization: 'Bearer ' + accessToken }
      })
      .then(response => {
        this.setState({
          exportApiHealth: true
        });
      })
      .catch(error => {
        this.setState({
          exportApiHealth: false
        });
      });
  };

  updateData = end => {
    this.setState({
      end: end
    });
  };

  toggleAlert = response => {
    if (response === true) {
      this.setState({
        successAlert: true,
        failureAlert: false
      });
    } else {
      this.setState({
        successAlert: false,
        failureAlert: true
      });
    }
  };

  openExportModal = () => {
    this.toggle();
    this.setState({
      successAlert: false,
      failureAlert: false
    });
  };

  // Function to export intermediate results to OMOP database
  exportToOMOP = () => {
    const { job, accessToken } = this.props;

    let data = JSON.stringify({
      job_id: job.nlp_job_id,
      result_name: document.getElementById('omopResultName').value,
      omop_domain: document.getElementById('omopDomain').value,
      concept_id: document.getElementById('omopConceptId').value
    });

    axios
      .post(
        `https://${window._env_.REACT_APP_API_HOST}/nlp/export_ohdsi`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + accessToken
          }
        }
      )
      .then(response => {
        let data = response;
        let message = data['data'];
        this.toggleAlert(true);
        this.setState({
          alertMessage: message
        });
      })
      .catch(error => {
        let data = error.response;
        let message = data['data'];
        this.toggleAlert(false);
        this.setState({
          alertMessage: message
        });
      });
  };

  getHeadings = () => {
    const { ResultData } = this.state;
    let tmp = [];
    const result = ResultData._dataList[0];

    for (let prop in result) {
      if (result.hasOwnProperty(prop)) {
        tmp.push(<th key={uuid.v4()}>{prop}</th>);
      }
    }

    return <tr key={uuid.v4()}>{tmp}</tr>;
  };

  createListFromObject = object => {
    if (!object) return;
    let list = [];

    for (let param in object) {
      console.log(param);

      list.push(
        <li>
          <span>
            {param} : {object[param]}
          </span>
        </li>
      );
    }

    return list;
  };

  getRows = () => {
    const { ResultData } = this.state;

    return ResultData._dataList.map(result => {
      let tmp = [];

      for (let prop in result) {
        if (result.hasOwnProperty(prop)) {
          if (typeof result[prop] === 'object') {
            tmp.push(
              <td key={uuid.v4()}>
                <ul>{this.createListFromObject(result[prop])}</ul>
              </td>
            );
          } else {
            tmp.push(<td key={uuid.v4()}>{result[prop]}</td>);
          }
        }
      }

      return <tr key={uuid.v4()}>{tmp}</tr>;
    });
  };

  render() {
    const {
      ResultData,
      exportApiHealth,
      modal,
      alertMessage,
      successAlert,
      failureAlert,
      report_text
    } = this.state;
    const { job } = this.props;

    // iterating over the results to get the unique nlpql_feature names
    let result_names = [];

    ResultData._dataList.forEach(function(resultData) {
      result_names.push(resultData.nlpql_feature);
    });

    return (
      <React.Fragment>
        {ResultData.getSize() > 0 ? (
          <div className='RawResultsTable column is-full'>
            <table className='table is-striped is-bordered'>
              <thead>{this.getHeadings()}</thead>
              <tbody>{this.getRows()}</tbody>
            </table>

            {exportApiHealth === true ? (
              <div className='exportButton'>
                <button
                  className='button is-priamry is-large'
                  onClick={this.openExportModal}
                >
                  Export Results
                </button>
              </div>
            ) : null}

            <div id='exportResultModal'>
              <div className={modal ? 'modal is-active' : 'modal'}>
                <div className='modal-background' />
                <div className='modal-card'>
                  <header className='modal-card-head'>
                    <p className='modal-card-title'>
                      Export Results - Job ID: {job.nlp_job_id}
                    </p>
                    <button
                      className='delete'
                      aria-label='close'
                      onClick={this.toggle}
                    />
                  </header>
                  <section className='modal-card-body'>
                    <form>
                      {successAlert === true ? (
                        <div class='notification is-success'>
                          {alertMessage}
                        </div>
                      ) : null}
                      {failureAlert === true ? (
                        <div class='notification is-danger'>{alertMessage}</div>
                      ) : null}
                      <div className='field'>
                        <label className='label' htmlFor='resultName'>
                          Result Name
                        </label>
                        <select
                          className='input'
                          name='resultName'
                          id='omopResultName'
                        >
                          {result_names.map((item, index) => {
                            return <option key={'item' + index}>{item}</option>;
                          })}
                        </select>
                      </div>
                      <div className='field'>
                        <label className='label' htmlFor='conceptId'>
                          Concept ID
                        </label>
                        <input
                          className='input'
                          type='text'
                          name='conceptId'
                          id='omopConceptId'
                          placeholder='Enter Concept ID'
                        />
                      </div>
                      <div className='field'>
                        <label className='label' htmlFor='domain'>
                          OMOP Domain
                        </label>
                        <select className='input' name='domain' id='omopDomain'>
                          <option>Observation</option>
                          <option>Condition</option>
                          <option>Measurement</option>
                        </select>
                      </div>
                      <pre>{report_text}</pre>
                    </form>
                  </section>
                  <footer className='modal-card-foot'>
                    <div className='column is-5 is-offset-7'>
                      <button
                        className='button is-primary'
                        onClick={this.exportToOMOP}
                      >
                        Export
                      </button>
                    </div>
                  </footer>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>No results present.</p>
        )}
      </React.Fragment>
    );
  }
}

export default RawResultsView;
