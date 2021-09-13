import React from 'react';
import PropTypes from 'prop-types';

import { Badge } from '@edx/paragon';

import { gradingStatuses as statuses } from 'data/services/lms/constants';

/**
 * <StatusBadge />
 */
export const StatusBadge = ({ status }) => {
  if (status === statuses.ungraded) {
    return (<Badge variant="primary">Ungraded</Badge>);
  }
  if (status === statuses.locked) {
    return (<Badge variant="light">Grading in progress</Badge>);
  }
  if (status === statuses.graded) {
    return (<Badge variant="success">Grading Complete</Badge>);
  }
  return (<Badge>{status}</Badge>);
};
StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};

export default StatusBadge;
