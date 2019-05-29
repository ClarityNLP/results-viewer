import React, { Component } from 'react';
import axios from 'axios';
import Moment from 'react-moment';
import 'moment-timezone';

const getHtmlMatch = (text, start, end) => {
  if (start === 0 && end === 0) {
    return text;
  }
  return text.substr(start, end - start);
};

const getHtmlMarkup = (text, start, end) => {
  if (start === 0 && end === 0) {
    return text;
  }
  const keyword = getHtmlMatch(text, start, end);
  const first = text.substr(0, start);
  const last = text.substr(end, text.length - first.length - keyword.length);

  return (
    <p>
      {first}
      <span className='full-highlighting'>{keyword}</span>
      {last}
    </p>
  );
};

class EntityFrame extends Component {
  constructor(props) {
    super(props);

    this.showDocument = this.showDocument.bind(this);
    this.toggle = this.toggle.bind(this);

    this.url = props.url;

    this.state = {
      report_modal: false,
      report_text: null,
      report_id: ''
    };
  }

  toggle() {
    this.setState({
      report_modal: !this.state.report_modal
    });
  }

  showDocument(data) {
    const get_url = this.url + '/document/' + data['report_id'];

    axios
      .get(get_url, {
        headers: { Authorization: 'Bearer ' + this.props.accessToken }
      })
      .then(response => {
        this.setState({
          report_text: response.data.report_text,
          report_modal: !this.state.report_modal,
          report_id: data['report_id']
        });
      });
  }

  render() {
    const { data } = this.props;
    const detail = data['detail'];
    const start = detail['start'] || 0;
    const end = detail['end'] || 0;
    const text = data['text'];
    const feature = data['pipeline_type'];

    const html = getHtmlMarkup(text, start, end);

    return (
      <div key={data['id']} className='EntityFrame'>
        <div onClick={() => this.showDocument(data)}>
          <div>
            <p>
              {this.props.nlpql_feature === data['feature'] ? null : (
                <span
                  onClick={() =>
                    this.props.showPhenotypeTypDetail(data['feature'])
                  }
                >
                  {data['feature']}
                </span>
              )}

              <span className='is-size-7 has-text-weight-bold'>
                <Moment format='MMM D, YYYY h:mm a'>
                  {data['report_date'] !== ''
                    ? data['report_date']
                    : detail.result_display.date}
                </Moment>
              </span>
            </p>
          </div>
          <div className='EntitySpacer'>&nbsp;</div>
          {feature !== 'CQLExecutionTask'
            ? html
            : detail.result_display.result_content}
        </div>
        <div className={this.state.report_modal ? 'modal is-active' : 'modal'}>
          <div className='modal-background' />
          <div className='modal-card'>
            <header className='modal-card-head'>
              <p className='modal-card-title'>
                {'Report #' + this.state.report_id}
              </p>
              <button
                className='delete'
                aria-label='close'
                onClick={this.toggle}
              />
            </header>
            <section className='modal-card-body'>
              <pre>{this.state.report_text}</pre>
            </section>
            <footer className='modal-card-foot' />
          </div>
        </div>
      </div>
    );
  }
}

export default EntityFrame;
