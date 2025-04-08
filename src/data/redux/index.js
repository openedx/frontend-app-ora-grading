import { combineReducers } from 'redux';

import { StrictDict } from '@src/utils';

import * as app from './app';
import * as grading from './grading';
import * as requests from './requests';
import * as submissions from './submissions';

export { default as thunkActions } from './thunkActions';

const modules = {
  app,
  grading,
  requests,
  submissions,
};

const moduleProps = (propName) => Object.keys(modules).reduce(
  (obj, moduleKey) => ({ ...obj, [moduleKey]: modules[moduleKey][propName] }),
  {},
);

const rootReducer = combineReducers(moduleProps('reducer'));

const actions = StrictDict(moduleProps('actions'));

const selectors = StrictDict(moduleProps('selectors'));

export { actions, selectors };

export default rootReducer;
