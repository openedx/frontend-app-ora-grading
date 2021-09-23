import React from 'react';
import PropTypes from 'prop-types';

import { Badge } from '@edx/paragon';

import {
  gradingStatuses as statuses,
  gradingStatusDisplay as statusDisplay,
} from 'data/services/lms/constants';

export const statusVariants = {
  [statuses.ungraded]: 'primary',
  [statuses.locked]: 'light',
  [statuses.graded]: 'success',
  [statuses.inProgress]: 'warning',
};

/**
 * <StatusBadge />
 */
export const StatusBadge = ({ className, status }) => {
  if (statusVariants[status] === undefined) {
    return null;
  }
  return (
    <Badge
      className={className}
      variant={statusVariants[status]}
    >
      {statusDisplay[status]}
    </Badge>
  );
};
StatusBadge.defaultProps = {
  className: '',
};
StatusBadge.propTypes = {
  className: PropTypes.string,
  status: PropTypes.string.isRequired,
};

export default StatusBadge;
