import React from 'react';
import PropTypes from 'prop-types';

import { Badge } from '@edx/paragon';

import { gradingStatuses as statuses } from 'data/services/lms/constants';

/**
 * <StatusBadge />
 */
export const StatusBadge = ({ className, status }) => {
  if (status === statuses.ungraded) {
    return (<Badge className={className} variant="primary">Ungraded</Badge>);
  }
  if (status === statuses.locked) {
    return (<Badge className={className} variant="light">Grading in progress</Badge>);
  }
  if (status === statuses.graded) {
    return (<Badge className={className} variant="success">Grading Complete</Badge>);
  }
  return (<Badge>{status}</Badge>);
};
StatusBadge.defaultProps = {
  className: '',
};
StatusBadge.propTypes = {
  className: PropTypes.string,
  status: PropTypes.string.isRequired,
};

export default StatusBadge;
