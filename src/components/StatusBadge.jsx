import React from 'react';
import PropTypes from 'prop-types';

import { Badge } from '@edx/paragon';

import { gradingStatuses as statuses } from 'data/services/lms/constants';

/**
 * <StatusBadge />
 */
export const StatusBadge = ({ className, status }) => {
  let args = {
    label: status,
    variant: 'light',
  };
  if (status === statuses.ungraded) {
    args = { label: 'Ungraded', variant: 'primary' };
  }
  if (status === statuses.locked) {
    args = { label: 'Grading in progress', variant: 'light' };
  }
  if (status === statuses.graded) {
    args = { label: 'Grading Complete', variant: 'success' };
  }
  if (status === statuses.inProgress) {
    args = { label: 'Locked by you', variant: 'warning' };
  }
  return (<Badge className={className} variant={args.variant}>{args.label}</Badge>);
};
StatusBadge.defaultProps = {
  className: '',
};
StatusBadge.propTypes = {
  className: PropTypes.string,
  status: PropTypes.string.isRequired,
};

export default StatusBadge;
