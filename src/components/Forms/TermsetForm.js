/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import Select from 'react-select';
import SubmitButton from '../../UIkit/SubmitButton';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import Axios from 'axios';

const initialState = {
  termExpanderUrl:
    'https://' + window._env_.REACT_APP_API_HOST + '/nlp/nlpql_expander',
  collapse: true,
  termSet: null,
  termsetName: '',
  termsetTerms: '',
  termsetSynonyms: false,
  termsetPlurals: false,
  termsetVerbInflections: false,
  replaceText: null
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

  handleTermSetChange = value => {
    let tmp_name = '';
    let tmp_terms = '';

    if (value) {
      const tmp_termSet = value.value;

      tmp_name = tmp_termSet.name;
      tmp_terms = tmp_termSet.values;
    }

    this.setState(
      {
        termSet: value,
        termsetName: tmp_name,
        termsetTerms: tmp_terms.toString()
      },
      () => {
        this.setState({
          replaceText: this.getSubmittableText()
        });
      }
    );
  };

  handleInputChange = event => {
    const target = event.target;
    let value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  };

  getExpandedTermSet = () => {
    const {
      termExpanderUrl,
      termsetName,
      termsetTerms,
      termsetSynonyms,
      termsetPlurals,
      termsetVerbInflections
    } = this.state;

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

    return Axios(termExpanderUrl, {
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

        return text;
      })
      .catch(err => {
        alert('Term Expander Unavailable. Reason: ' + err.message);
      });
  };

  getSubmittableText = () => {
    const {
      termsetName,
      termsetTerms,
      termsetSynonyms,
      termsetPlurals,
      termsetVerbInflections
    } = this.state;

    let text = null;

    if (termsetSynonyms || termsetPlurals || termsetVerbInflections) {
      text = this.getExpandedTermSet().then(text => {
        return text;
      });
    } else {
      text =
        'termset ' +
        termsetName +
        ':\n\t' +
        this.buildArrayStringWithQuotes(termsetTerms) +
        ';\n\n';
    }

    return text;
  };

  handleSubmit = event => {
    event.preventDefault();

    const { replaceText } = this.state;
    const submitText = this.getSubmittableText();

    if (typeof submitText !== 'string') {
      submitText.then(text => {
        this.props.updateNLPQL(text, replaceText);
      });
    } else {
      this.props.updateNLPQL(submitText, replaceText);
    }

    this.toggle();
    this.setState(initialState);
  };

  render() {
    const { termSets } = this.props;
    const {
      collapse,
      termSet,
      termsetName,
      termsetTerms,
      termsetSynonyms,
      termsetPlurals,
      termsetVerbInflections
    } = this.state;

    const count = termSets.length;

    return (
      <React.Fragment>
        <header className='card-header' onClick={this.toggle}>
          <p className='card-header-title'>
            Term Set {count > 0 ? <span className='tag'>{count}</span> : null}
          </p>
          <span className='card-header-icon' aria-label='more options'>
            <span className='icon'>
              {collapse ? <FaAngleDown /> : <FaAngleUp />}
            </span>
          </span>
        </header>
        <div className={collapse ? 'card-content hidden' : 'card-content'}>
          {count > 0 ? (
            <div className='field'>
              <Select
                isClearable={true}
                value={termSet}
                onChange={this.handleTermSetChange}
                options={termSets.map(termset => {
                  return { value: termset, label: termset.name };
                })}
              />
            </div>
          ) : null}

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
