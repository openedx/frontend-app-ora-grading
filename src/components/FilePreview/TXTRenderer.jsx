import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { get } from 'data/services/lms/utils';

const TXTRenderer = ({ url }) => {
  const [content, setContent] = useState('');
  useMemo(() => {
    get(url).then(({ data }) => setContent(data));
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
};

export default TXTRenderer;
