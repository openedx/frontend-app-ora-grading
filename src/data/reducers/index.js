import { combineReducers } from 'redux';

import app from './app';
import submissions from './submissions';

/* istanbul ignore next */
const rootReducer = combineReducers({
  app,
  submissions,
});

export default rootReducer;
