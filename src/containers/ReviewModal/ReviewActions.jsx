import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  ActionRow,
  Button,
} from '@edx/paragon';

import selectors from 'data/selectors';

import StatusBadge from 'components/StatusBadge';
import './ReviewModal.scss';

export const ReviewActions = ({ gradeStatus, username }) => (
  <div className="review-actions">
    <ActionRow>
      <span className="review-actions-username">{username}</span>
      <StatusBadge className="review-actions-status" status={gradeStatus} />
      <ActionRow.Spacer />
      <Button>Show Rubric</Button>
    </ActionRow>
  </div>
);
ReviewActions.propTypes = {
  gradeStatus: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
};

export const mapStateToProps = (state) => ({
  username: selectors.grading.selected.username(state),
  gradeStatus: selectors.grading.selected.gradeStatus(state),
});

export const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewActions);
