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
    courseId: '',
  },
  showReview: false,
  showRubric: false,
  grading: false,
};

// eslint-disable-next-line no-unused-vars
const app = createReducer(initialState, {
  [actions.app.loadCourseMetadata]: (state, { payload }) => ({ ...state, courseMetadata: payload }),
  [actions.app.loadOraMetadata]: (state, { payload }) => ({ ...state, oraMetadata: payload }),
  [actions.app.setShowReview]: (state, { payload }) => ({ ...state, showReview: payload }),
  [actions.app.setGrading]: (state, { payload }) => ({
    ...state,
    grading: payload,
    showRubric: payload,
  }),
  [actions.app.toggleShowRubric]: (state) => ({ ...state, showRubric: !state.showRubric }),
});

export { initialState };
export default app;
