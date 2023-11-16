import { createSlice } from '@reduxjs/toolkit';

import { StrictDict } from 'utils';

const initialState = {
  reviewModalOpen: false,
  selectedSubmissionId: null,
};

const problemSteps = createSlice({
  name: 'problemSteps',
  initialState,
  reducers: {
    setOpenReviewModal: (state, { payload }) => ({ ...state, reviewModalOpen: payload }),
    setSelectedSubmissionId: (state, { payload }) => ({ ...state, selectedSubmissionId: payload }),
  },
});

const actions = StrictDict(problemSteps.actions);
const { reducer } = problemSteps;

export {
  actions,
  reducer,
  initialState,
};
