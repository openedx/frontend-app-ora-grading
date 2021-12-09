import React from 'react';
import PropTypes from 'prop-types';

import PreviewPanel from 'components/PreviewPanel';

/**
 * <PreviewDisplay />
 */
/* eslint-disable react/prefer-stateless-function */
export const PreviewDisplay = ({ files }) => files.map((file) => (
  <PreviewPanel
    url={file.downloadUrl}
    fileName={file.name}
    key={file.downloadUrl}
  />
));
PreviewDisplay.defaultProps = {
  files: [],
};
PreviewDisplay.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      downloadUrl: PropTypes.string,
    }),
  ),
};

export default PreviewDisplay;
