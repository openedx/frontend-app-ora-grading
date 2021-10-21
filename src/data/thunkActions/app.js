import { StrictDict } from 'utils';

import actions from 'data/actions';
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

export default StrictDict({ initialize });
