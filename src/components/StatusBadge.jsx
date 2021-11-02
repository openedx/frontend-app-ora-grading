import React from 'react';
import PropTypes from 'prop-types';

import { Badge } from '@edx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import { gradingStatuses as statuses } from 'data/services/lms/constants';
import messages from 'data/services/lms/messages';

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
      <FormattedMessage {...messages[status]} />
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
