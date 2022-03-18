import React from 'react';
import PropTypes from 'prop-types';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import {
  ActionRow,
  AlertModal,
  Button,
} from '@edx/paragon';

import messages from './messages';

export const DemoAlert = ({
  intl: { formatMessage },
  isOpen,
  onClose,
}) => (
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
DemoAlert.propTypes = {
  intl: intlShape.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default injectIntl(DemoAlert);
