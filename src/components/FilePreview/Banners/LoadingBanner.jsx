import React from 'react';

import { Alert, Spinner } from '@edx/paragon';

export const LoadingBanner = () => (
  <Alert variant="info">
    <Spinner animation="border" className="d-flex m-auto" />
  </Alert>
);

LoadingBanner.defaultProps = {};
LoadingBanner.propTypes = {};

export default LoadingBanner;
