import { connect } from 'react-redux'
import ViewerApp from '../components/ViewerApp.jsx'

function mapStateToProps(state) {
  return {
    router: state.router,
    oidc: state.oidc
  };
}

const viewerContainer = connect(mapStateToProps, {})(ViewerApp);

export default viewerContainer;
