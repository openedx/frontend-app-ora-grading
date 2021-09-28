import { createReducer } from '@reduxjs/toolkit';

import { lockStatuses } from 'data/services/lms/constants';
import actions from 'data/actions';

const initialState = {
  selected: [
    /**
     * {
     *   submissionId: '',
     *   username: ''
     *   teamName: ''
     *   dateSubmitted: 0,
     *   gradeStatus: '',
     * }
     */
  ],
  gradeData: {
    /**
     * <submissionId>: {
     *  overallFeedback: '',
     *  criteria: [{
     *    orderNum: 0,
     *    points: 0,
     *    comments: '',
     *  }],
     * }
     */
  },
  activeIndex: null,
  current: {
    /**
     * gradeData: {
     *   score: {
     *     pointsEarned: 0,
     *     pointsPossible: 0,
     *   }
     *   overallFeedback: '',
     *   criteria: [{
     *     name: '',
     *     feedback: '',
     *     selectedOption: '',
     *   }],
     * }
     * gradeStatus: '',
     * response: {
     *   text: '',
     *   files: [{
     *     download_url: '',
     *     description: '',
     *     name: '',
     *   }],
     * },
     */
  },
  prev: null, // { response }
  next: null, // { response }
};

/**
 * Updates the given state's gradeData entry for the seleted submission,
 * overlaying the passed data on top of the existing data for the that
 * submission.
 * @return {object} - new state
 */
export const updateGradeData = (state, data) => ({
  ...state,
  gradeData: {
    ...state.gradeData,
    [state.current.submissionId]: {
      ...state.gradeData[state.current.submissionId],
      ...data,
    },
  },
});

/**
 * Updates the given state's gradeData entry for the seleted submission,
 * overlaying the passed data on top of the existing data for the criterion
 * at the given index (orderNum) for the rubric.
 * @return {object} - new state
 */
export const updateCriterion = (state, orderNum, data) => {
  const entry = state.gradeData[state.current.submissionId];
  const criteria = {
    ...entry.criteria,
    [orderNum]: { ...entry.criteria[orderNum], ...data },
  };
  return updateGradeData(state, { ...entry, criteria });
};

// eslint-disable-next-line no-unused-vars
const app = createReducer(initialState, {
  [actions.grading.loadSubmission]: (state, { payload }) => ({
    ...state,
    current: { ...payload },
    activeIndex: 0,
  }),
  [actions.grading.preloadNext]: (state, { payload }) => ({ ...state, next: payload }),
  [actions.grading.preloadPrev]: (state, { payload }) => ({ ...state, prev: payload }),
  [actions.grading.loadNext]: (state, { payload }) => ({
    ...state,
    prev: state.current,
    current: { response: state.next.response, ...payload },
    activeIndex: state.activeIndex + 1,
    next: null,
  }),
  [actions.grading.loadPrev]: (state, { payload }) => ({
    ...state,
    next: state.current,
    current: { response: state.prev.response, ...payload },
    activeIndex: state.activeIndex - 1,
    prev: null,
  }),
  [actions.grading.updateSelection]: (state, { payload }) => ({
    ...state,
    selected: payload,
    activeIndex: 0,
  }),
  [actions.grading.startGrading]: (state, { payload }) => updateGradeData(
    {
      ...state,
      current: { ...state.current, lockStatus: lockStatuses.inProgress },
    },
    { ...payload },
  ),
  [actions.grading.setRubricFeedback]: (state, { payload }) => (
    updateGradeData(state, { overallFeedback: payload })
  ),
  [actions.grading.setCriterionOption]: (state, { payload: { orderNum, value } }) => (
    updateCriterion(state, orderNum, { selectedOption: value })
  ),
  [actions.grading.setCriterionFeedback]: (state, { payload: { orderNum, value } }) => (
    updateCriterion(state, orderNum, { feedback: value })
  ),
  [actions.grading.clearGrade]: (state) => {
    const gradeData = { ...state.gradeData };
    delete gradeData[state.current.submissionId];
    return {
      ...state,
      gradeData,
      current: {
        ...state.current,
        lockStatus: lockStatuses.unlocked,
      },
    };
  },
});

export { initialState };
export default app;
