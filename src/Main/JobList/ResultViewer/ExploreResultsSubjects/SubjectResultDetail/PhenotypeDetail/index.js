import React, { Component } from 'react';
import axios from 'axios';
import EntityFrame from './EntityFrame';
import { FaCheck, FaTimes, FaStickyNote } from 'react-icons/fa';
import Moment from 'react-moment';
import 'moment-timezone';

const suffixes = ['_1', '_2'];

class PhenotypeDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      view_mode: 'all',
      selected_result_index: props.selected_result_index,
      selected_result: props.selected_result,
      results: [],
      successAlert: false,
      failureAlert: false,
      correct_btn: 'button',
      incorrect_btn: 'button'
    };

    this.url = props.url;
    this.detailed_results = {};
    this.user_comments = '';
    // this.successful_export = false;
    // this.failed_export = false;

    this.ids = [];
    if ('_id' in props.selected_result)
      this.ids.push(props.selected_result['_id']);
    if ('_id_1' in props.selected_result)
      this.ids.push(props.selected_result['_id_1']);
    if ('_id_2' in props.selected_result)
      this.ids.push(props.selected_result['_id_2']);
    if ('_id_3' in props.selected_result)
      this.ids.push(props.selected_result['_id_3']);
    this.id_string = this.ids.join();
  }

  // Function to save the comment entered by the user
  saveComments = () => {
    let comment = document.getElementById('feedbackComments').value;
    this.user_comments = comment;
    this.toggle();
  };

  onDismiss = () => {
    this.setState({
      successAlert: false,
      failureAlert: false
    });
  };

  // Function to toggle between success and failure alerts
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

  // Function to write nlpql feedback back to mongoDB
  writeFeedback = option => {
    let data = {};
    data['job_id'] = this.props.job_id;
    data['patient_id'] = this.props.patient_id;
    data['comments'] = this.user_comments;

    if (option === 1) {
      data['is_correct'] = 'true';

      this.setState({
        correct_btn: 'button highlight-green',
        incorrect_btn: 'button'
      });
    } else {
      data['is_correct'] = 'false';

      this.setState({
        incorrect_btn: 'button highlight-red',
        correct_btn: 'button'
      });
    }

    let payload = JSON.stringify(data);
    let request_url = this.url + '/write_nlpql_feedback';

    axios.post(request_url, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.props.accessToken
      }
    });
  };

  resetViewAll = detail_results => {
    if (!detail_results) {
      detail_results = this.detailed_results;
    }

    let { selected_result } = this.state;
    let results = [];

    if ('sentence_1' in selected_result) {
      results = suffixes.map((s, index) => {
        let id = selected_result['_id' + s];
        let detail = {};

        if (id in detail_results['indexes']) {
          let detail_idx = detail_results['indexes'][id];
          detail = detail_results['results'][detail_idx];
        }

        return {
          index: index,
          feature: selected_result['nlpql_feature' + s],
          report_date: selected_result['report_date' + s],
          text: selected_result['sentence' + s],
          id: id,
          detail: detail,
          report_id: selected_result['report_id' + s]
        };
      });
    } else {
      results.push({
        index: 0,
        feature: selected_result['nlpql_feature'],
        report_date: selected_result['report_date'],
        text: selected_result['sentence']
          ? selected_result['sentence']
          : selected_result['text'],
        id: selected_result['_id'],
        detail: selected_result,
        report_id: selected_result['report_id']
      });
    }

    this.setState({
      results: results
    });
  };

  componentDidMount() {
    let get_url = this.url + '/phenotype_results_by_id/' + this.id_string;

    axios
      .get(get_url, {
        headers: { Authorization: 'Bearer ' + this.props.accessToken }
      })
      .then(response => {
        this.detailed_results = response.data;
        this.resetViewAll(response.data);
      });
  }

  componentDidUpdate(prevProps) {
    if (this.props.selected_result_index !== this.state.selected_result_index) {
      this.setState(
        {
          selected_result_index: this.props.selected_result_index,
          selected_result: this.props.selected_result
        },
        this.resetViewAll
      );
    }
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  render() {
    const { correct_btn, incorrect_btn } = this.state;
    let { selected_result, selected_result_index, results } = this.state;

    let results_view = results.map(d => {
      const { detail } = d;
      const { result_display } = detail;

      let date;

      if (result_display.date && result_display.date !== '') {
        date = result_display.date;
      } else {
        date = detail.report_date;
      }

      return (
        <React.Fragment key={d['index']}>
          <div className='column'>
            <h5 className='has-text-weight-semibold'>
              <span>
                <Moment format='DD/MM/YYYY'>{date}</Moment>
              </span>
              <span>
                {' '}
                :{' '}
                {result_display.result_content
                  ? result_display.result_content
                  : null}
              </span>
            </h5>
          </div>
          <EntityFrame
            accessToken={this.props.accessToken}
            data={d}
            url={this.url}
            showPhenotypeTypDetail={this.props.showPhenotypeTypDetail}
            nlpql_feature={selected_result.nlpql_feature}
          />
        </React.Fragment>
      );
    });

    return (
      <React.Fragment>
        {selected_result_index > -1 ? (
          <div className='PhenotypeDetailMain'>
            <div className='columns'>
              <div className='column'>
                <h4 className='has-text-weight-semibold'>
                  {selected_result.nlpql_feature}
                </h4>
                {selected_result.raw_definition_text &&
                selected_result.raw_definition_text.length > 0 ? (
                  <h4>({selected_result.raw_definition_text})</h4>
                ) : null}
              </div>
              <div className='column'>
                <div className='field has-addons has-addons-right'>
                  <div className='control'>
                    <button
                      className={correct_btn}
                      onClick={() => {
                        this.writeFeedback(1);
                      }}
                    >
                      <FaCheck />
                    </button>
                  </div>
                  <div className='control'>
                    <button
                      className={incorrect_btn}
                      onClick={() => {
                        this.writeFeedback(2);
                      }}
                    >
                      <FaTimes />
                    </button>
                  </div>
                  <div className='control'>
                    <button
                      className='button'
                      onClick={() => {
                        this.toggle();
                      }}
                    >
                      <FaStickyNote />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {results_view}
            {this.state.successAlert === true ? (
              <div className='notification is-success'>
                <button className='delete' onClick={this.onDismiss} />
                Thank you for submitting feedback.
              </div>
            ) : null}
            {this.state.failureAlert === true ? (
              <div className='notification is-danger'>
                <button className='delete' onClick={this.onDismiss} />
                Oops! We ran into an issue while submitting feedback. Please try
                again later.
              </div>
            ) : null}
          </div>
        ) : null}

        <div id='commentsModal'>
          <div className={this.state.modal ? 'modal is-active' : 'modal'}>
            <div className='modal-background' />
            <div className='modal-card'>
              <header className='modal-card-head'>
                <p className='modal-card-title'>Enter Comment</p>
                <button
                  className='delete'
                  aria-label='close'
                  onClick={this.toggle}
                />
              </header>
              <section className='modal-card-body'>
                <input
                  className='input'
                  type='textarea'
                  name='comments'
                  id='feedbackComments'
                  defaultValue={this.user_comments}
                />
              </section>
              <footer className='modal-card-foot'>
                <div className='column is-5 is-offset-7'>
                  <button
                    className='button is-primary'
                    onClick={this.saveComments}
                  >
                    Save Comment
                  </button>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default PhenotypeDetail;
