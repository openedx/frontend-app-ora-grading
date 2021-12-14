import React from 'react';
import PropTypes from 'prop-types';

const ImageRenderer = ({ url, fileName }) => (<img alt={fileName} className="image-renderer" src={url} />);

ImageRenderer.defaultProps = {
  fileName: '',
};

ImageRenderer.propTypes = {
  url: PropTypes.string.isRequired,
  fileName: PropTypes.string,
};

export default ImageRenderer;
