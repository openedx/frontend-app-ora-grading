import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { FormattedMessage } from '@edx/frontend-platform/i18n';

import { selectors, thunkActions } from 'data/redux';
import { RequestKeys } from 'data/constants/requests';

import messages from './messages';

import ReviewError from './ReviewError';

/**
 * <FetchErrors />
 */
export const FetchErrors = ({
  isFailed,
  reload,
}) => isFailed && (
  <ReviewError
    key="loadFailed"
    actions={{
      confirm: {
        onClick: reload,
        message: messages.reloadSubmission,
      },
    }}
    headingMessage={messages.loadErrorHeading}
  >
    <FormattedMessage {...messages.loadErrorMessage} />
  </ReviewError>
);
FetchErrors.defaultProps = {
};
FetchErrors.propTypes = {
  // redux
  isFailed: PropTypes.bool.isRequired,
  reload: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
  isFailed: selectors.requests.isFailed(state, { requestKey: RequestKeys.fetchSubmission }),
});

export const mapDispatchToProps = {
  reload: thunkActions.grading.loadSubmission,
};

export default connect(mapStateToProps, mapDispatchToProps)(FetchErrors);
