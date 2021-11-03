import React from 'react';
import PropTypes from 'prop-types';

export const FileNameCell = ({ value }) => (
  <div className="text-truncate">{value}</div>
);

FileNameCell.defaultProps = {};

FileNameCell.propTypes = {
  value: PropTypes.string.isRequired,
};

export default FileNameCell;
