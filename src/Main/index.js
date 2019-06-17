import { connect } from 'react-redux';
import Main from './Main.jsx';

function mapStateToProps(state) {
  return {
    router: state.router,
    oidc: state.oidc
  };
}

const MainContainer = connect(
  mapStateToProps,
  {}
)(Main);

export default MainContainer;
