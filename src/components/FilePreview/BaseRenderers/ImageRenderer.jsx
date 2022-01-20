import React from 'react';
import PropTypes from 'prop-types';

const ImageRenderer = ({
  url, fileName, onError, onSuccess,
}) => (
  <img
    alt={fileName}
    className="image-renderer"
    src={url}
    onError={onError}
    onLoad={onSuccess}
  />
);

ImageRenderer.defaultProps = {
  fileName: '',
};

ImageRenderer.propTypes = {
  url: PropTypes.string.isRequired,
  fileName: PropTypes.string,
  onError: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default ImageRenderer;
