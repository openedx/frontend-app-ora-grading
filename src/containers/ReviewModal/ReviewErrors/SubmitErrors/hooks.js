import { useSelector } from 'react-redux';

import { actions, selectors, thunkActions } from 'data/redux';
import { RequestKeys, ErrorStatuses } from 'data/constants/requests';

import messages from './messages';
import * as module from './hooks';

const requestKey = RequestKeys.submitGrade;

export const badRequestError = ({ dispatch }) => ({
  confirm: {
    onClick: () => dispatch(thunkActions.grading.submitGrade()),
    message: messages.resubmitGrade,
  },
  headingMessage: messages.gradeNotSubmittedHeading,
  contentMessage: messages.gradeNotSubmittedContent,
});

export const conflictError = () => ({
  headingMessage: messages.errorSubmittingGradeHeading,
  contentMessage: messages.errorSubmittingGradeContent,
});

export const defaultError = module.badRequestError;

export const errorProps = ({
  dispatch,
  errorStatus,
}) => {
  const errors = {
    [ErrorStatuses.badRequest]: module.badRequestError({ dispatch }),
    [ErrorStatuses.conflict]: module.conflictError({ dispatch }),
    default: module.defaultError({ dispatch }),
  };
  // TODO: Network-Log an error here for unhandled error type
  // if (errors[errorStatus] === undefined) { }
  return errors[errorStatus] || errors.default;
};

export const errorStatusSelector = (state) => selectors.requests.errorStatus(state, { requestKey });

export const rendererHooks = ({
  dispatch,
  intl,
}) => {
  const errorStatus = useSelector(module.errorStatusSelector);

  if (!errorStatus) {
    return { show: false };
  }

  const error = module.errorProps({ dispatch, errorStatus });

  return {
    show: true,
    reviewActions: {
      cancel: {
        onClick: () => dispatch(actions.requests.clearRequest({ requestKey })),
        message: messages.dismiss,
      },
      confirm: error.confirm,
    },
    headingMessage: error.headingMessage,
    content: intl.formatMessage(error.contentMessage),
  };
};
