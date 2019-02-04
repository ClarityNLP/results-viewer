import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router'
import { reducer as oidcReducer } from 'redux-oidc'

export default (history) => combineReducers({
  router: connectRouter(history),
  oidc: oidcReducer
})
