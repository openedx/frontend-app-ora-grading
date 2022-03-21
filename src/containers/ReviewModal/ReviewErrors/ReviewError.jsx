import React from 'react';
import PropTypes from 'prop-types';

import { Alert, Button } from '@edx/paragon';
import { Info } from '@edx/paragon/icons';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

const messageShape = PropTypes.shape({
  id: PropTypes.string,
  defaultMessage: PropTypes.string,
});

const ReviewError = ({
  actions: {
    cancel,
    confirm,
  },
  className,
  headingMessage,
  variant,
  children,
}) => {
  const actions = [];
  if (cancel) {
    actions.push((
      <Button key="cancel" onClick={cancel.onClick} variant="outline-primary">
        <FormattedMessage {...cancel.message} />
      </Button>
    ));
  }
  if (confirm) {
    actions.push((
      <Button key="confirm" onClick={confirm.onClick}>
        <FormattedMessage {...confirm.message} />
      </Button>
    ));
  }
  return (
    <Alert
      variant={variant}
      icon={Info}
      className={className}
      actions={actions}
    >
      <Alert.Heading><FormattedMessage {...headingMessage} /></Alert.Heading>
      <p>{children}</p>
    </Alert>
  );
};
ReviewError.defaultProps = {
  actions: {},
  className: '',
  variant: 'danger',
};
ReviewError.propTypes = {
  actions: PropTypes.shape({
    cancel: PropTypes.shape({
      onClick: PropTypes.func,
      message: messageShape,
    }),
    confirm: PropTypes.shape({
      onClick: PropTypes.func,
      message: messageShape,
    }),
  }),
  className: PropTypes.string,
  headingMessage: messageShape.isRequired,
  variant: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default ReviewError;
