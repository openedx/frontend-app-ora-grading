import { createSlice } from '@reduxjs/toolkit';

import { StrictDict } from 'utils';

const initialState = {
  reviewModalOpen: false,
};

const problemSteps = createSlice({
  name: 'problemSteps',
  initialState,
  reducers: {
    setOpenReviewModal: (state, { payload }) => ({ ...state, reviewModalOpen: payload }),
  },
});

const actions = StrictDict(problemSteps.actions);
const { reducer } = problemSteps;

export {
  actions,
  reducer,
  initialState,
};
