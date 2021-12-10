import { createSlice } from '@reduxjs/toolkit';

import { StrictDict } from 'utils';

import { lockStatuses } from 'data/services/lms/constants';

const initialState = {
  selected: [
    /**
     * {
     *   submissionUUID: '',
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
     * submissionUUID: '',
     * gradeStatus: '',
     * response: {
     *   text: '',
     *   files: [{
     *     downloadURL: '',
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
    [state.current.submissionUUID]: { ...data },
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
    [state.current.submissionUUID]: { ...data },
  },
});

/**
 * Updates the state's gradingData entry for the seleted submission,
 * overlaying the passed data on top of the existing data for the that
 * submission.
 * @return {object} - new state
 */
export const updateGradingData = (state, data) => {
  const currentId = state.current.submissionUUID;
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
  const entry = state.gradingData[state.current.submissionUUID];
  const criteria = [...entry.criteria];
  criteria[orderNum] = { ...entry.criteria[orderNum], ...data };
  return updateGradingData(state, {
    ...entry,
    criteria,
  });
};

// eslint-disable-next-line no-unused-vars
const grading = createSlice({
  name: 'grading',
  initialState,
  reducers: {
    loadSubmission: (state, { payload }) => ({
      ...state,
      current: { ...payload },
      gradeData: {
        ...state.gradeData,
        [payload.submissionUUID]: payload.gradeData,
      },
    }),
    loadNext: (state) => ({
      ...state,
      current: {},
      activeIndex: state.activeIndex + 1,
    }),
    loadPrev: (state) => ({
      ...state,
      current: {},
      activeIndex: state.activeIndex - 1,
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
      };
      const gradeData = {
        ...state.gradeData,
        [state.current.submissionUUID]: payload.gradeData,
      };
      const gradingData = {
        ...state.gradingData,
        [state.current.submissionUUID]: {
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
    failSetLock: (state, { payload }) => ({
      ...state,
      current: { ...state.current, lockStatus: payload.lockStatus },
    }),
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
      delete gradingData[state.current.submissionUUID];
      return {
        ...state,
        gradeData: {
          ...state.gradeData,
          [state.current.submissionUUID]: { ...payload.gradeData },
        },
        gradingData,
        current: {
          ...state.current,
          gradeStatus: payload.gradeStatus,
          lockStatus: payload.lockStatus,
        },
      };
    },
    loadStatus: (state, { payload }) => {
      const gradingData = { ...state.gradingData };
      delete gradingData[state.current.submissionUUID];
      return {
        ...state,
        gradeData: {
          ...state.gradeData,
          [state.current.submissionUUID]: { ...payload.gradeData },
        },
        gradingData,
        current: {
          ...state.current,
          gradeStatus: payload.gradeStatus,
          lockStatus: payload.lockStatus,
        },
      };
    },
    stopGrading: (state, { payload }) => {
      const { submissionUUID } = state.current;
      const localGradeData = { ...state.localGradeData };
      delete localGradeData[submissionUUID];
      const gradeData = { ...state.gradeData };
      let lockStatus = lockStatuses.unlocked;
      let { gradeStatus } = state.current;
      if (payload) {
        const { submissionStatus } = payload;
        gradeData[submissionUUID] = submissionStatus.gradeData;
        lockStatus = submissionStatus.lockStatus;
        gradeStatus = submissionStatus.gradeStatus;
      }
      return {
        ...state,
        localGradeData,
        current: {
          ...state.current,
          lockStatus,
          gradeStatus,
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
