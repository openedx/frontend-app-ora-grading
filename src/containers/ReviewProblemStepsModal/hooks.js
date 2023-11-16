import { useState } from 'react';
import { useSelector } from 'react-redux';

import { StrictDict } from 'utils';
import { selectors, thunkActions, actions } from 'data/redux';
import { RequestKeys } from 'data/constants/requests';
import * as module from './hooks';

export const state = StrictDict({
  showConfirmCloseReviewGrade: (val) => useState(val),
});

export const reduxValues = () => ({
  errorStatus: useSelector((val) => (
    selectors.requests.errorStatus(val, { requestKey: RequestKeys.fetchSubmission })
  )),
  hasGradingProgress: useSelector(selectors.grading.hasGradingProgress),
  isLoaded: useSelector((val) => (
    selectors.requests.isCompleted(val, { requestKey: RequestKeys.fetchSubmission })
  )),
  isModalOpen: useSelector(selectors.problemSteps.reviewModalOpen),
  submissions: useSelector(selectors.submissions.allSubmissions),
  currentSubmission: useSelector(selectors.grading.current),
});

export const rendererHooks = ({
  dispatch,
}) => {
  const [show, setShow] = state.showConfirmCloseReviewGrade(false);

  const {
    errorStatus,
    hasGradingProgress,
    isLoaded,
    isModalOpen,
    submissions,
    currentSubmission,
  } = module.reduxValues();

  const onClose = () => {
    if (hasGradingProgress) {
      setShow(true);
    } else {
      dispatch(thunkActions.app.cancelReview());
      dispatch(actions.problemSteps.setOpenReviewModal(false));
      dispatch(actions.problemSteps.setSelectedSubmissionId(null));
    }
  };

  return {
    onClose,
    isLoading: !(errorStatus || isLoaded),
    isModalOpen,
    errorStatus,
    submissions,
    currentSubmission,
    closeConfirmModalProps: {
      isOpen: show,
      onCancel: () => setShow(false),
      onConfirm: () => {
        setShow(false);
        dispatch(actions.problemSteps.setOpenReviewModal(false));
        dispatch(thunkActions.app.cancelReview());
      },
    },
  };
};
