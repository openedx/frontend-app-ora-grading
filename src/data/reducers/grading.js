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
  activeIndex: null, // submissionId
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
     *     score: 0,
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
const app = (state = initialState, { type, payload }) => {
  switch (type) {
    case actions.grading.loadSubmission.toString():
      return {
        ...state,
        current: {
          ...payload,
        },
        activeIndex: 0,
      };
    case actions.grading.preloadNext.toString():
      return { ...state, next: payload };
    case actions.grading.preloadPrev.toString():
      return { ...state, prev: payload };
    case actions.grading.loadNext.toString():
      return {
        ...state,
        prev: state.current,
        current: {
          ...payload,
        },
        activeIndex: state.activeIndex + 1,
        next: null,
      };
    case actions.grading.loadPrev.toString():
      return {
        ...state,
        next: state.current,
        current: {
          ...payload,
        },
        activeIndex: state.activeIndex - 1,
        prev: null,
      };
    case actions.grading.updateSelection.toString():
      return { ...state, selected: payload, activeIndex: 0 };
    default:
      return state;
  }
};

export { initialState };
export default app;
