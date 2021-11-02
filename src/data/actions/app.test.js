import actions, { dataKey } from './app';
import { testAction, testActionTypes } from './testUtils';

describe('actions', () => {
  describe('action types', () => {
    const actionTypes = [
      actions.loadCourseMetadata,
      actions.loadOraMetadata,
      actions.setGrading,
      actions.setShowReview,
      actions.toggleShowRubric,
    ].map(action => action.toString());
    testActionTypes(actionTypes, dataKey);
  });
  describe('app actions provided', () => {
    test('loadCourseMetadata action', () => testAction(actions.loadCourseMetadata));
    test('loadOraMetadata action', () => testAction(actions.loadOraMetadata));
    test('setGrading action', () => testAction(actions.setGrading));
    test('setShowReview action', () => testAction(actions.setShowReview));
    test('toggleShowRubric action', () => testAction(actions.toggleShowRubric));
  });
});
