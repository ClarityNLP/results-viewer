/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import SubmitButton from '../../UIkit/SubmitButton';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import Axios from 'axios';

const initialState = {
  termExpanderUrl:
    'https://' + window._env_.REACT_APP_API_HOST + '/nlp/nlpql_expander',
  collapse: true,
  termsetName: '',
  termsetTerms: '',
  termsetSynonyms: false,
  termsetPlurals: false,
  termsetVerbInflections: false
};

class TermsetForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  toggle = () => {
    this.setState(prevState => ({
      collapse: !prevState.collapse
    }));
  };

  buildArrayStringWithQuotes = s => {
    const arr = s.split(',');

    let tmp = '[';
    for (let i = 0; i < arr.length; i++) {
      tmp += '"' + arr[i].trim() + '"';
      if (i < arr.length - 1) {
        tmp += ', ';
      }
    }
    tmp += ']';

    return tmp;
  };

  handleInputChange = event => {
    const target = event.target;
    const options = event.target.options;
    let value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    if (options) {
      value = [];
      for (let i = 0, l = options.length; i < l; i++) {
        if (options[i].selected) {
          value.push(options[i].value);
        }
      }

      value = value.toString();
    }

    this.setState({
      [name]: value
    });
  };

  renderTermSetCount() {
    const count = this.props.termSets.length;

    if (count === 0) {
      return null;
    }

    return <span className='tag'>{count}</span>;
  }

  handleSubmit = event => {
    event.preventDefault();

    const {
      termExpanderUrl,
      termsetName,
      termsetTerms,
      termsetSynonyms,
      termsetPlurals,
      termsetVerbInflections
    } = this.state;

    if (termsetSynonyms || termsetPlurals || termsetVerbInflections) {
      let payload = 'termset ' + termsetName + ': [';

      if (termsetSynonyms) {
        payload += 'Clarity.Synonyms("' + termsetTerms + '"),';
      }
      if (termsetPlurals) {
        payload += 'Clarity.Plurals("' + termsetTerms + '"),';
      }
      if (termsetVerbInflections) {
        payload += 'Clarity.VerbInflections("' + termsetTerms + '"),';
      }

      payload = payload.slice(0, payload.length - 1); //removing the last extra ',' character
      payload += '];';

      Axios(termExpanderUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          Authorization: 'Bearer ' + this.props.access_token
        },
        data: payload
      })
        .then(response => {
          const data = response.data.replace(':', ':\n\t');
          const text = data + '\n\n';

          this.props.updateNLPQL(text);
          return text;
        })
        .catch(err => {
          alert('Term Expander Unavailable. Reason: ' + err.message);
        });
    } else {
      let text = 'termset ' + termsetName + ':\n';
      text += '\t' + this.buildArrayStringWithQuotes(termsetTerms) + ';\n\n';

      this.props.updateNLPQL(text);
    }

    this.toggle();
    this.setState(initialState);
  };

  render() {
    const {
      collapse,
      termsetName,
      termsetTerms,
      termsetSynonyms,
      termsetPlurals,
      termsetVerbInflections
    } = this.state;

    return (
      <React.Fragment>
        <header className='card-header' onClick={this.toggle}>
          <p className='card-header-title'>
            Term Set {this.renderTermSetCount()}
          </p>
          <span className='card-header-icon' aria-label='more options'>
            <span className='icon'>
              {collapse ? <FaAngleDown /> : <FaAngleUp />}
            </span>
          </span>
        </header>
        <div className={collapse ? 'card-content hidden' : 'card-content'}>
          <form>
            <div className='field'>
              <label className='label'>Name</label>
              <input
                className='input'
                type='text'
                name='termsetName'
                value={termsetName}
                onChange={this.handleInputChange}
              />
            </div>

            <div className='field'>
              <label className='label'>Terms</label>
              <input
                className='input'
                type='text'
                name='termsetTerms'
                value={termsetTerms}
                onChange={this.handleInputChange}
                placeholder='Separate entries with a comma.'
              />
            </div>

            <div className='field'>
              <label className='checkbox'>
                <input
                  type='checkbox'
                  name='termsetSynonyms'
                  checked={termsetSynonyms}
                  onChange={this.handleInputChange}
                />{' '}
                Synonyms
              </label>
            </div>

            <div className='field'>
              <label className='checkbox'>
                <input
                  type='checkbox'
                  name='termsetPlurals'
                  checked={termsetPlurals}
                  onChange={this.handleInputChange}
                />{' '}
                Plurals
              </label>
            </div>

            <div className='field'>
              <label className='checkbox'>
                <input
                  type='checkbox'
                  name='termsetVerbInflections'
                  checked={termsetVerbInflections}
                  onChange={this.handleInputChange}
                />{' '}
                Verb Inflections
              </label>
            </div>

            <SubmitButton
              handleSubmit={this.handleSubmit}
              label='Add Term Set'
            />
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default TermsetForm;
