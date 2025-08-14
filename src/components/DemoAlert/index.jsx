import React from 'react';
import PropTypes from 'prop-types';

import { useIntl } from '@edx/frontend-platform/i18n';
import {
  ActionRow,
  AlertModal,
  Button,
} from '@openedx/paragon';

import messages from './messages';

export const DemoAlert = ({
  isOpen,
  onClose,
}) => {
  const { formatMessage } = useIntl();
  return (
    <AlertModal
      title={formatMessage(messages.title)}
      isOpen={isOpen}
      onClose={onClose}
      footerNode={(
        <ActionRow>
          <Button variant="primary" onClick={onClose}>
            {formatMessage(messages.confirm)}
          </Button>
        </ActionRow>
    )}
    >
      <p>{formatMessage(messages.warningMessage)}</p>
    </AlertModal>
  );
};
DemoAlert.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DemoAlert;
