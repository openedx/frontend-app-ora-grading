import React from 'react';
import { useDispatch } from 'react-redux';

import { useIntl } from '@edx/frontend-platform/i18n';

import { rendererHooks } from './hooks';

import ReviewError from '../ReviewError';

/**
 * <SubmitErrors />
 */
export const SubmitErrors = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const {
    show,
    reviewActions,
    headingMessage,
    content,
  } = rendererHooks({ dispatch, intl });
  if (!show) { return null; }
  return (
    <ReviewError
      actions={reviewActions}
      headingMessage={headingMessage}
    >
      {content}
    </ReviewError>
  );
};

export default SubmitErrors;
