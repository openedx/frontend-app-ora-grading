import React from 'react';
import PropTypes from 'prop-types';

import { Spinner } from '@edx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

/**
 * <LoadingMessage />
 */
export const LoadingMessage = ({ message }) => (
  <div className="w-100 h-100 text-center">
    <Spinner animation="border" variant="primary" />
    <h4><FormattedMessage {...message} /></h4>
  </div>
);
LoadingMessage.defaultProps = {
};
LoadingMessage.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string,
    defaultMessage: PropTypes.string,
  }).isRequired,
};

export default LoadingMessage;
