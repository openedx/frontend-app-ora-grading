import React from 'react';
import PropTypes from 'prop-types';

import { AlertModal, ActionRow, Button } from '@edx/paragon';
import { nullMethod } from 'hooks';

export const ConfirmModal = ({
  title,
  isOpen,
  onCancel,
  cancelText,
  onConfirm,
  confirmText,
  content,
}) => (
  <AlertModal
    className="confirm-modal"
    title={title}
    onClose={nullMethod}
    isOpen={isOpen}
    footerNode={(
      <ActionRow>
        <Button
          variant="tertiary"
          onClick={onCancel}
        >
          {cancelText}
        </Button>
        <Button variant="primary" onClick={onConfirm}>{confirmText}</Button>
      </ActionRow>
    )}
  >
    <p>{content}</p>
  </AlertModal>
);
ConfirmModal.defaultProps = {
  isOpen: false,
};
ConfirmModal.propTypes = {
  isOpen: PropTypes.bool,
  title: PropTypes.string.isRequired,
  cancelText: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  confirmText: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

export default ConfirmModal;
