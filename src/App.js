import React from "react";
import { Provider } from "react-redux";
import userManager from "./utils/userManager";
import { OidcProvider } from "redux-oidc";
import { Route } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";

import ViewerApp from "./containers/viewer_container";

const App = ({ store, history }) => (
  <Provider store={store}>
    <OidcProvider store={store} userManager={userManager}>
      <ConnectedRouter history={history}>
        <Route path="/" component={ViewerApp} />
      </ConnectedRouter>
    </OidcProvider>
  </Provider>
);

export default App;
