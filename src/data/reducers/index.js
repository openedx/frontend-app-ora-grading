import { combineReducers } from 'redux';

import app from './app';

/* istanbul ignore next */
const rootReducer = combineReducers({
  app,
});

export default rootReducer;
