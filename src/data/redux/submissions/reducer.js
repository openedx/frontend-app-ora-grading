import { createSlice } from '@reduxjs/toolkit';

import { StrictDict } from 'utils';

const initialState = {
  allSubmissions: {
    /**
     * <submissionUUID>: {
     *   submissionUUID: '',
     *   username: ''
     *   teamName: ''
     *   dateSubmitted: 0,
     *   gradeStatus: ''
     *   grade: {
     *     pointsEarned: 0,
     *     pointsPossible: 0,
     *   }
     * }
     */
  },
};

// eslint-disable-next-line no-unused-vars
const submissions = createSlice({
  name: 'submissions',
  initialState,
  reducers: {
    loadList: (state, { payload }) => ({ ...state, allSubmissions: payload }),
  },
});

const actions = StrictDict(submissions.actions);
const { reducer } = submissions;

export {
  actions,
  reducer,
  initialState,
};
