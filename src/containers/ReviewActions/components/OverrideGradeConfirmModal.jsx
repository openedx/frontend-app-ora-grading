import React from 'react';
import PropTypes from 'prop-types';

import { useIntl } from '@edx/frontend-platform/i18n';

import ConfirmModal from 'components/ConfirmModal';
import messages from './messages';

export const OverrideGradeConfirmModal = (
  {
    isOpen,
    onCancel,
    onConfirm,
  },
) => {
  const intl = useIntl();

  return (
    <ConfirmModal
      title={intl.formatMessage(messages.overrideConfirmTitle)}
      content={intl.formatMessage(messages.overrideConfirmWarning)}
      cancelText={intl.formatMessage(messages.goBack)}
      confirmText={intl.formatMessage(messages.overrideConfirmContinue)}
      onCancel={onCancel}
      onConfirm={onConfirm}
      isOpen={isOpen}
    />
  );
};
OverrideGradeConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default OverrideGradeConfirmModal;
