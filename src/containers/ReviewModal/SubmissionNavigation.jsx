import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Icon, IconButton } from '@edx/paragon';
import { ChevronLeft, ChevronRight } from '@edx/paragon/icons';

import selectors from 'data/selectors';
import thunkActions from 'data/thunkActions';

/**
 * <SubmissionNavigation />
 */
export const SubmissionNavigation = ({
  hasPrevSubmission,
  hasNextSubmission,
  loadPrev,
  loadNext,
  activeIndex,
  selectionLength,
}) => (
  <span className="submission-navigation">
    <IconButton
      size="inline"
      disabled={!hasPrevSubmission}
      alt="Load previous submission"
      src={ChevronLeft}
      iconAs={Icon}
      onClick={loadPrev}
    />
    <span>{activeIndex + 1} of {selectionLength}</span>
    <IconButton
      size="inline"
      disabled={!hasNextSubmission}
      alt="Load next submission"
      src={ChevronRight}
      iconAs={Icon}
      onClick={loadNext}
    />
  </span>
);
SubmissionNavigation.defaultProps = {
};
SubmissionNavigation.propTypes = {
  hasPrevSubmission: PropTypes.bool.isRequired,
  hasNextSubmission: PropTypes.bool.isRequired,
  loadPrev: PropTypes.func.isRequired,
  loadNext: PropTypes.func.isRequired,
  activeIndex: PropTypes.number.isRequired,
  selectionLength: PropTypes.number.isRequired,
};

export const mapStateToProps = (state) => ({
  hasPrevSubmission: selectors.grading.hasPrevSubmission(state),
  hasNextSubmission: selectors.grading.hasNextSubmission(state),
  activeIndex: selectors.grading.activeIndex(state),
  selectionLength: selectors.grading.selectionLength(state),
});

export const mapDispatchToProps = {
  loadPrev: thunkActions.grading.loadPrev,
  loadNext: thunkActions.grading.loadNext,
};

export default connect(mapStateToProps, mapDispatchToProps)(SubmissionNavigation);
