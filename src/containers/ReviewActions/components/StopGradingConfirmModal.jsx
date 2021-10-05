import React from 'react';
import PropTypes from 'prop-types';

import ConfirmModal from 'components/ConfirmModal';

export const StopGradingConfirmModal = ({
  isOpen,
  onCancel,
  onConfirm,
}) => (
  <ConfirmModal
    title="Are you sure you want to stop grading this response?"
    content="Your progress will be lost."
    cancelText="Go back"
    confirmText="Cancel Grading"
    onCancel={onCancel}
    onConfirm={onConfirm}
    isOpen={isOpen}
  />
);
StopGradingConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default StopGradingConfirmModal;
