import React from 'react';
import PropTypes from 'prop-types';

import { Badge } from '@edx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import { StrictDict } from 'utils';
import { gradingStatuses as statuses } from 'data/services/lms/constants';
import messages from 'data/services/lms/messages';

export const buttonVariants = StrictDict({
  primary: 'primary',
  light: 'light',
  success: 'success',
  warning: 'warning',
});

export const statusVariants = StrictDict({
  [statuses.ungraded]: buttonVariants.primary,
  [statuses.locked]: buttonVariants.light,
  [statuses.graded]: buttonVariants.success,
  [statuses.inProgress]: buttonVariants.warning,
});

/**
 * <StatusBadge />
 */
export const StatusBadge = ({ className, status }) => {
  if (!Object.keys(statusVariants).includes(status)) {
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
