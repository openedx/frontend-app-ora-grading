import React from 'react';
import PropTypes from 'prop-types';

import InfoPopover from 'components/InfoPopover';

export const FilePopoverCell = ({ row: { original } }) => (
  <InfoPopover>
    <div className="help-popover-option">
      <strong>File Name</strong>
      <br />
      {original.name}
    </div>
    <div className="help-popover-option">
      <strong>Description</strong>
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
