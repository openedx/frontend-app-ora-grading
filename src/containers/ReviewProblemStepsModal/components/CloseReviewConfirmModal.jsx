import React from 'react';
import PropTypes from 'prop-types';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import ConfirmModal from 'components/ConfirmModal';
import messages from './messages';

export const CloseReviewConfirmModal = ({
  intl,
  isOpen,
  onCancel,
  onConfirm,
}) => (
  <ConfirmModal
    title={intl.formatMessage(messages.closeReviewConfirmTitle)}
    content={intl.formatMessage(messages.closeReviewConfirmWarning)}
    cancelText={intl.formatMessage(messages.goBack)}
    confirmText={intl.formatMessage(messages.confirmCloseModalAction)}
    onCancel={onCancel}
    onConfirm={onConfirm}
    isOpen={isOpen}
  />
);
CloseReviewConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  // injected
  intl: intlShape.isRequired,
};

export default injectIntl(CloseReviewConfirmModal);
