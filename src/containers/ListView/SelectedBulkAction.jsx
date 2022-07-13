import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@edx/paragon';

import { FormattedMessage } from '@edx/frontend-platform/i18n';

import messages from './messages';

export const SelectedBulkAction = ({ selectedFlatRows, handleClick }) => (
  <Button
    onClick={handleClick(selectedFlatRows)}
    variant="primary"
    className="view-selected-responses-btn"
  >
    <FormattedMessage {...messages.viewSelectedResponses} values={{ value: selectedFlatRows.length }} />
  </Button>
);

SelectedBulkAction.defaultProps = {
  selectedFlatRows: [],
};
SelectedBulkAction.propTypes = {
  selectedFlatRows: PropTypes.arrayOf(PropTypes.object),

  handleClick: PropTypes.func.isRequired,
};
export default SelectedBulkAction;
