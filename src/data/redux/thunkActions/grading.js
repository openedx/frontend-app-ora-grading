import { StrictDict } from 'utils';

import { RequestKeys } from 'data/constants/requests';
import { actions, selectors } from 'data/redux';

import * as module from './grading';
import requests from './requests';

/**
 * Prefetch the "next" submission in the selected queue.  Only fetches the response info.
 */
export const prefetchNext = () => (dispatch, getState) => {
  dispatch(requests.fetchSubmissionResponse({
    requestKey: RequestKeys.prefetchNext,
    submissionId: selectors.grading.next.submissionId(getState()),
    onSuccess: (response) => {
      dispatch(actions.grading.preloadNext(response));
    },
  }));
};

/**
 * Prefetch the "previous" submission in the selected queue.  Only fetches the response info.
 */
export const prefetchPrev = () => (dispatch, getState) => {
  dispatch(requests.fetchSubmissionResponse({
    requestKey: RequestKeys.prefetchPrev,
    submissionId: selectors.grading.prev.submissionId(getState()),
    onSuccess: (response) => {
      dispatch(actions.grading.preloadPrev(response));
    },
  }));
};

/**
 * Fetch the target neighbor submission's status, start grading if in progress,
 * dispatches load action with the response (injecting submissionId).  If hasNeighbor,
 * also dispatches the prefetchAction to pre-fetch the new neighbor's response.
 * @param {string} submissionId - target submission id
 * @param {action} loadAction - redux action/thunkAction to load the submission status
 * @param {bool} hasNeighbor - is there a new neighbor to be pre-fetched?
 * @param {action} prefetchAction - redux action/thunkAction to prefetch the new
 *   neighbor's response.
 */
export const fetchNeighbor = ({
  submissionId,
  loadAction,
  hasNeighbor,
  prefetchAction,
}) => (dispatch) => {
  dispatch(requests.fetchSubmissionStatus({
    submissionId,
    onSuccess: (response) => {
      dispatch(loadAction({ ...response, submissionId }));
      if (hasNeighbor) { dispatch(prefetchAction()); }
    },
  }));
};

/**
 * Fetches the current status for the "next" submission in the selected queue,
 * and calls loadNext with it to update the current selection index info.
 * If the new index has a next submission available, preload its response.
 */
export const loadNext = () => (dispatch, getState) => {
  dispatch(module.fetchNeighbor({
    loadAction: actions.grading.loadNext,
    hasNeighbor: selectors.grading.next.doesExist(getState()),
    prefetchAction: module.prefetchNext,
    submissionId: selectors.grading.next.submissionId(getState()),
  }));
};

/**
 * Fetches the current status for the "previous" submission in the selected queue,
 * and calls loadPrev with it to update the current selection index info.
 * If the new index has a previous submission available, preload its response.
 */
export const loadPrev = () => (dispatch, getState) => {
  dispatch(module.fetchNeighbor({
    loadAction: actions.grading.loadPrev,
    hasNeighbor: selectors.grading.prev.doesExist(getState()),
    prefetchAction: module.prefetchPrev,
    submissionId: selectors.grading.prev.submissionId(getState()),
  }));
};

/**
 * Load a list of selected submissionIds, sets the app to review mode, and fetches the current
 * selected submission's full data (grade data, status, and rubric).
 * Then loads current selection and prefetches neighbors.
 * @param {string[]} submissionIds - ordered list of submissionIds for selected submissions
 */
export const loadSelectionForReview = (submissionIds) => (dispatch, getState) => {
  dispatch(requests.fetchSubmission({
    submissionId: submissionIds[0],
    onSuccess: (response) => {
      dispatch(actions.grading.updateSelection(submissionIds));
      dispatch(actions.grading.loadSubmission({
        ...response,
        submissionId: submissionIds[0],
      }));
      dispatch(actions.app.setShowReview(true));
      if (selectors.grading.next.doesExist(getState())) {
        dispatch(module.prefetchNext());
      }
      if (selectors.grading.prev.doesExist(getState())) {
        dispatch(module.prefetchPrev());
      }
    },
  }));
};

/**
 * Start grading the current submission.
 * Attempts to lock the submisison, and on a success, sets the local grading state to
 * True, and then loads initializes the grading process with GradeData associated with
 * the current submission.  If there is no grade data, generates an empty grade entry
 * based on the rubric config.
 */
export const startGrading = () => (dispatch, getState) => {
  dispatch(requests.setLock({
    value: true,
    submissionId: selectors.grading.selected.submissionId(getState()),
    onSuccess: (response) => {
      dispatch(actions.app.setShowRubric(true));
      let { gradeData } = response;
      if (!gradeData) {
        gradeData = selectors.app.emptyGrade(getState());
      }
      dispatch(actions.grading.startGrading({ ...response, gradeData }));
    },
  }));
};

/**
 * Cancels the grading process for the current submisison.
 * Releases the lock and dispatches stopGrading on success.
 */
export const cancelGrading = () => (dispatch, getState) => {
  dispatch(requests.setLock({
    value: false,
    submissionId: selectors.grading.selected.submissionId(getState()),
    onSuccess: () => {
      dispatch(module.stopGrading());
    },
  }));
};

/**
 * Stops the grading process for the current submission (local only)
 * Clears the local grade data for the current submission and sets grading state
 * to False
 */
export const stopGrading = () => (dispatch) => {
  dispatch(actions.grading.stopGrading());
};

export const submitGrade = () => (dispatch, getState) => {
  const gradeData = selectors.grading.selected.gradingData(getState());
  const submissionId = selectors.grading.selected.submissionId(getState());
  if (selectors.grading.validation.isValidForSubmit(getState())) {
    dispatch(actions.grading.setShowValidation(false));
    dispatch(requests.submitGrade({
      submissionId,
      gradeData,
      onSuccess: (response) => {
        dispatch(actions.grading.completeGrading(response));
      },
      onFailure: () => {
        // on failure action
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
  stopGrading,
  submitGrade,
});
