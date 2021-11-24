import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Icon, IconButton } from '@edx/paragon';
import { ChevronLeft, ChevronRight } from '@edx/paragon/icons';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import { selectors, thunkActions } from 'data/redux';
import messages from './messages';

/**
 * <SubmissionNavigation />
 */
export const SubmissionNavigation = ({
  intl,
  hasPrevSubmission,
  hasNextSubmission,
  loadPrev,
  loadNext,
  activeIndex,
  selectionLength,
  allowNavigation,
}) => (
  <span className="submission-navigation">
    <IconButton
      className="ml-1"
      size="inline"
      disabled={!hasPrevSubmission || !allowNavigation}
      alt={intl.formatMessage(messages.loadPrevious)}
      src={ChevronLeft}
      iconAs={Icon}
      onClick={loadPrev}
    />
    <span className="ml-1">
      <FormattedMessage
        {...messages.navigationLabel}
        values={{ current: activeIndex + 1, total: selectionLength }}
      />
    </span>
    <IconButton
      className="ml-1"
      size="inline"
      disabled={!hasNextSubmission || !allowNavigation}
      alt={intl.formatMessage(messages.loadNext)}
      src={ChevronRight}
      iconAs={Icon}
      onClick={loadNext}
    />
  </span>
);
SubmissionNavigation.defaultProps = {
  hasPrevSubmission: false,
  hasNextSubmission: false,
  allowNavigation: false,
};
SubmissionNavigation.propTypes = {
  // injected
  intl: intlShape.isRequired,
  // redux
  allowNavigation: PropTypes.bool,
  activeIndex: PropTypes.number.isRequired,
  hasNextSubmission: PropTypes.bool,
  hasPrevSubmission: PropTypes.bool,
  loadNext: PropTypes.func.isRequired,
  loadPrev: PropTypes.func.isRequired,
  selectionLength: PropTypes.number.isRequired,
};

export const mapStateToProps = (state) => ({
  allowNavigation: selectors.requests.allowNavigation(state),
  activeIndex: selectors.grading.activeIndex(state),
  hasNextSubmission: selectors.grading.next.doesExist(state),
  hasPrevSubmission: selectors.grading.prev.doesExist(state),
  selectionLength: selectors.grading.selectionLength(state),
});

export const mapDispatchToProps = {
  loadNext: thunkActions.grading.loadNext,
  loadPrev: thunkActions.grading.loadPrev,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(SubmissionNavigation));
