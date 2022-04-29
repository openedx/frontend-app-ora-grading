import React from 'react';
import PropTypes from 'prop-types';
import { rendererHooks } from './textHooks';

const TXTRenderer = ({ url, onError, onSuccess }) => {
  const { content } = rendererHooks({ url, onError, onSuccess });
  return (
    <pre className="txt-renderer">
      {content}
    </pre>
  );
};

TXTRenderer.defaultProps = {};

TXTRenderer.propTypes = {
  url: PropTypes.string.isRequired,
  onError: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default TXTRenderer;
