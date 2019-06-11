import { connect } from 'react-redux';
import NavbarTop from './NavbarTop';
import { push } from 'connected-react-router';

function mapStateToProps(state) {
  return {
    router: state.router,
    oidc: state.oidc
  };
}

const navbarTopContainer = connect(
  mapStateToProps,
  {
    push
  }
)(NavbarTop);

export default navbarTopContainer;
