import { StrictDict } from 'utils';
// eslint-disable-next-line import/no-cycle
import { actions, selectors } from 'data/redux';
import { RequestKeys, ErrorStatuses } from 'data/constants/requests';

import requests from './requests';
import * as module from './grading';

/**
 * Fetches the current status for the "next" submission in the selected queue,
 * and calls loadNext with it to update the current selection index info.
 * If the new index has a next submission available, preload its response.
 */
export const loadNext = () => (dispatch) => {
  dispatch(actions.requests.clearRequest({ requestKey: RequestKeys.downloadFiles }));
  dispatch(actions.grading.loadNext());
  dispatch(module.loadSubmission());
};

/**
 * Fetches the current status for the "previous" submission in the selected queue,
 * and calls loadPrev with it to update the current selection index info.
 * If the new index has a previous submission available, preload its response.
 */
export const loadPrev = () => (dispatch) => {
  dispatch(actions.requests.clearRequest({ requestKey: RequestKeys.downloadFiles }));
  dispatch(actions.grading.loadPrev());
  dispatch(module.loadSubmission());
};

/**
 * Load a list of selected submissionUUIDs, sets the app to review mode, and fetches the current
 * selected submission's full data (grade data, status, and rubric).
 * Then loads current selection and prefetches neighbors.
 * @param {string[]} submissionUUIDs - ordered list of submissionUUIDs for selected submissions
 */
export const loadSelectionForReview = (submissionUUIDs) => (dispatch) => {
  dispatch(actions.grading.updateSelection(submissionUUIDs));
  dispatch(actions.app.setShowReview(true));
  dispatch(module.loadSubmission());
};

export const loadSubmission = () => (dispatch, getState) => {
  const submissionUUID = selectors.grading.selected.submissionUUID(getState());
  dispatch(actions.requests.clearRequest({ requestKey: RequestKeys.submitGrade }));
  dispatch(requests.fetchSubmission({
    submissionUUID,
    onSuccess: (response) => {
      dispatch(actions.grading.loadSubmission({ ...response, submissionUUID }));
      if (selectors.grading.selected.isGrading(getState())) {
        dispatch(actions.app.setShowRubric(true));
        let { gradeData } = response;
        gradeData = selectors.app.fillGradeData(getState(), gradeData);
        const lockStatus = selectors.grading.selected.lockStatus(getState());
        dispatch(actions.grading.startGrading({ lockStatus, gradeData }));
      }
    },
  }));
};

/**
 * Start grading the current submission.
 * Attempts to lock the submission, and on a success, sets the local grading state to
 * True, and then loads initializes the grading process with GradeData associated with
 * the current submission.  If there is no grade data, generates an empty grade entry
 * based on the rubric config.
 */
export const startGrading = () => (dispatch, getState) => {
  dispatch(actions.requests.clearRequest({ requestKey: RequestKeys.submitGrade }));
  dispatch(requests.setLock({
    value: true,
    submissionUUID: selectors.grading.selected.submissionUUID(getState()),
    onSuccess: (response) => {
      dispatch(actions.app.setShowRubric(true));
      let gradeData = selectors.grading.selected.gradeData(getState());
      gradeData = selectors.app.fillGradeData(getState(), gradeData);
      dispatch(actions.grading.startGrading({ ...response, gradeData }));
    },
    onFailure: (error) => {
      if (error.response.status === ErrorStatuses.forbidden) {
        dispatch(actions.grading.failSetLock(error.response.data));
      }
    },
  }));
};

/**
 * Cancels the grading process for the current submission.
 * Releases the lock and dispatches stopGrading on success.
 */
export const cancelGrading = () => (dispatch, getState) => {
  dispatch(actions.requests.clearRequest({ requestKey: RequestKeys.submitGrade }));
  dispatch(requests.setLock({
    value: false,
    submissionUUID: selectors.grading.selected.submissionUUID(getState()),
    onSuccess: () => {
      dispatch(actions.grading.stopGrading());
    },
    onFailure: (error) => {
      if (error.response.status === ErrorStatuses.forbidden) {
        dispatch(actions.grading.failSetLock(error.response.data));
      }
    },
  }));
};

export const submitGrade = () => (dispatch, getState) => {
  const gradeData = selectors.grading.selected.gradingData(getState());
  const submissionUUID = selectors.grading.selected.submissionUUID(getState());
  const isValid = selectors.grading.validation.isValidForSubmit(getState());
  if (isValid) {
    dispatch(actions.grading.setShowValidation(false));
    dispatch(requests.submitGrade({
      submissionUUID,
      gradeData,
      onSuccess: (response) => {
        dispatch(actions.grading.completeGrading(response));
      },
      onFailure: (error) => {
        if (error.response.status === ErrorStatuses.conflict) {
          dispatch(actions.grading.stopGrading(error.response.data));
        }
      },
    }));
  } else {
    dispatch(actions.grading.setShowValidation(true));
  }
};

export default StrictDict({
  loadSelectionForReview,
  loadNext,
  loadPrev,
  startGrading,
  cancelGrading,
  loadSubmission,
  submitGrade,
});
