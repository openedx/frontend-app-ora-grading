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

export const StartGradingButton = ({
  gradeStatus,
  startGrading,
  stopGrading,
}) => {
  const buttonArgs = {
    [statuses.ungraded]: {
      label: 'Start Grading',
      iconAfter: Highlight,
      onClick: startGrading,
    },
    [statuses.graded]: {
      label: 'Override grade',
      iconAfter: Highlight,
      onClick: startGrading,
    },
    [statuses.inProgress]: {
      label: 'Stop grading this response',
      iconAfter: Cancel,
      onClick: stopGrading,
    },
  };
  if (gradeStatus === statuses.locked) {
    return null;
  }
  const args = buttonArgs[gradeStatus];
  return (
    <Button
      variant="primary"
      iconAfter={args.iconAfter}
      onClick={args.onClick}
    >
      {args.label}
    </Button>
  );
};
StartGradingButton.propTypes = {
  gradeStatus: PropTypes.string.isRequired,
  startGrading: PropTypes.func.isRequired,
  stopGrading: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
  gradeStatus: selectors.grading.selected.gradeStatus(state),
});

export const mapDispatchToProps = {
  toggleShowRubric: actions.app.toggleShowRubric,
  startGrading: thunkActions.grading.startGrading,
  // TODO: fix
  stopGrading: thunkActions.grading.startGrading,
};

export default connect(mapStateToProps, mapDispatchToProps)(StartGradingButton);
