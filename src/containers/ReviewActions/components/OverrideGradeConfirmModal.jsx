import React from 'react';
import PropTypes from 'prop-types';

import ConfirmModal from 'components/ConfirmModal';

export const OverrideGradeConfirmModal = ({
  isOpen,
  onCancel,
  onConfirm,
}) => (
  <ConfirmModal
    title="Are you sure you want to override this grade?"
    content="This cannot be undone.  The learner may have already received their grade"
    cancelText="Go back"
    confirmText="Continue grade override"
    onCancel={onCancel}
    onConfirm={onConfirm}
    isOpen={isOpen}
  />
);
OverrideGradeConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default OverrideGradeConfirmModal;
