import { createReducer } from '@reduxjs/toolkit';

import actions from 'data/actions';

const initialState = {
  oraMetadata: {
    prompt: '',
    name: '',
    type: '',
    rubricConfig: null,
  },
  courseMetadata: {
    name: '',
    number: '',
    org: '',
  },
  showReview: false,
  showRubric: false,
  isGrading: false,
};

// eslint-disable-next-line no-unused-vars
const app = createReducer(initialState, {
  [actions.app.loadCourseMetadata]: (state, { payload }) => ({ ...state, courseMetadata: payload }),
  [actions.app.loadOraMetadata]: (state, { payload }) => ({ ...state, oraMetadata: payload }),
  [actions.app.setShowReview]: (state, { payload }) => ({
    ...state,
    showReview: payload,
    isReview: state.isGrading && payload, // stop grading when closing review window
    showRubric: state.showRubric && payload, // Hide rubric when closing review window
  }),
  [actions.app.setGrading]: (state, { payload }) => ({
    ...state,
    isGrading: payload,
    showRubric: payload || state.showRubric, // open rubric when starting grading
  }),
  [actions.app.toggleShowRubric]: (state) => ({ ...state, showRubric: !state.showRubric }),
});

export { initialState };
export default app;
