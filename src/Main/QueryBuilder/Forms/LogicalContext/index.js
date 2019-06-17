/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import Select from 'react-select';
import SubmitButton from '../SubmitButton';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

const initialState = {
  collapse: true,
  logicalContext: { value: 'Patient', label: 'Patient' }
};

class LogicalContextForm extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = initialState;
  }

  toggle = () => {
    this.setState(prevState => ({
      collapse: !prevState.collapse
    }));
  };

  handleInputChange(value) {
    this.setState({
      logicalContext: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    const { logicalContext } = this.state;

    if (logicalContext.value) {
      const text = 'context ' + logicalContext.value + ';\n\n';
      this.props.updateNLPQL(text);
    }

    this.toggle();
    this.setState(initialState);
  }

  render() {
    const { collapse, logicalContext } = this.state;

    return (
      <React.Fragment>
        <header className='card-header' onClick={this.toggle}>
          <p className='card-header-title'>Logical Context</p>
          <span className='card-header-icon' aria-label='more options'>
            <span className='icon'>
              {collapse ? <FaAngleDown /> : <FaAngleUp />}
            </span>
          </span>
        </header>
        <div className={collapse ? 'card-content hidden' : 'card-content'}>
          <form>
            <div className='field'>
              <label className='label'>Logical Context</label>
              <Select
                value={logicalContext}
                onChange={this.handleInputChange}
                options={[
                  {
                    value: 'Patient',
                    label: 'Patient'
                  },
                  {
                    value: 'Document',
                    label: 'Document'
                  }
                ]}
              />
            </div>

            <SubmitButton
              handleSubmit={this.handleSubmit}
              label='Add Logical Context'
            />
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default LogicalContextForm;
