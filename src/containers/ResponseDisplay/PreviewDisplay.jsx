import React from 'react';
import PropTypes from 'prop-types';

import { FileRenderer } from 'components/FilePreview';
import { isSupported } from 'components/FilePreview/hooks';

/**
 * <PreviewDisplay />
 */
export const PreviewDisplay = ({ files }) => (
  <div className="preview-display">
    {files.filter(isSupported).map((file) => (
      <FileRenderer key={file.name} file={file} />
    ))}
  </div>
);

PreviewDisplay.defaultProps = {
  files: [],
};
PreviewDisplay.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      downloadUrl: PropTypes.string,
    }),
  ),
};

export default PreviewDisplay;
