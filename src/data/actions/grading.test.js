import actions, { dataKey } from './grading';
import { testAction, testActionTypes } from './testUtils';

describe('actions', () => {
  describe('action types', () => {
    const actionTypes = [
      actions.loadSubmission,
      actions.preloadNext,
      actions.loadNext,
      actions.loadPrev,
      actions.updateSelection,
      actions.rubric.updateComment,
      actions.rubric.updateCriterionPoints,
      actions.rubric.updateCriterionComment,
      actions.startGrading,
      actions.setRubricFeedback,
      actions.setCriterionFeedback,
      actions.clearGrade,
    ].map(action => action.toString());
    testActionTypes(actionTypes, dataKey);
  });
  describe('grading actions provided', () => {
    test('loadSubmission action', () => testAction(actions.loadSubmission));
    test('preloadNext action', () => testAction(actions.preloadNext));
    test('loadNext action', () => testAction(actions.loadNext));
    test('loadPrev action', () => testAction(actions.loadPrev));
    test('updateSelection action', () => testAction(actions.updateSelection));
    test('rubric updateComment action', () => testAction(actions.rubric.updateComment));
    test('rubric updateCritrionPoints action', () => testAction(actions.rubric.updateCriterionPoints));
    test('rubric updateCriterionComment action', () => testAction(actions.rubric.updateCriterionComment));
    test('startGrading action', () => testAction(actions.startGrading));
    test('setRubricFeedback action', () => testAction(actions.setRubricFeedback));
    test('setCriterionFeedback action', () => testAction(actions.setCriterionFeedback));
    test('clearGrade action', () => testAction(actions.clearGrade));
  });
});
