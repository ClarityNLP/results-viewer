import React, { Component } from 'react';
import PhenotypeDetail from './PhenotypeDetail';
import axios from 'axios';

const placeholder = null;

class SubjectResultDetail extends Component {
  constructor(props) {
    super(props);

    this.showPhenotype = this.showPhenotype.bind(this);
    this.isActivePhenotype = this.isActivePhenotype.bind(this);
    this.getChildButtons = this.getChildButtons.bind(this);
    this.showPhenotypeTypDetail = this.showPhenotypeTypDetail.bind(this);

    this.state = {
      subject: props.subject,
      results: props.results,
      orig_results: props.results,
      loading: false,
      config: props.config,
      idx: props.idx,
      total: props.total,
      selected_result: {},
      selected_result_index: -1,
      phenotype_id: props.phenotype_id,
      job: props.job,
      job_id: props.job.nlp_job_id,
      finals: [],
      ops: {},
      entities: {}
    };
  }

  componentDidMount() {
    let get_url =
      this.props.url + '/phenotype_structure/' + this.state.phenotype_id;

    axios
      .get(get_url, {
        headers: { Authorization: 'Bearer ' + this.props.accessToken }
      })
      .then(response => {
        this.setState({
          finals: response.data['finals'],
          ops: response.data['operations'],
          entities: response.data['data_entities']
        });
      });
  }

  componentDidUpdate(prevProps) {
    // console.log(this.props)
    if (prevProps.idx !== this.props.idx) {
      this.setState({
        subject: this.props.subject,
        results: this.props.results,
        config: this.props.config,
        idx: this.props.idx,
        total: this.props.total,
        phenotype_id: this.props.phenotype_id
      });
      if (this.props.results.length > 0) {
        this.setState({
          selected_result: this.props.results[0],
          selected_result_index: 0
        });
      }
    }
  }

  showPhenotype(data, index, e) {
    // console.log(data);
    this.setState({
      selected_result: data,
      selected_result_index: index,
      results: this.state.orig_results
    });
  }

  showPhenotypeTypDetail(name) {
    if (this.state.loading) {
      console.log('wait a minute for loading');
      return;
    }
    this.setState(
      {
        loading: true,
        results: []
      },
      () => {
        let get_url =
          this.props.url +
          '/phenotype_feature_results/' +
          this.state.job_id +
          '/' +
          name +
          '/' +
          this.state.subject.subject;

        axios
          .get(get_url, {
            headers: { Authorization: 'Bearer ' + this.props.accessToken }
          })
          .then(response => {
            this.setState({
              results: response.data,
              loading: false
            });
          });
      }
    );
  }

  isActivePhenotype(index) {
    let className = 'PhenotypeDetailButtons ';

    if (index === this.state.selected_result_index) {
      className += ' active';
    }

    return className;
  }

  getChildButtons(step, index, current_level, current_label) {
    if (!('data_entities' in step)) {
      return placeholder;
    }

    let new_level = current_level + 1;

    return step['data_entities'].map((d, d_index) => {
      let new_label = current_label + '.' + d_index;
      let obj = {};
      if (d in this.state.entities) {
        obj = this.state.entities[d];
      } else {
        obj = this.state.ops[d];
      }
      let child_entities = placeholder;
      if (obj) {
        if ('data_entities' in obj) {
          child_entities = this.getChildButtons(
            obj,
            d_index,
            new_level,
            new_label
          );
        }
        let name = obj ? obj['name'] : d;

        return (
          <div key={name}>
            <button
              className='PhenotypeDetailButtons button'
              onClick={e => this.showPhenotypeTypDetail(name)}
            >
              <span className='PhenotypeSubDetailButtons'>{name}</span>
            </button>
            {child_entities}
          </div>
        );
      } else {
        return null;
      }
    });
  }

  render() {
    let { subject, results, config, total, finals } = this.state;

    let results_nav_view = null;

    if (finals) {
      results_nav_view = finals.map((d, index) => {
        let current_label = index + 1;

        return (
          <div key={index}>
            <button
              onClick={e => this.showPhenotype(d, index, e)}
              className='PhenotypeDetailButtons button'
            >
              {d['name']}
            </button>
            {this.getChildButtons(d, index, 0, current_label)}
          </div>
        );
      });
    }

    let results_type = typeof results;

    if (results_type === 'string') {
      results = JSON.parse(results);
    }

    let phenotype_results_detail = results.map((r, index) => {
      return (
        <PhenotypeDetail
          accessToken={this.props.accessToken}
          url={this.props.url}
          key={r._id}
          selected_result={r}
          selected_result_index={index}
          config={config}
          patient_id={subject._id}
          job_id={this.state.job_id}
          showPhenotypeTypDetail={this.showPhenotypeTypDetail}
        />
      );
    });

    return (
      <React.Fragment>
        <div className='columns'>
          <div className='column'>
            <h5 className='is-size-4'>Patient #{subject._id}</h5>
          </div>
        </div>
        <div className='columns'>
          <div className='column is-full'>
            <nav className='pagination' aria-label='pagination'>
              <a
                className='pagination-previous'
                onClick={e => this.props.navigateSubject(-1, e)}
              >
                Previous
              </a>
              <a
                className='pagination-next'
                onClick={e => this.props.navigateSubject(1, e)}
              >
                Next page
              </a>
              <ul className='pagination-list'>
                <li>
                  <span className='pagination-ellipsis'>
                    {subject.index + 1}
                  </span>
                </li>
                <li>
                  <span className='pagination-ellipsis'>of</span>
                </li>
                <li>
                  <span className='pagination-ellipsis'>{total}</span>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <div className='columns'>
          <div className='column is-2'>{results_nav_view}</div>
          <div className='column'>{phenotype_results_detail}</div>
        </div>
      </React.Fragment>
    );
  }
}

export default SubjectResultDetail;
