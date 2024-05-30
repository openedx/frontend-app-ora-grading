import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@openedx/paragon';

import { FormattedMessage } from '@edx/frontend-platform/i18n';

import messages from './messages';

export const TableAction = ({ tableInstance, handleClick }) => (
  <Button
    onClick={handleClick(tableInstance.rows)}
    variant="primary"
    className="view-all-responses-btn"
    disabled={tableInstance.rows.length === 0}
  >
    <FormattedMessage {...messages.viewAllResponses} />
  </Button>
);

TableAction.defaultProps = {
  tableInstance: {
    rows: [],
  },
};
TableAction.propTypes = {
  tableInstance: PropTypes.shape({
    rows: PropTypes.arrayOf(PropTypes.object),
  }),
  handleClick: PropTypes.func.isRequired,
};
export default TableAction;
