import React from 'react';
import PropTypes from 'prop-types';

import ConfirmModal from 'components/ConfirmModal';

export const StopGradingConfirmModal = ({
  isOpen,
  isOverride,
  onCancel,
  onConfirm,
}) => (
  <ConfirmModal
    title={(isOverride
      ? 'Are you sure you want to stop grade override?'
      : 'Are you sure you want to stop grading this response?'
    )}
    content="Your progress will be lost."
    cancelText="Go back"
    confirmText={(isOverride
      ? 'Stop grade override'
      : 'Cancel grading'
    )}
    onCancel={onCancel}
    onConfirm={onConfirm}
    isOpen={isOpen}
  />
);
StopGradingConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isOverride: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default StopGradingConfirmModal;
