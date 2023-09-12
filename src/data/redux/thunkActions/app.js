import { StrictDict } from 'utils';
// eslint-disable-next-line import/no-cycle
import { selectors, actions } from 'data/redux';
import { locationId } from 'data/constants/app';

import {
  batchUnlock,
  initializeApp,
} from './requests';
import * as module from './app';

/**
 * initialize the app, loading ora and course metadata from the api, and loading the initial
 * submission list data.
 */
export const initialize = () => (dispatch) => {
  dispatch(initializeApp({
    locationId: locationId(),
    onSuccess: (response) => {
      dispatch(actions.app.loadIsEnabled(response.isEnabled));
      dispatch(actions.app.loadOraMetadata(response.oraMetadata));
      dispatch(actions.app.loadCourseMetadata(response.courseMetadata));
      dispatch(actions.submissions.loadList(response.submissions));
    },
  }));
};

export const cancelReview = () => (dispatch, getState) => {
  dispatch(batchUnlock({
    submissionUUIDs: selectors.grading.selection(getState()),
    onSuccess: () => {
      dispatch(actions.app.setShowReview(false));
      dispatch(module.initialize());
    },
  }));
};
export default StrictDict({
  cancelReview,
  initialize,
});
