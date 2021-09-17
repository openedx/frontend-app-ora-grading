import actions from 'data/actions';

const initialState = {
  list: {
    /**
     * <submissionId>: {
     *   submissionId: '',
     *   username: ''
     *   teamName: ''
     *   dateSubmitted: 0,
     *   status: ''
     *   grade: {
     *     pointsEarned: 0,
     *     pointsPossible: 0,
     *   }
     * }
     */
  },
  selected: [
    /**
     * {
     *   submissionId: '',
     *   username: ''
     *   teamName: ''
     *   dateSubmitted: 0,
     *   status: '',
     * }
     */
  ],
  activeIndex: null, // submissionId
  current: {
    /**
     * staticData: {
     *   submissionId: '',
     *   username: ''
     *   teamName: ''
     *   dateSubmitted: 0,
     *   status: ''
     *   rubricConfig: {
     *     feedback: '',
     *     criteria: [{
     *       name: '',
     *       orderNum: 0,
     *       prompt: '',
     *       feedback: '',
     *       options: [{
     *         orderNum: 0,
     *         name: '',
     *         label: '',
     *         explanation: '',
     *         points: 0,
     *       }]
     *     }],
     *   },
     * }
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
  prev: null, // { staticData, response }
  next: null, // { staticData, response }
};

// eslint-disable-next-line no-unused-vars
const grades = (state = initialState, { type, payload }) => {
  switch (type) {
    case actions.submissions.loadSubmission.toString():
      return {
        ...state,
        current: payload,
        activeIndex: 0,
      };
    case actions.submissions.preloadNext.toString():
      return { ...state, next: payload };
    case actions.submissions.preloadPrev.toString():
      return { ...state, prev: payload };

    case actions.submissions.loadNext.toString():
      return {
        ...state,
        prev: state.current,
        current: {
          ...state.next,
          ...payload,
        },
        activeIndex: state.activeIndex + 1,
        next: null,
      };
    case actions.submissions.loadPrev.toString():
      return {
        ...state,
        next: state.current,
        current: {
          ...state.prev,
          ...payload,
        },
        activeIndex: state.activeIndex - 1,
        prev: null,
      };
    case actions.submissions.loadList.toString():
      return { ...state, list: payload };
    case actions.submissions.updateSelection.toString():
      return { ...state, selected: payload, activeIndex: 0 };
    default:
      return state;
  }
};

export { initialState };
export default grades;
