import React from 'react';
import PropTypes from 'prop-types';

import {
  ActionRow,
  AlertModal,
  Button,
} from '@edx/paragon';

export const DemoAlert = ({
  isOpen,
  onClose,
}) => (
  <AlertModal
    title="Demo Submit Prevented"
    isOpen={isOpen}
    onClose={onClose}
    footerNode={(
      <ActionRow>
        <Button variant="primary" onClick={onClose}>Confirm</Button>
      </ActionRow>
    )}
  >
    <p>Grade submission is disabled in the Demo mode of the new ORA Staff Grader.</p>
  </AlertModal>
);
DemoAlert.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DemoAlert;
