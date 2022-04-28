import React from 'react';
import { useDispatch } from 'react-redux';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import { rendererHooks } from './hooks';

import ReviewError from '../ReviewError';

/**
 * <SubmitErrors />
 */
export const SubmitErrors = ({ intl }) => {
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

SubmitErrors.propTypes = {
  // injected
  intl: intlShape.isRequired,
};

export default injectIntl(SubmitErrors);
