import React from 'react';
import PropTypes from 'prop-types';

import { Alert, Button } from '@edx/paragon';
import { Info } from '@edx/paragon/icons';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

const messageShape = PropTypes.shape({
  id: PropTypes.string,
  defaultMessage: PropTypes.string,
});

export const ErrorBanner = ({ actions, headingMessage, children }) => {
  const actionButtons = actions.map(action => (
    <Button key={action.id} onClick={action.onClick} variant="outline-primary">
      <FormattedMessage {...action.message} />
    </Button>
  ));
  return (
    <Alert variant="danger" icon={Info} actions={actionButtons}>
      <Alert.Heading>
        <FormattedMessage {...headingMessage} />
      </Alert.Heading>
      {children}
    </Alert>
  );
};
ErrorBanner.defaultProps = {
  actions: [],
  children: null,
};
ErrorBanner.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      onClick: PropTypes.func,
      message: messageShape,
    }),
  ),
  headingMessage: messageShape.isRequired,
  children: PropTypes.node,
};

export default ErrorBanner;
