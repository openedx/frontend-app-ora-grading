import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { FormattedMessage } from '@edx/frontend-platform/i18n';

import { selectors } from 'data/redux';
import { RequestKeys, ErrorStatuses } from 'data/constants/requests';

import messages from './messages';

import ReviewError from './ReviewError';

/**
 * <LockErrors />
 */
export class LockErrors extends React.Component {
  get errorProp() {
    if (this.props.errorStatus === ErrorStatuses.forbidden) {
      return {
        heading: messages.errorLockContestedHeading,
        message: messages.errorLockContested,
      };
    }

    return {
      heading: messages.errorLockBadRequestHeading,
      message: messages.errorLockBadRequest,
    };
  }

  render() {
    if (!this.props.isFailed) { return null; }
    const { heading, message } = this.errorProp;
    return (
      <ReviewError
        key="lockFailed"
        headingMessage={heading}
      >
        <FormattedMessage {...message} />
      </ReviewError>
    );
  }
}
LockErrors.defaultProps = {
  errorStatus: undefined,
};
LockErrors.propTypes = {
  // redux
  isFailed: PropTypes.bool.isRequired,
  errorStatus: PropTypes.number,
};

export const mapStateToProps = (state) => ({
  isFailed: selectors.requests.isFailed(state, {
    requestKey: RequestKeys.setLock,
  }),
  errorStatus: selectors.requests.errorStatus(state, {
    requestKey: RequestKeys.setLock,
  }),
});

export const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(LockErrors);
