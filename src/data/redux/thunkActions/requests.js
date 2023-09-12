import { StrictDict } from 'utils';

import { RequestKeys } from 'data/constants/requests';
// eslint-disable-next-line import/no-cycle
import { actions } from 'data/redux';
import api from 'data/services/lms/api';

import * as module from './requests';

/**
 * Wrapper around a network request promise, that sends actions to the redux store to
 * track the state of that promise.
 * Tracks the promise by requestKey, and sends an action when it is started, succeeds, or
 * fails.  It also accepts onSuccess and onFailure methods to be called with the output
 * of failure or success of the promise.
 * @param {string} requestKey - request tracking identifier
 * @param {Promise} promise - api event promise
 * @param {[func]} onSuccess - onSuccess method ((response) => { ... })
 * @param {[func]} onFailure - onFailure method ((error) => { ... })
 */
export const networkRequest = ({
  requestKey,
  promise,
  onSuccess,
  onFailure,
}) => (dispatch) => {
  dispatch(actions.requests.startRequest(requestKey));
  return promise.then((response) => {
    if (onSuccess) { onSuccess(response); }
    dispatch(actions.requests.completeRequest({ requestKey, response }));
  }).catch((error) => {
    if (onFailure) { onFailure(error); }
    dispatch(actions.requests.failRequest({ requestKey, error }));
  });
};

/**
 * Tracked initializeApp api method.
 * Tracked to the `initialize` request key.
 * @param {string} locationId - ora location id
 * @param {[func]} onSuccess - onSuccess method ((response) => { ... })
 * @param {[func]} onFailure - onFailure method ((error) => { ... })
 */
export const initializeApp = ({ locationId, ...rest }) => (dispatch) => {
  dispatch(module.networkRequest({
    requestKey: RequestKeys.initialize,
    promise: api.initializeApp(locationId),
    ...rest,
  }));
};

/**
 * Tracked fetchSubmissionStatus api method.
 * Tracked to the `fetchSubmissionStatus` request key.
 * @param {string} submissionUUID - target submission id
 * @param {[func]} onSuccess - onSuccess method ((response) => { ... })
 * @param {[func]} onFailure - onFailure method ((error) => { ... })
 */
export const fetchSubmissionStatus = ({ submissionUUID, ...rest }) => (dispatch) => {
  dispatch(module.networkRequest({
    requestKey: RequestKeys.fetchSubmissionStatus,
    promise: api.fetchSubmissionStatus(submissionUUID),
    ...rest,
  }));
};

/**
 * Tracked fetchSubmission api method.  tracked to the `fetchSubmission` request key.
 * @param {string} submissionUUID - target submission id
 * @param {[func]} onSuccess - onSuccess method ((response) => { ... })
 * @param {[func]} onFailure - onFailure method ((error) => { ... })
 */
export const fetchSubmission = ({ submissionUUID, ...rest }) => (dispatch) => {
  dispatch(module.networkRequest({
    requestKey: RequestKeys.fetchSubmission,
    promise: api.fetchSubmission(submissionUUID),
    ...rest,
  }));
};

/**
 * Tracked setLock api method.  tracked to the `setLock` request key.
 * @param {string} submissionUUID - target submission id
 * @param {bool} value - requested lock value
 * @param {[func]} onSuccess - onSuccess method ((response) => { ... })
 * @param {[func]} onFailure - onFailure method ((error) => { ... })
 */
export const setLock = ({ value, submissionUUID, ...rest }) => (dispatch) => {
  dispatch(module.networkRequest({
    requestKey: RequestKeys.setLock,
    promise: value ? api.lockSubmission(submissionUUID) : api.unlockSubmission(submissionUUID),
    ...rest,
  }));
};

/**
 * Tracked batchUnlock api method.  tracked to the `batchUnlock` request key.
 * @param {string[]} submissionUUIDs - target submission ids
 */
export const batchUnlock = ({ submissionUUIDs, ...rest }) => (dispatch) => {
  dispatch(module.networkRequest({
    requestKey: RequestKeys.batchUnlock,
    promise: api.batchUnlockSubmissions(submissionUUIDs),
    ...rest,
  }));
};

/**
 * Tracked initializeApp api method.  tracked to the `initialize` request key.
 * @param {string} submissionUUID - target submission id
 * @param {obj} gradeData - grade data object
 * @param {[func]} onSuccess - onSuccess method ((response) => { ... })
 * @param {[func]} onFailure - onFailure method ((error) => { ... })
 */
export const submitGrade = ({ submissionUUID, gradeData, ...rest }) => (dispatch) => {
  dispatch(module.networkRequest({
    requestKey: RequestKeys.submitGrade,
    promise: api.updateGrade(submissionUUID, gradeData),
    ...rest,
  }));
};

export default StrictDict({
  fetchSubmission,
  fetchSubmissionStatus,
  setLock,
  submitGrade,
});
