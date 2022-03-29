import React from 'react';

import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { Alert } from '@edx/paragon';
import { Info } from '@edx/paragon/icons';

import messages from './messages';

/**
 * <DemoErrors />
 */
export const DemoErrors = () => {
  if (!process.env.REACT_APP_NOT_ENABLED) { return null; }
  return (
    <Alert
      className="mb-0 rounded-0"
      variant="warning"
      icon={Info}
    >
      <Alert.Heading>
        <FormattedMessage {...messages.demoModeHeading} />
      </Alert.Heading>
      <p><FormattedMessage {...messages.demoModeMessage} /></p>
    </Alert>
  );
};

export default DemoErrors;
