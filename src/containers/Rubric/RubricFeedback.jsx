import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Form } from '@openedx/paragon';
import { FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';

import { feedbackRequirement } from 'data/services/lms/constants';
import { actions, selectors } from 'data/redux';
import InfoPopover from 'components/InfoPopover';

import messages from './messages';

/**
 * <RubricFeedback />
 */
export const RubricFeedback = ({
  isGrading,
  value,
  feedbackPrompt,
  config,
  isInvalid,
  setValue,
}) => {
  const intl = useIntl();

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const inputLabel = intl.formatMessage(
    isGrading ? messages.addComments : messages.comments,
  );

  if (config === feedbackRequirement.disabled) {
    return null;
  }

  return (
    <Form.Group>
      <Form.Label className="criteria-label">
        <span className="criteria-title">
          <FormattedMessage {...messages.overallComments} />
        </span>
        <InfoPopover>
          <div>{feedbackPrompt}</div>
        </InfoPopover>
      </Form.Label>
      <Form.Control
        as="textarea"
        className="rubric-feedback feedback-input"
        floatingLabel={inputLabel}
        value={value}
        onChange={onChange}
        disabled={!isGrading}
      />
      {isInvalid && (
        <Form.Control.Feedback type="invalid" className="feedback-error-msg">
          <FormattedMessage {...messages.overallFeedbackError} />
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

RubricFeedback.defaultProps = {
  value: { grading: '', review: '' },
};

RubricFeedback.propTypes = {
  // redux
  config: PropTypes.string.isRequired,
  isGrading: PropTypes.bool.isRequired,
  setValue: PropTypes.func.isRequired,
  value: PropTypes.string,
  isInvalid: PropTypes.bool.isRequired,
  feedbackPrompt: PropTypes.string.isRequired,
};

export const mapStateToProps = (state) => ({
  isGrading: selectors.grading.selected.isGrading(state),
  value: selectors.grading.selected.overallFeedback(state),
  isInvalid: selectors.grading.validation.overallFeedbackIsInvalid(state),
  config: selectors.app.rubric.feedbackConfig(state),
  feedbackPrompt: selectors.app.rubric.feedbackPrompt(state),
});

export const mapDispatchToProps = {
  setValue: actions.grading.setRubricFeedback,
};

export default connect(mapStateToProps, mapDispatchToProps)(RubricFeedback);
