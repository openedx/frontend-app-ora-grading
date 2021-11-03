import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from '@edx/frontend-platform/i18n';

import InfoPopover from 'components/InfoPopover';

import messages from './messages';

export const FilePopoverCell = ({ row: { original } }) => (
  <InfoPopover>
    <div className="help-popover-option">
      <strong><FormattedMessage {...messages.filePopoverNameTitle} /></strong>
      <br />
      {original.name}
    </div>
    <div className="help-popover-option">
      <strong><FormattedMessage {...messages.filePopoverDescriptionTitle} /></strong>
      <br />
      {original.description}
    </div>
  </InfoPopover>
);

FilePopoverCell.defaultProps = {
  row: {
    original: {},
  },
};

FilePopoverCell.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      downloadUrl: PropTypes.string,
    }),
  }),
};

export default FilePopoverCell;
