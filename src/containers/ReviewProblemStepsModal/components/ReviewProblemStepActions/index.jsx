import React from 'react';

import { ActionRow } from '@openedx/paragon';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import StatusBadge from 'components/StatusBadge';
import SubmissionNavigation from 'containers/ReviewActions/components/SubmissionNavigation';

import messages from './messages';
import './ReviewProblemStepActions.scss';

export const ReviewProblemStepActions = ({
  intl,
  fullname,
  username,
  email,
  submissionId,
  submissionDate,
  grade,
  gradingStatus,
}) => (
  <div>
    <ActionRow className="review-actions justify-content-start pl-5">
      <div className="review-actions__info mr-5">
        <h3 className="review-actions__fullname" data-testid="fullname-value">
          {fullname}
        </h3>
        <p data-testid="username-value">{username}</p>
      </div>
      <div className="review-actions__info  mr-5">
        <h4 data-testid="email-title">
          {intl.formatMessage(messages.emailTitle)}
        </h4>
        <p data-testid="email-value">{email}</p>
      </div>
      <div className="review-actions__info  mr-5">
        <h4 data-testid="submission-id-title">
          {intl.formatMessage(messages.submissionIdTitle)}
        </h4>
        <p data-testid="submission-id-value">{submissionId}</p>
      </div>
      <div className="review-actions__info  mr-5">
        <h4 data-testid="submission-date-title">
          {intl.formatMessage(messages.submissionDateTitle)}
        </h4>
        <p data-testid="submission-date-value">{submissionDate}</p>
      </div>
      <div className="review-actions__info  mr-5">
        <h4 data-testid="grade-title">
          {intl.formatMessage(messages.gradeTitle)}
        </h4>
        <p data-testid="grade-value">{grade}</p>
      </div>
      <div className="review-actions__info mr-5">
        <h4 data-testid="grade-status-title">
          {intl.formatMessage(messages.gradingStatus)}
        </h4>
        <p data-testid="grade-status-value">{gradingStatus}</p>
      </div>

      <div className="review-actions__info">
        <h4 data-testid="problem-steps-title">
          {intl.formatMessage(messages.problemStepsTitle)}
        </h4>
        <p>
          <StatusBadge status="graded" title="Training" className="mr-1" />
          <StatusBadge status="ungraded" title="Peers" className="mr-1" />
          <StatusBadge status="graded" title="Self" className="mr-1" />
          <StatusBadge status="graded" title="Staff" className="mr-1" />
        </p>
      </div>
      <div className="review-actions-group">
        <SubmissionNavigation />
      </div>
    </ActionRow>
  </div>
);

ReviewProblemStepActions.propTypes = {
  intl: intlShape.isRequired,
  fullname: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  submissionId: PropTypes.string.isRequired,
  submissionDate: PropTypes.string.isRequired,
  grade: PropTypes.string.isRequired,
  gradingStatus: PropTypes.string.isRequired,
};

export default injectIntl(ReviewProblemStepActions);
