import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ActionRow, Button } from '@edx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import { actions, selectors } from 'data/redux';

import StatusBadge from 'components/StatusBadge';
import StartGradingButton from './components/StartGradingButton';
import SubmissionNavigation from './components/SubmissionNavigation';
import messages from './messages';

import './ReviewActions.scss';

export const ReviewActions = ({
  gradingStatus,
  toggleShowRubric,
  points: { pointsEarned, pointsPossible },
  showRubric,
  username,
}) => (
  <div>
    <ActionRow className="review-actions">
      <span className="review-actions-username">
        <span className="lead">{username}</span>
        <StatusBadge className="review-actions-status mr-3" status={gradingStatus} />
        <span className="small">
          {pointsEarned && (
            <FormattedMessage
              {...messages.pointsDisplay}
              values={{ pointsEarned, pointsPossible }}
            />
          )}
        </span>
      </span>
      <div className="review-actions-group">
        <Button variant="outline-primary" onClick={toggleShowRubric}>
          <FormattedMessage {...(showRubric ? messages.hideRubric : messages.showRubric)} />
        </Button>
        <StartGradingButton />
        <SubmissionNavigation />
      </div>
    </ActionRow>
  </div>
);
ReviewActions.propTypes = {
  gradingStatus: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  points: PropTypes.shape({
    pointsEarned: PropTypes.number,
    pointsPossible: PropTypes.number,
  }).isRequired,
  showRubric: PropTypes.bool.isRequired,
  toggleShowRubric: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
  username: selectors.grading.selected.username(state),
  gradingStatus: selectors.grading.selected.gradingStatus(state),
  points: selectors.grading.selected.points(state),
  showRubric: selectors.app.showRubric(state),
});

export const mapDispatchToProps = {
  toggleShowRubric: actions.app.toggleShowRubric,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewActions);
