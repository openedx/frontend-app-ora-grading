import React from 'react';
import PropTypes from 'prop-types';

export const FileExtensionCell = ({ value }) => (
  <div className="text-truncate">{value.split('.')?.pop().toUpperCase()}</div>
);

FileExtensionCell.defaultProps = {};

FileExtensionCell.propTypes = {
  value: PropTypes.string.isRequired,
};

export default FileExtensionCell;
