/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import Select from 'react-select';
import SubmitButton from '../../UIkit/SubmitButton';
import algorithmParameters from './algorithms';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

const initialState = {
  collapse: true,
  algorithm: '',
  name: '',
  feature: '',
  subField: '',
  isFinal: true,
  logic: ''
};
class DefineResultForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  toggle = () => {
    this.setState(prevState => ({
      collapse: !prevState.collapse
    }));
  };

  addFeatureToLogic = e => {
    // e.stopPropagation();
    e.preventDefault();
    const { feature, subField } = this.state;
    let text = feature.value;

    if (subField.value) {
      text += '.' + subField.value;
    }

    this.setState(prevState => ({
      logic: prevState.logic + text
    }));
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

  handleSubFieldChange = value => {
    this.setState({
      subField: value
    });
  };

  handleFeatureInputChange = value => {
    const { features } = this.props;

    let algorithm = '';

    for (let i = 0; i < features.length; i++) {
      if (features[i].name === value.value) {
        algorithm = features[i].algorithm;
      }
    }

    this.setState({
      algorithm: algorithm,
      feature: value
    });
  };

  getSubFields = () => {
    const { algorithm } = this.state;

    return algorithmParameters[algorithm].map(value => {
      return {
        value: value,
        label: value
      };
    });
  };

  getFeatureOptions = () => {
    const { features } = this.props;

    return features.map(value => {
      return {
        value: value.name,
        label: value.name
      };
    });
  };

  renderSubFieldSelect = () => {
    const { algorithm, subField } = this.state;

    if (algorithm !== '') {
      return (
        <Select
          value={subField}
          onChange={this.handleSubFieldChange}
          options={this.getSubFields()}
        />
      );
    }

    return null;
  };

  handleSubmit = event => {
    event.preventDefault();

    const { name, logic, isFinal } = this.state;

    const { logicalContext } = this.state;

    let text = 'context ' + logicalContext + ';\n\n define ';

    if (isFinal) {
      text += 'final ';
    }

    text += name + ':\n\twhere ' + logic;

    text += ';\n\n';

    this.props.updateNLPQL(text);
    this.toggle();
    this.setState(initialState);
  };

  render() {
    const { collapse, name, feature, logic, isFinal } = this.state;

    return (
      <React.Fragment>
        <header className='card-header' onClick={this.toggle}>
          <p className='card-header-title'>Result</p>
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
                name='name'
                value={name}
                onChange={this.handleInputChange}
              />
            </div>

            <div className='field'>
              <label className='label'>Feature</label>
              <div className='columns'>
                <div className='column is-5'>
                  <Select
                    value={feature}
                    onChange={this.handleFeatureInputChange}
                    options={this.getFeatureOptions()}
                  />
                </div>
                <div className='column is-5'>{this.renderSubFieldSelect()}</div>
                <div className='column is-2'>
                  <button
                    type='button'
                    className='button is-primary'
                    onClick={this.addFeatureToLogic}
                  >
                    +
                  </button>
                </div>
              </div>
              <div>
                <label className='label'>Logic</label>
                <input
                  className='input'
                  type='text'
                  name='logic'
                  value={logic}
                  onChange={this.handleInputChange}
                />
              </div>
            </div>

            <div className='field'>
              <label className='checkbox'>
                <input
                  type='checkbox'
                  name='isFinal'
                  checked={isFinal}
                  onChange={this.handleInputChange}
                />{' '}
                Include in Final Results
              </label>
            </div>

            <SubmitButton handleSubmit={this.handleSubmit} label='Add Result' />
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default DefineResultForm;
