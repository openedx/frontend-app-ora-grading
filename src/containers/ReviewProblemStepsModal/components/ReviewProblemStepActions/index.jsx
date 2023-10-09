import React from 'react';

import { ActionRow } from '@edx/paragon';

import StatusBadge from 'components/StatusBadge';
import SubmissionNavigation from 'containers/ReviewActions/components/SubmissionNavigation';

import './ReviewProblemStepActions.scss';

export const ReviewProblemStepActions = () => (
  <div>
    <ActionRow className="review-actions justify-content-start pl-5">
      <div className="review-actions__info mr-5">
        <h3>John Doe</h3>
        <p>jhon_20</p>
      </div>
      <div className="review-actions__info  mr-5">
        <h4>Email</h4>
        <p>jhonvente@email.com</p>
      </div>
      <div className="review-actions__info  mr-5">
        <h4>Submission ID</h4>
        <p>483234704918</p>
      </div>
      <div className="review-actions__info  mr-5">
        <h4>Submission date</h4>
        <p>9/13/2023, 7:13:56 AM</p>
      </div>
      <div className="review-actions__info  mr-5">
        <h4>Grade</h4>
        <p>3/10</p>
      </div>
      <div className="review-actions__info mr-5">
        <h4>Grading status</h4>
        <p>Upgraded</p>
      </div>

      <div className="review-actions__info">
        <h4>Problem steps</h4>
        <p>
          <StatusBadge
            status="graded"
            title="Training"
            className="mr-1"
          />
          <StatusBadge
            status="ungraded"
            title="Peers"
            className="mr-1"
          />
          <StatusBadge
            status="graded"
            title="Self"
            className="mr-1"
          />
          <StatusBadge
            status="graded"
            title="Staff"
            className="mr-1"
          />
        </p>
      </div>
      <div className="review-actions-group">
        <SubmissionNavigation />
      </div>
    </ActionRow>
  </div>
);

export default ReviewProblemStepActions;
