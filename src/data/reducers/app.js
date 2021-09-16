import actions from 'data/actions';

const initialState = {
  oraMetadata: {
    prompt: '',
    name: '',
    type: '',
  },
  showReview: false,
  grading: false,
};

// eslint-disable-next-line no-unused-vars
const app = (state = initialState, { type, payload }) => {
  switch (type) {
    case actions.app.loadOraMetadata.toString():
      return { ...state, oraMetadata: payload };
    case actions.app.setShowReview.toString():
      return { ...state, showReview: payload };
    case actions.app.setGrading.toString():
      return { ...state, grading: payload };
    default:
      return state;
  }
};

export { initialState };
export default app;
