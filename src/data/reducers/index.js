import { combineReducers } from 'redux';

import app from './app';
import grading from './grading';
import requests from './requests';
import submissions from './submissions';

/* istanbul ignore next */
const rootReducer = combineReducers({
  app: app.reducer,
  grading: grading.reducer,
  requests: requests.reducer,
  submissions: submissions.reducer,
});

export default rootReducer;
