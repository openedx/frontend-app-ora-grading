import React from 'react';
import { useSelector } from 'react-redux';

import { StrictDict } from 'utils';
import { selectors, thunkActions } from 'data/redux';
import { RequestKeys } from 'data/constants/requests';

import * as module from './hooks';

export const ButtonStates = StrictDict({
  default: 'default',
  pending: 'pending',
  complete: 'complete',
  error: 'error',
});

export const state = {
  showDemoAlert: (val) => React.useState(val),
};

export const reduxValues = () => ({
  criteriaIndices: useSelector(selectors.app.rubric.criteriaIndices),
  gradeIsPending: useSelector(
    val => selectors.requests.isPending(val, { requestKey: RequestKeys.submitGrade }),
  ),
  isCompleted: useSelector(
    val => selectors.requests.isCompleted(val, { requestKey: RequestKeys.submitGrade }),
  ),
  isEnabled: useSelector(selectors.app.isEnabled),
  isGrading: useSelector(selectors.grading.selected.isGrading),
  lockIsPending: useSelector(
    val => selectors.requests.isPending(val, { requestKey: RequestKeys.setLock }),
  ),
});

export const rendererHooks = ({
  dispatch,
}) => {
  const [showDemoAlert, setShowDemoAlert] = module.state.showDemoAlert(false);
  const {
    criteriaIndices,
    gradeIsPending,
    isCompleted,
    isEnabled,
    isGrading,
    lockIsPending,
  } = module.reduxValues();

  const isPending = (gradeIsPending || lockIsPending);
  let submitButtonState;
  if (isCompleted) {
    submitButtonState = ButtonStates.complete;
  } else if (isPending) {
    submitButtonState = ButtonStates.pending;
  } else {
    submitButtonState = ButtonStates.default;
  }

  const criteria = criteriaIndices.map((index) => ({
    isGrading,
    key: index,
    orderNum: index,
  }));

  return {
    criteria,
    showFooter: isGrading || isCompleted,
    buttonProps: {
      onClick: () => (
        !isEnabled
          ? setShowDemoAlert(true)
          : dispatch(thunkActions.grading.submitGrade())
      ),
      state: submitButtonState,
      disabledStates: [ButtonStates.pending, ButtonStates.complete],
    },
    demoAlertProps: {
      isOpen: showDemoAlert,
      onClose: () => setShowDemoAlert(false),
    },
  };
};
