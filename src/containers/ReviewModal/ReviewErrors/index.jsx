import React from 'react';

import FetchErrors from './FetchErrors';
import SubmitErrors from './SubmitErrors';

/**
 * <ReviewErrors />
 */
export const ReviewErrors = () => (
  <>
    <FetchErrors />
    <SubmitErrors />
  </>
);
ReviewErrors.defaultProps = {
};
ReviewErrors.propTypes = {
};

export default ReviewErrors;
