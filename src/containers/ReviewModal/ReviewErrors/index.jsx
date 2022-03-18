import React from 'react';

import FetchErrors from './FetchErrors';
import LockErrors from './LockErrors';
import SubmitErrors from './SubmitErrors';
import DownloadErrors from './DownloadErrors';
import DemoWarning from './DemoWarning';

/**
 * <ReviewErrors />
 */
export const ReviewErrors = () => (
  <>
    <DemoWarning />
    <FetchErrors />
    <SubmitErrors />
    <LockErrors />
    <DownloadErrors />
  </>
);
ReviewErrors.defaultProps = {
};
ReviewErrors.propTypes = {
};

export default ReviewErrors;
