import React from 'react';
import PropTypes from 'prop-types';

import { useIntl } from '@edx/frontend-platform/i18n';

import ConfirmModal from 'components/ConfirmModal';
import messages from './messages';

export const StopGradingConfirmModal = ({
  isOpen,
  isOverride,
  onCancel,
  onConfirm,
}) => {
  const intl = useIntl();
  return (
    <ConfirmModal
      title={intl.formatMessage(isOverride
        ? messages.confirmStopOverrideTitle
        : messages.confirmStopGradingTitle)}
      content={intl.formatMessage(messages.confirmStopWarning)}
      cancelText={intl.formatMessage(messages.goBack)}
      confirmText={intl.formatMessage(isOverride
        ? messages.confirmStopOverrideAction
        : messages.confirmStopGradingAction)}
      onCancel={onCancel}
      onConfirm={onConfirm}
      isOpen={isOpen}
    />
  );
};
StopGradingConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isOverride: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default StopGradingConfirmModal;
