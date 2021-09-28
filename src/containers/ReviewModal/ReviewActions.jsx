import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  ActionRow,
  Button,
} from '@edx/paragon';

import actions from 'data/actions';
import selectors from 'data/selectors';

import StatusBadge from 'components/StatusBadge';
import StartGradingButton from './StartGradingButton';
import SubmissionNavigation from './SubmissionNavigation';
import './ReviewModal.scss';

export const ReviewActions = ({
  gradingStatus,
  toggleShowRubric,
  showRubric,
  username,
}) => (
  <div>
    <ActionRow className="review-actions">
      <span className="review-actions-username">
        {username}
        <StatusBadge className="review-actions-status" status={gradingStatus} />
      </span>
      <div className="review-actions-group">
        <Button variant="outline-primary" onClick={toggleShowRubric}>
          {showRubric ? 'Hide' : 'Show'} Rubric
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
  showRubric: PropTypes.bool.isRequired,
  toggleShowRubric: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
  username: selectors.grading.selected.username(state),
  gradingStatus: selectors.grading.selected.gradingStatus(state),
  showRubric: selectors.app.showRubric(state),
});

export const mapDispatchToProps = {
  toggleShowRubric: actions.app.toggleShowRubric,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewActions);
