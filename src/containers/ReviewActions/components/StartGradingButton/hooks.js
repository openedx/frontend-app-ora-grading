import React from 'react';
import { useSelector } from 'react-redux';

import { Cancel, Highlight } from '@edx/paragon/icons';

import { selectors, thunkActions } from 'data/redux';
import { RequestKeys } from 'data/constants/requests';
import { gradingStatuses as statuses } from 'data/services/lms/constants';
import { StrictDict } from 'utils';
import * as module from './hooks';

import messages from './messages';

export const buttonConfig = {
  [statuses.ungraded]: {
    label: messages.startGrading,
    iconAfter: Highlight,
  },
  [statuses.graded]: {
    label: messages.overrideGrade,
    iconAfter: Highlight,
  },
  [statuses.inProgress]: {
    label: messages.stopGrading,
    iconAfter: Cancel,
  },
};

export const state = StrictDict({
  showConfirmStopGrading: (val) => React.useState(val),
  showConfirmOverrideGrade: (val) => React.useState(val),
});

export const reduxValues = () => ({
  gradeStatus: useSelector(selectors.grading.selected.gradeStatus),
  gradingStatus: useSelector(selectors.grading.selected.gradingStatus),
  gradeIsPending: useSelector((reduxState) => (
    selectors.requests.isPending(reduxState, { requestKey: RequestKeys.submitGrade })
  )),
  lockIsPending: useSelector((reduxState) => (
    selectors.requests.isPending(reduxState, { requestKey: RequestKeys.setLock })
  )),
});

export const buttonArgs = ({
  intl,
  dispatch,
  overrideGradeState,
  stopGradingState,
  gradingStatus,
  isPending,
}) => ({
  iconAfter: module.buttonConfig[gradingStatus].iconAfter,
  children: intl.formatMessage(module.buttonConfig[gradingStatus].label),
  disabled: isPending,
  onClick: () => {
    if (gradingStatus === statuses.inProgress) {
      stopGradingState.setShow(true);
    } else if (gradingStatus === statuses.graded) {
      overrideGradeState.setShow(true);
    } else {
      dispatch(thunkActions.grading.startGrading());
    }
  },
});

export const overrideGradeArgs = ({
  dispatch,
  overrideGradeState: { show, setShow },
}) => ({
  isOpen: show,
  onCancel: () => setShow(false),
  onConfirm: () => {
    setShow(false);
    dispatch(thunkActions.grading.startGrading());
  },
});

export const stopGradingArgs = ({
  dispatch,
  isGraded,
  stopGradingState: { show, setShow },
}) => ({
  isOpen: show,
  onCancel: () => setShow(false),
  onConfirm: () => {
    setShow(false);
    dispatch(thunkActions.grading.cancelGrading());
  },
  isOverride: isGraded,
});

export const buttonHooks = ({
  dispatch,
  intl,
}) => {
  const showState = {
    stopGrading: state.showConfirmStopGrading(false),
    overrideGrade: state.showConfirmOverrideGrade(false),
  };
  const overrideGradeState = {
    show: showState.overrideGrade[0],
    setShow: showState.overrideGrade[1],
  };
  const stopGradingState = {
    show: showState.stopGrading[0],
    setShow: showState.stopGrading[1],
  };

  const {
    gradeStatus,
    gradingStatus,
    gradeIsPending,
    lockIsPending,
  } = module.reduxValues();

  const hide = gradingStatus === statuses.locked;
  if (hide) {
    return { hide };
  }
  return {
    hide,
    overrideGradeArgs: module.overrideGradeArgs({
      dispatch,
      overrideGradeState,
    }),
    stopGradingArgs: module.stopGradingArgs({
      dispatch,
      stopGradingState,
      isGraded: gradeStatus === statuses.graded,
    }),
    buttonArgs: module.buttonArgs({
      intl,
      dispatch,
      stopGradingState,
      overrideGradeState,
      isPending: lockIsPending || gradeIsPending,
      gradingStatus,
    }),
  };
};
