import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Button,
} from '@edx/paragon';
import { Cancel, Highlight } from '@edx/paragon/icons';

import actions from 'data/actions';
import selectors from 'data/selectors';
import thunkActions from 'data/thunkActions';
import { gradingStatuses as statuses } from 'data/services/lms/constants';

const buttonArgs = {
  [statuses.ungraded]: {
    label: 'Start Grading',
    iconAfter: Highlight,
  },
  [statuses.graded]: {
    label: 'Override grade',
    iconAfter: Highlight,
  },
  [statuses.inProgress]: {
    label: 'Stop grading this response',
    iconAfter: Cancel,
  },
};

export const StartGradingButton = ({
  gradingStatus,
  startGrading,
  stopGrading,
}) => {
  if (gradingStatus === statuses.locked) {
    return null;
  }
  const args = buttonArgs[gradingStatus];
  const onClick = ((gradingStatus === statuses.inProgress) ? stopGrading : startGrading);
  return (
    <Button
      variant="primary"
      iconAfter={args.iconAfter}
      onClick={onClick}
    >
      {args.label}
    </Button>
  );
};
StartGradingButton.propTypes = {
  gradingStatus: PropTypes.string.isRequired,
  startGrading: PropTypes.func.isRequired,
  stopGrading: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
  gradingStatus: selectors.grading.selected.gradingStatus(state),
});

export const mapDispatchToProps = {
  toggleShowRubric: actions.app.toggleShowRubric,
  startGrading: thunkActions.grading.startGrading,
  stopGrading: thunkActions.grading.stopGrading,
};

export default connect(mapStateToProps, mapDispatchToProps)(StartGradingButton);
