import React, { Component } from 'react';
import axios from 'axios';

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

  replacer = index => {
    return index + ':REPLACETEXT';
  };

  getHighlightedText(text, highlights) {
    if (!highlights) return text;

    if (!text) return '';

    if (text === '' || highlights.length < 1) return text;

    console.log('HIGHLIGHTS:', highlights);

    let s = text;
    let foundText = /[0-9]:REPLACETEXT/g;

    for (let h in highlights) {
      let highlight = highlights[h].toString().replace(/[^\w\s]/gi, '');
      if (highlight.trim() === '') break;

      try {
        highlight = new RegExp(highlight, 'g');
      } catch (e) {
        console.log('Error:', e);
      }

      s = s.replace(highlight, this.replacer(h));
    }

    const splitText = s.split(foundText);
    const matches = s.match(foundText);

    const highlightedText = splitText.reduce(
      (arr, element, index) =>
        matches[index]
          ? [
              ...arr,
              element,
              <span key={'highlight' + index} className='full-highlighting'>
                {highlights[parseInt(matches[index], 10)]}
              </span>
            ]
          : [...arr, element],
      []
    );

    return highlightedText;
  }

  render() {
    const { report_text } = this.state;
    const { data } = this.props;
    const detail = data['detail'];
    const { highlights, sentence } = detail.result_display;

    return (
      <div key={data['id']} className='EntityFrame'>
        <div onClick={() => this.showDocument(data)}>
          <div className='mb-10'>
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
            </p>
          </div>
          {sentence ? (
            <div className='mb-10'>
              <p>{this.getHighlightedText(sentence, highlights)}</p>
            </div>
          ) : null}
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
              <pre>
                {report_text
                  ? this.getHighlightedText(report_text, highlights)
                  : null}
              </pre>
            </section>
            <footer className='modal-card-foot' />
          </div>
        </div>
      </div>
    );
  }
}

export default EntityFrame;