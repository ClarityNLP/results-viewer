import React from 'react';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';
import ViewerApp from '../containers/viewer_container';
import { ConnectedRouter } from 'connected-react-router';
import userManager from '../utils/userManager';
import { OidcProvider } from 'redux-oidc';

const Root = ({ store, history }) => (
  <Provider store={store}>
    <OidcProvider store={store} userManager={userManager}>
      <ConnectedRouter history={history}>
          <Route path='/' component={ViewerApp} />
      </ConnectedRouter>
    </OidcProvider>
  </Provider>
);

export default Root;
