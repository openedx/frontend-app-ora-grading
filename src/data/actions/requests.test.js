import actions, { dataKey } from './requests';
import { testAction, testActionTypes } from './testUtils';

describe('actions', () => {
  describe('action types', () => {
    const actionTypes = [
      actions.startRequest,
      actions.completeRequest,
      actions.failRequest,
    ].map(action => action.toString());
    testActionTypes(actionTypes, dataKey);
  });
  describe('actions provided', () => {
    test('startRequest action', () => testAction(actions.startRequest));
    test('completeRequest action', () => testAction(actions.completeRequest));
    test('failRequest action', () => testAction(actions.failRequest));
  });
});
