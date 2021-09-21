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
  grading: false,
};

// eslint-disable-next-line no-unused-vars
const app = (state = initialState, { type, payload }) => {
  switch (type) {
    case actions.app.loadCourseMetadata.toString():
      return { ...state, courseMetadata: payload };
    case actions.app.loadOraMetadata.toString():
      return { ...state, oraMetadata: payload };
    case actions.app.setShowReview.toString():
      return { ...state, showReview: payload };
    case actions.app.setGrading.toString():
      return { ...state, grading: payload };
    case actions.app.toggleShowRubric.toString():
      return { ...state, showRubric: !state.showRubric };
    default:
      return state;
  }
};

export { initialState };
export default app;
