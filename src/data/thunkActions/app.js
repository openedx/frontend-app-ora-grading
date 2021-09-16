import { StrictDict } from 'utils';

import actions from 'data/actions';
import selectors from 'data/selectors';
import api from 'data/services/lms/api';

const locationId = window.location.pathname.slice(1);

// eslint-disable-next-line no-unused-vars
export const initialize = () => (dispatch) => (
  api.initializeApp(locationId).then((response) => {
    dispatch(actions.app.loadOraMetadata(response.oraMetadata));
    dispatch(actions.submissions.loadList(response.submissions));
  })
);

export const prefetchPrev = () => (dispatch, getState) => (
  api.fetchSubmission(selectors.submissions.prevSubmissionId(getState())).then((response) => {
    dispatch(actions.submissions.preloadPrev(response.submission));
  })
);

export const prefetchNext = () => (dispatch, getState) => (
  api.fetchSubmission(selectors.submissions.nextSubmissionId(getState())).then((response) => {
    dispatch(actions.submissions.preloadNext(response.submission));
    if (selectors.submissions.activeIndex(getState()) > 0) {
      return dispatch(prefetchPrev());
    }
    return true;
  })
);

export const fetchSubmissionFromSelection = () => (dispatch, getState) => {
  console.log({
    fetchSubmission: selectors.submissions.selectedSubmissionId(getState()),
  });
  return (
    api.fetchSubmission(
      selectors.submissions.selectedSubmissionId(getState()),
    ).then((response) => {
      dispatch(actions.submissions.loadSubmission(response.submission));
      const activeIndex = selectors.submissions.activeIndex(getState());
      const selected = selectors.submissions.selected(getState());
      if (activeIndex < selected.length - 1) {
        return dispatch(prefetchNext());
      }
      if (activeIndex > 0) {
        return dispatch(prefetchPrev());
      }
      return true;
    })
  );
};

export const loadSelectionForReview = (selection) => (dispatch) => {
  const submissions = selection.map(row => row.original);
  dispatch(actions.submissions.updateSelection(submissions));
  dispatch(actions.app.setShowReview(true));
  dispatch(fetchSubmissionFromSelection());
};

export default StrictDict({
  initialize,
  loadSelectionForReview,
});
