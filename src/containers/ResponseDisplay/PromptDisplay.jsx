import React from 'react';
import { Collapsible, Card } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import PropTypes from 'prop-types';
import messages from './messages';

const PromptDisplay = ({
  prompt, className, styling, headerTitle,
}) => {
  const intl = useIntl();
  const msg = intl.formatMessage(messages.promptCollapsibleHeader);
  return (
    <div className={className}>
      <Collapsible
        styling={styling}
        title={headerTitle ? <h3>{msg}</h3> : msg}
      >
        { prompt }
      </Collapsible>
    </div>
  );
};

PromptDisplay.propTypes = {
  prompt: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  styling: PropTypes.string.isRequired,
  headerTitle: PropTypes.bool.isRequired,
};

const SinglePromptDisplay = ({ prompt }) => (
  <PromptDisplay prompt={prompt} className="prompt-display-single" styling="card-lg" headerTitle />
);

SinglePromptDisplay.propTypes = {
  prompt: PropTypes.string.isRequired,
};

const MultiplePromptDisplay = ({ prompt }) => (
  <>
    <PromptDisplay prompt={prompt} className="prompt-display-multiple" styling="basic" headerTitle={false} />
    <Card.Divider />
  </>
);

MultiplePromptDisplay.propTypes = {
  prompt: PropTypes.string.isRequired,
};

export { SinglePromptDisplay, MultiplePromptDisplay };
