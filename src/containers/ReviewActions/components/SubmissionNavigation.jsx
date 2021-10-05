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
  hasPrevSubmission: false,
  hasNextSubmission: false,
};
SubmissionNavigation.propTypes = {
  activeIndex: PropTypes.number.isRequired,
  hasNextSubmission: PropTypes.bool,
  hasPrevSubmission: PropTypes.bool,
  loadNext: PropTypes.func.isRequired,
  loadPrev: PropTypes.func.isRequired,
  selectionLength: PropTypes.number.isRequired,
};

export const mapStateToProps = (state) => ({
  activeIndex: selectors.grading.activeIndex(state),
  hasNextSubmission: selectors.grading.next.doesExist(state),
  hasPrevSubmission: selectors.grading.prev.doesExist(state),
  selectionLength: selectors.grading.selectionLength(state),
});

export const mapDispatchToProps = {
  loadNext: thunkActions.grading.loadNext,
  loadPrev: thunkActions.grading.loadPrev,
};

export default connect(mapStateToProps, mapDispatchToProps)(SubmissionNavigation);
