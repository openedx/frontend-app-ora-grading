import { StrictDict } from 'utils';

import actions from 'data/actions';
import selectors from 'data/selectors';
import api from 'data/services/lms/api';

/**
 * Prefetch the "next" submission in the selected queue.  Only fetches the response info.
 */
export const prefetchNext = () => (dispatch, getState) => (
  api.fetchSubmissionResponse(
    selectors.grading.nextSubmissionId(getState()),
  ).then((response) => {
    dispatch(actions.grading.preloadNext(response.submission));
  })
);

/**
 * Prefetch the "previous" submission in the selected queue.  Only fetches the response info.
 */
export const prefetchPrev = () => (dispatch, getState) => (
  api.fetchSubmissionResponse(
    selectors.grading.prevSubmissionId(getState()),
  ).then((response) => {
    dispatch(actions.grading.preloadPrev(response.submissionStatus));
  })
);

/**
 * Fetches the current status for the "next" submission in the selected queue,
 * and calls loadNext with it to update the current selection index info.
 * If the new index has a next submission available, preload its response.
 */
export const loadNext = () => (dispatch, getState) => (
  api.fetchSubmissionStatus(
    selectors.grading.nextSubmissionId(getState()),
  ).then((response) => {
    dispatch(actions.grading.loadNext(response));
    if (selectors.grading.hasNextSubmission(getState())) {
      dispatch(module.prefetchNext());
    }
  })
);

/**
 * Fetches the current status for the "previous" submission in the selected queue,
 * and calls loadPrev with it to update the current selection index info.
 * If the new index has a previous submission available, preload its response.
 */
export const loadPrev = () => (dispatch, getState) => (
  api.fetchSubmissionStatus(
    selectors.grading.prevSubmissionId(getState()),
  ).then((response) => {
    dispatch(actions.grading.loadPrev(response));
    if (selectors.grading.hasPrevSubmission(getState())) {
      dispatch(module.prefetchPrev());
    }
  })
);

/**
 * Load a list of selected submissionIds, sets the app to review mode, and fetches the current
 * selected submission's full data (grade data, status, and rubric).
 * Then loads current selection and prefetches neighbors.
 * @param {string[]} submissionIds - ordered list of submissionIds for selected submissions
 */
export const loadSelectionForReview = (submissionIds) => (dispatch, getState) => {
  dispatch(actions.grading.updateSelection(submissionIds));
  return api.fetchSubmission(
    selectors.grading.selectedSubmissionId(getState()),
  ).then((response) => {
    dispatch(actions.grading.loadSubmission(response));
    dispatch(actions.app.setShowReview(true));
    if (selectors.grading.hasNextSubmission(getState())) {
      dispatch(prefetchNext());
    }
    if (selectors.grading.hasPrevSubmission(getState())) {
      dispatch(prefetchPrev());
    }
  });
};

export default StrictDict({
  loadSelectionForReview,
  loadNext,
  loadPrev,
});
