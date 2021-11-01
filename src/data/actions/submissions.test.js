import actions, { dataKey } from './submissions';
import { testAction, testActionTypes } from './testUtils';

describe('actions', () => {
  describe('action types', () => {
    const actionTypes = [
      actions.loadList,
    ].map(action => action.toString());
    testActionTypes(actionTypes, dataKey);
  });
  describe('submissionsactions provided', () => {
    test('loadList action', () => testAction(actions.loadList));
  });
});
