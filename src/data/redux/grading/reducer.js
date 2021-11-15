import { createSlice } from '@reduxjs/toolkit';

import { StrictDict } from 'utils';

import { lockStatuses } from 'data/services/lms/constants';

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
     * <submissionUUID>: {
     *   overallFeedback: '',
     *   criteria: [{
     *     feedback,
     *     name,
     *     selectedOption,
     *   }],
     * }
     */
  },
  gradingData: {
    /**
     * <submissionUUID>: {
     *   showValidation: false,
     *   overallFeedback: '',
     *   criteria: [{
     *     feedback: '',,
     *     selectedOption: '',
     *   ]},
     * }
     */
  },
  activeIndex: null,
  current: {
    /**
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

export const updateGradeData = (state, data) => ({
  ...state,
  gradeData: {
    ...state.gradeData,
    [state.current.submissionId]: { ...data },
  },
});

/**
 * Updates the given state's gradeData entry for the seleted submission.
 * @return {object} - new state
 */
export const loadGradeData = (state, data) => ({
  ...state,
  gradeData: {
    ...state.gradeData,
    [state.current.submissionId]: { ...data },
  },
});

/**
 * Updates the state's gradingData entry for the seleted submission,
 * overlaying the passed data on top of the existing data for the that
 * submission.
 * @return {object} - new state
 */
export const updateGradingData = (state, data) => {
  const currentId = state.current.submissionId;
  return {
    ...state,
    gradingData: {
      ...state.gradingData,
      [currentId]: ({
        ...(state.gradingData[currentId] || {}),
        ...data,
      }),
    },
  };
};

/**
 * Updates the given state's localGradeData entry for the seleted submission,
 * overlaying the passed data on top of the existing data for the criterion
 * at the given index (orderNum) for the rubric.
 * @return {object} - new state
 */
export const updateCriterion = (state, orderNum, data) => {
  const entry = state.gradingData[state.current.submissionId];
  return updateGradingData(state, {
    ...entry,
    criteria: {
      ...entry.criteria,
      [orderNum]: { ...entry.criteria[orderNum], ...data },
    },
  });
};

const loadCurrentFromNeighbor = (neighbor, { lockStatus, gradeStatus, submissionId }) => ({
  response: neighbor.response,
  lockStatus,
  gradeStatus,
  submissionId,
});

// eslint-disable-next-line no-unused-vars
const grading = createSlice({
  name: 'grading',
  initialState,
  reducers: {
    loadSubmission: (state, { payload }) => ({
      ...state,
      current: { ...payload },
      activeIndex: 0,
    }),
    preloadNext: (state, { payload }) => ({ ...state, next: payload }),
    preloadPrev: (state, { payload }) => ({ ...state, prev: payload }),
    loadNext: (state, { payload }) => ({
      ...state,
      prev: { response: state.current.response },
      current: loadCurrentFromNeighbor(state.next, payload),
      activeIndex: state.activeIndex + 1,
      gradeData: {
        ...state.gradeData,
        [payload.submissionId]: payload.gradeData,
      },
      next: null,
    }),
    loadPrev: (state, { payload }) => ({
      ...state,
      next: { response: state.current.response },
      current: loadCurrentFromNeighbor(state.prev, payload),
      gradeData: {
        ...state.gradeData,
        [payload.submissionId]: payload.gradeData,
      },
      activeIndex: state.activeIndex - 1,
      prev: null,
    }),
    updateSelection: (state, { payload }) => ({
      ...state,
      selected: payload,
      activeIndex: 0,
    }),
    startGrading: (state, { payload }) => {
      const current = {
        ...state.current,
        lockStatus: payload.lockStatus,
        gradeStatus: payload.gradeStatus,
      };
      const gradeData = {
        ...state.gradeData,
        [state.current.submissionId]: payload.gradeData,
      };
      const gradingData = {
        ...state.gradingData,
        [state.current.submissionId]: {
          showValidation: false,
          ...payload.gradeData,
        },
      };
      return {
        ...state,
        current,
        gradeData,
        gradingData,
      };
    },
    setRubricFeedback: (state, { payload }) => (
      updateGradingData(state, { overallFeedback: payload })
    ),
    setCriterionOption: (state, { payload: { orderNum, value } }) => (
      updateCriterion(state, orderNum, { selectedOption: value })
    ),
    setCriterionFeedback: (state, { payload: { orderNum, value } }) => (
      updateCriterion(state, orderNum, { feedback: value })
    ),
    setShowValidation: (state, { payload }) => (
      updateGradingData(state, { showValidation: payload })
    ),
    completeGrading: (state, { payload }) => {
      const gradingData = { ...state.gradingData };
      delete gradingData[state.current.submissionId];
      return {
        ...state,
        gradeData: {
          ...state.gradeData,
          [state.current.submissionId]: { ...payload.gradeData },
        },
        gradingData,
        current: {
          ...state.current,
          gradeStatus: payload.gradeStatus,
          lockStatus: payload.lockStatus,
        },
      };
    },
    stopGrading: (state) => {
      const localGradeData = { ...state.localGradeData };
      delete localGradeData[state.current.submissionId];
      return {
        ...state,
        localGradeData,
        current: {
          ...state.current,
          lockStatus: lockStatuses.unlocked,
        },
      };
    },
  },
});

const actions = StrictDict(grading.actions);
const { reducer } = grading;

export {
  actions,
  reducer,
  initialState,
};
