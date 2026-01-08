import React from 'react';
import { Collapsible } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import PropTypes from 'prop-types';
import messages from './messages';

const PromptDisplay = ({
  prompt,
}) => {
  const intl = useIntl();
  const msg = intl.formatMessage(messages.promptCollapsibleHeader);
  return (
    <div className="prompt-display">
      <Collapsible
        defaultOpen
        styling="card-lg"
        title={<h3>{msg}</h3>}
      >
        { prompt }
      </Collapsible>
    </div>
  );
};

PromptDisplay.propTypes = {
  prompt: PropTypes.string.isRequired,
};

export default PromptDisplay;
