import React from 'react';

import { FormattedMessage } from '@edx/frontend-platform/i18n';

import messages from './messages';

import ReviewError from './ReviewError';

/**
 * <DemoErrors />
 */
export const DemoErrors = () => {
  if (!process.env.REACT_APP_NOT_ENABLED) { return null; }
  return (
    <ReviewError
      key="demoMode"
      headingMessage={messages.demoModeHeading}
      variant="warning"
    >
      <FormattedMessage {...messages.demoModeMessage} />
    </ReviewError>
  );
};

export default DemoErrors;
