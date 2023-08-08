import { createSlice } from '@reduxjs/toolkit';

import { StrictDict } from 'utils';

import { lockStatuses } from 'data/services/lms/constants';
import * as module from './reducer';

const initialState = {
  selection: [
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
     *     size: 0,
     *   }],
     * },
     */
  },
  prev: null, // { response }
  next: null, // { response }
};

/**
 * Updates the state's gradingData entry for the selected submission,
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
 * Updates the given state's gradingData entry for the selected submission,
 * overlaying the passed data on top of the existing data for the criterion
 * at the given index (orderNum) for the rubric.
 * @return {object} - new state
 */
export const updateCriterion = (state, orderNum, data) => {
  const entry = state.gradingData[state.current.submissionUUID];
  const criteria = [...entry.criteria];
  criteria[orderNum] = { ...entry.criteria[orderNum], ...data };
  return module.updateGradingData(state, {
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
      selection: payload,
      activeIndex: 0,
    }),
    startGrading: (state, { payload }) => {
      const { submissionUUID } = state.current;
      const hasGradingData = state.gradingData[submissionUUID] !== undefined;
      return {
        ...state,
        current: { ...state.current, lockStatus: payload.lockStatus },
        gradeData: { ...state.gradeData, [submissionUUID]: payload.gradeData },
        gradingData: {
          ...state.gradingData,
          [state.current.submissionUUID]: {
            showValidation: false,
            ...payload.gradeData,
            ...(hasGradingData && { ...state.gradingData[state.current.submissionUUID] }),
          },
        },
      };
    },
    failSetLock: (state, { payload }) => ({
      ...state,
      current: { ...state.current, lockStatus: payload.lockStatus },
    }),
    setRubricFeedback: (state, { payload }) => (
      module.updateGradingData(state, { overallFeedback: payload })
    ),
    setCriterionOption: (state, { payload: { orderNum, value } }) => (
      module.updateCriterion(state, orderNum, { selectedOption: value })
    ),
    setCriterionFeedback: (state, { payload: { orderNum, value } }) => (
      module.updateCriterion(state, orderNum, { feedback: value })
    ),
    setShowValidation: (state, { payload }) => (
      module.updateGradingData(state, { showValidation: payload })
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
    stopGrading: (state, { payload }) => {
      const { submissionUUID } = state.current;
      const gradingData = { ...state.gradingData };
      delete gradingData[submissionUUID];

      const gradeData = {
        ...state.gradeData,
        ...(payload && { [submissionUUID]: payload.submissionStatus.gradeData }),
      };

      const { gradeStatus } = payload ? payload.submissionStatus : state.current;
      const lockStatus = payload ? payload.submissionStatus.lockStatus : lockStatuses.unlocked;

      return {
        ...state,
        gradingData,
        gradeData,
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
