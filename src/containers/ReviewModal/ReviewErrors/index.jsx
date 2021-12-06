import React from 'react';

import FetchErrors from './FetchErrors';
import LockErrors from './LockErrors';
import SubmitErrors from './SubmitErrors';

/**
 * <ReviewErrors />
 */
export const ReviewErrors = () => (
  <>
    <FetchErrors />
    <SubmitErrors />
    <LockErrors />
  </>
);
ReviewErrors.defaultProps = {
};
ReviewErrors.propTypes = {
};

export default ReviewErrors;
