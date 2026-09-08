import React from 'react';
import { useSelector } from 'react-redux';

import { StrictDict } from 'utils';
import { selectors, thunkActions } from 'data/redux';
import { RequestKeys } from 'data/constants/requests';
import * as module from './hooks';

export const state = StrictDict({
  showConfirmCloseReviewGrade: (val) => React.useState(val),
});

export const reduxValues = () => ({
  errorStatus: useSelector((val) => (
    selectors.requests.errorStatus(val, { requestKey: RequestKeys.fetchSubmission })
  )),
  hasGradingProgress: useSelector(selectors.grading.hasGradingProgress),
  isLoaded: useSelector((val) => (
    selectors.requests.isCompleted(val, { requestKey: RequestKeys.fetchSubmission })
  )),
  isOpen: useSelector(selectors.app.showReview),
  oraName: useSelector(selectors.app.ora.name),
});

export const rendererHooks = ({
  dispatch,
}) => {
  const [show, setShow] = state.showConfirmCloseReviewGrade(false);

  const {
    errorStatus,
    hasGradingProgress,
    isLoaded,
    isOpen,
    oraName,
  } = module.reduxValues();

  const onClose = () => {
    if (hasGradingProgress) {
      setShow(true);
    } else {
      dispatch(thunkActions.app.cancelReview());
    }
  };

  return {
    onClose,
    isLoading: !(errorStatus || isLoaded),
    title: oraName,
    isOpen,
    closeConfirmModalProps: {
      isOpen: show,
      onCancel: () => setShow(false),
      onConfirm: () => {
        setShow(false);
        dispatch(thunkActions.app.cancelReview());
      },
    },
  };
};
