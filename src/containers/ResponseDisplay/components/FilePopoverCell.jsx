import React from 'react';
import PropTypes from 'prop-types';

import InfoPopover from '@src/components/InfoPopover';
import FilePopoverContent from '@src/components/FilePopoverContent';

export const FilePopoverCell = ({ row: { original } }) => (
  <InfoPopover>
    <FilePopoverContent {...original} />
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
      downloadURL: PropTypes.string,
    }),
  }),
};

export default FilePopoverCell;
