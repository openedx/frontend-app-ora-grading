import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { FormattedMessage } from '@edx/frontend-platform/i18n';

import { actions, selectors, thunkActions } from 'data/redux';
import { RequestKeys, ErrorStatuses } from 'data/constants/requests';

import messages from './messages';

import ReviewError from './ReviewError';

/**
 * <SubmitErrors />
 */
export class SubmitErrors extends React.Component {
  constructor(props) {
    super(props);
    this.dismissError = this.dismissError.bind(this);
  }

  get gradeNotSubmitted() {
    return {
      confirm: { onClick: this.props.resubmit, message: messages.resubmitGrade },
      headingMessage: messages.gradeNotSubmittedHeading,
      contentMessage: messages.gradeNotSubmittedContent,
    };
  }

  get errorSubmittingGrade() {
    return {
      headingMessage: messages.errorSubmittingGradeHeading,
      contentMessage: messages.errorSubmittingGradeContent,
    };
  }

  get errorProps() {
    if (this.props.errorStatus === ErrorStatuses.badRequest) {
      return this.gradeNotSubmitted;
    }
    if (this.props.errorStatus === ErrorStatuses.conflict) {
      return this.errorSubmittingGrade;
    }
    // TODO: Network-Log an error here for unhandled error type
    return this.gradeNotSubmitted;
  }

  dismissError() {
    this.props.clearRequest({ requestKey: RequestKeys.submitGrade });
  }

  render() {
    if (!this.props.errorStatus) {
      return null;
    }
    const props = this.errorProps;

    return (
      <ReviewError
        actions={{
          cancel: { onClick: this.dismissError, message: messages.dismiss },
          confirm: props.confirm,
        }}
        headingMessage={props.headingMessage}
      >
        <FormattedMessage {...props.contentMessage} />
      </ReviewError>
    );
  }
}
SubmitErrors.defaultProps = {
  errorStatus: undefined,
};
SubmitErrors.propTypes = {
  // redux
  clearRequest: PropTypes.func.isRequired,
  errorStatus: PropTypes.number,
  resubmit: PropTypes.func.isRequired,
};

const requestKey = RequestKeys.submitGrade;
export const mapStateToProps = (state) => ({
  errorStatus: selectors.requests.errorStatus(state, { requestKey }),
});

export const mapDispatchToProps = {
  clearRequest: actions.requests.clearRequest,
  resubmit: thunkActions.grading.submitGrade,
};

export default connect(mapStateToProps, mapDispatchToProps)(SubmitErrors);
