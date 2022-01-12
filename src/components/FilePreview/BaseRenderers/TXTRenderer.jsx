import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { get } from 'axios';

const TXTRenderer = ({ url, onError, onSuccess }) => {
  const [content, setContent] = useState('');
  useMemo(() => {
    get(url)
      .then(({ data }) => {
        onSuccess();
        setContent(data);
      })
      .catch(({ response }) => onError(response.status));
  }, [url]);

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
