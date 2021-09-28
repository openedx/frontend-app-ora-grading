import { createReducer } from '@reduxjs/toolkit';

import actions from 'data/actions';
import selectors from 'data/selectors';

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
  gradingStatus: {
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
  [actions.grading.startGrading]: (state, { payload }) => ({
    ...state,
    gradingStatus: {
      ...state.gradingStatus,
      [state.current.submissionId]: { ...payload },
    },
  }),
  [actions.grading.setRubricFeedback]: (state, { payload }) => ({
    ...state,
    gradingStatus: {
      ...state.gradingStatus,
      overallFeebadk: payload,
    },
  }),
  [actions.grading.setCriterionOption]: (state, { payload: { orderNum, value } }) => {
    const entry = state.gradingStatus[state.current.submissionId];
    const { criteria } = entry;
    criteria[orderNum] = { ...criteria[orderNum], selectedOption: value };
    return {
      ...state,
      gradingStatus: {
        ...state.gradingStatus,
        [state.current.submissionId]: {
          ...entry,
          criteria,
        },
      },
    };
  },
  [actions.grading.setCriterionFeedback]: (state, { payload: { orderNum, value } }) => {
    const entry = state.gradingStatus[state.current.submissionId];
    const { criteria } = entry;
    criteria[orderNum] = { ...criteria[orderNum], feedback: value };
    return {
      ...state,
      gradingStatus: {
        ...state.gradingStatus,
        [state.current.submissionId]: {
          ...entry,
          criteria,
        },
      },
    };
  },
  [actions.grading.clearGrade]: (state) => {
    const gradingStatus = { ...state.gradingStatus };
    delete gradingStatus[state.current.submissionId];
    return { ...state, gradingStatus };
  },
});

export { initialState };
export default app;
