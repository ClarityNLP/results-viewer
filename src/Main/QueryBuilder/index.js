import { connect } from 'react-redux';
import { setNLPQL } from '../../redux/actions/set-nlpql';
import { setNLPQLJSON } from '../../redux/actions/set-nlpql-json';
import { postToClarityAPI } from '../../redux/actions/post-clarity-api';
import { saveNLPQL } from '../../redux/actions/save-nlpql';
import QueryBuilder from './QueryBuilder';

function mapStateToProps(state) {
  return {
    runner: state.runner,
    oidc: state.oidc
  };
}

const QueryBuilderContainer = connect(
  mapStateToProps,
  { postToClarityAPI, setNLPQL, setNLPQLJSON, saveNLPQL }
)(QueryBuilder);

export default QueryBuilderContainer;
