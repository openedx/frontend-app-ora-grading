import { StrictDict } from 'utils';

import { actions } from 'data/redux';
import { locationId } from 'data/constants/app';
import { initializeApp } from './requests';

/**
 * initialize the app, loading ora and course metadata from the api, and loading the initial
 * submission list data.
 */
export const initialize = () => (dispatch) => {
  dispatch(initializeApp({
    locationId,
    onSuccess: (response) => {
      dispatch(actions.app.loadOraMetadata(response.oraMetadata));
      dispatch(actions.app.loadCourseMetadata(response.courseMetadata));
      dispatch(actions.submissions.loadList(response.submissions));
    },
  }));
};

/**
 * initialize the app, loading ora and course metadata from the api, and loading the initial
 * submission list data.
 */
export const reloadSubmissions = () => (dispatch) => {
  dispatch(initializeApp({
    locationId,
    reload: true,
    onSuccess: (response) => {
      dispatch(actions.submissions.loadList(response.submissions));
    },
  }));
};

export default StrictDict({ initialize, reloadSubmissions });
