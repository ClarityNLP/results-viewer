import { createUserManager } from "redux-oidc";

const userManagerConfig = {
  authority: `${window.location.protocol}//${window._env_.REACT_APP_IDENTITY_PROVIDER_URL}`,
  client_id: "viewer",
  redirect_uri: `${window.location.protocol}//${window.location.hostname}${
    window.location.port ? `:${window.location.port}` : ""
  }/callback.html`,
  response_type: "code",
  scope: "openid profile nlp_api",
  silent_redirect_uri: `${window.location.protocol}//${
    window.location.hostname
  }${window.location.port ? `:${window.location.port}` : ""}/silent_renew.html`,
  automaticSilentRenew: true,
  filterProtocolClaims: true,
  loadUserInfo: true,
  revokeAccessTokenOnSignout: true,
  query_status_response_type: "code"
};

const userManager = createUserManager(userManagerConfig);

export default userManager;
