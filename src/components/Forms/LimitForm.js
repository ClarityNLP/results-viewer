/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';

const initialState = { limit: '' };

class LimitForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = initialState;
  }

  componentDidMount() {
    const htmlClasses = document.getElementsByTagName('html')[0].classList;

    htmlClasses.add('is-clipped');
  }

  componentWillUnmount() {
    const htmlClasses = document.getElementsByTagName('html')[0].classList;

    htmlClasses.remove('is-clipped');
  }

  handleInputChange = event => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  };

  handleSubmit = event => {
    event.preventDefault();

    const { limit } = this.state;

    if (limit.trim() !== '') {
      const text = '\n\nlimit ' + limit + ';';

      this.props.updateNLPQL(text).then(() => {
        this.props.handleSubmit();
      });
    } else {
      this.props.handleSubmit();
    }

    this.props.toggle();
    this.setState(initialState);
  };

  render() {
    const { toggle } = this.props;
    const { limit } = this.state;

    return (
      <React.Fragment>
        <div className='modal is-active'>
          <div className='modal-background' />
          <div className='modal-card'>
            <header className='modal-card-head'>
              <p className='modal-card-title'>
                Limit Results
                <span className='optional-text'> - Optional</span>
              </p>
              <button className='delete' aria-label='close' onClick={toggle} />
            </header>
            <section className='modal-card-body'>
              <form>
                <div className='field'>
                  <label className='label'>Number of Results</label>
                  <input
                    className='input'
                    type='number'
                    name='limit'
                    value={limit}
                    onChange={this.handleInputChange}
                  />
                </div>
              </form>
            </section>
            <footer className='modal-card-foot level cloumns'>
              <div className='column is-4'>
                <button
                  className='button is-large is-primary'
                  onClick={this.handleSubmit}
                >
                  Run
                </button>
              </div>
            </footer>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default LimitForm;
