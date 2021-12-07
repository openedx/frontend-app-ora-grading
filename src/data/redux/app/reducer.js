import { StrictDict } from 'utils';
import { createSlice } from '@reduxjs/toolkit';

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
};

// eslint-disable-next-line no-unused-vars
const app = createSlice({
  name: 'app',
  initialState,
  reducers: {
    loadCourseMetadata: (state, { payload }) => ({ ...state, courseMetadata: payload }),
    loadOraMetadata: (state, { payload }) => ({ ...state, oraMetadata: payload }),
    setShowReview: (state, { payload }) => ({
      ...state,
      showReview: payload,
      showRubric: state.showRubric && payload, // Hide rubric when closing review window
    }),
    setShowRubric: (state, { payload }) => ({ ...state, showRubric: payload }),
    toggleShowRubric: (state) => ({ ...state, showRubric: !state.showRubric }),
  },
});

const actions = StrictDict(app.actions);

const { reducer } = app;

export {
  actions,
  initialState,
  reducer,
};
