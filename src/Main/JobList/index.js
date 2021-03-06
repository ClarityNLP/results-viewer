import { connect } from 'react-redux';
import JobList from './JobList';

function mapStateToProps(state) {
  return {
    router: state.router,
    oidc: state.oidc
  };
}

const jobListContainer = connect(
  mapStateToProps,
  {}
)(JobList);

export default jobListContainer;
