import { createReducer } from '@reduxjs/toolkit';

import { RequestStates, RequestKeys } from 'data/constants/requests';
import actions from 'data/actions';

const initialState = {
  [RequestKeys.initialize]: { status: RequestStates.inactive },
  [RequestKeys.fetchSubmission]: { status: RequestStates.inactive },
  [RequestKeys.fetchSubmissionStatus]: { status: RequestStates.inactive },
  [RequestKeys.setLock]: { status: RequestStates.inactive },
  [RequestKeys.prefetchNext]: { status: RequestStates.inactive },
  [RequestKeys.prefetchPrev]: { status: RequestStates.inactive },
  [RequestKeys.submitGrade]: { status: RequestStates.inactive },
};

// eslint-disable-next-line no-unused-vars
const app = createReducer(initialState, {
  [actions.requests.startRequest]: (state, { payload }) => ({
    ...state,
    [payload]: {
      status: RequestStates.pending,
    },
  }),
  [actions.requests.completeRequest]: (state, { payload }) => ({
    ...state,
    [payload.requestKey]: {
      status: RequestStates.completed,
      response: payload.response,
    },
  }),
  [actions.requests.failRequest]: (state, { payload }) => ({
    ...state,
    [payload.requestKey]: {
      status: RequestStates.failed,
      error: payload.error,
    },
  }),
});

export { initialState };
export default app;
