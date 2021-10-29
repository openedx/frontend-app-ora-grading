import { combineReducers } from 'redux';

import { StrictDict } from 'utils';

import * as app from './app';
import * as grading from './grading';
import * as requests from './requests';
import * as submissions from './submissions';

/* istanbul ignore next */
const rootReducer = combineReducers({
  app: app.reducer,
  grading: grading.reducer,
  requests: requests.reducer,
  submissions: submissions.reducer,
});

const actions = StrictDict({
  app: app.actions,
  grading: grading.actions,
  requests: requests.actions,
  submissions: submissions.actions,
});

const selectors = StrictDict({
  app: app.selectors,
  grading: grading.selectors,
  submissions: submissions.selectors,
});

export { actions, selectors };

export default rootReducer;
