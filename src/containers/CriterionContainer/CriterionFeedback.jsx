import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Form } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import { feedbackRequirement } from 'data/services/lms/constants';
import { actions, selectors } from 'data/redux';
import messages from './messages';

/**
 * <CriterionFeedback />
 */
export const CriterionFeedback = ({
  orderNum,
  isGrading,
  config,
  setValue,
  value,
  isInvalid,
}) => {
  const intl = useIntl();

  const onChange = (event) => {
    setValue({
      value: event.target.value,
      orderNum,
    });
  };

  const translate = (msg) => intl.formatMessage(msg);

  const getCommentMessage = () => {
    let commentMessage = translate(isGrading ? messages.addComments : messages.comments);
    if (config === feedbackRequirement.optional) {
      commentMessage += ` ${translate(messages.optional)}`;
    }
    return commentMessage;
  };

  if (config === feedbackRequirement.disabled) {
    return null;
  }

  return (
    <Form.Group isInvalid={isInvalid}>
      <Form.Control
        as="textarea"
        className="criterion-feedback feedback-input"
        data-testid="criterion-feedback-input"
        floatingLabel={getCommentMessage()}
        value={value}
        onChange={onChange}
        disabled={!isGrading}
      />
      {isInvalid && (
        <Form.Control.Feedback type="invalid" className="feedback-error-msg" data-testid="criterion-feedback-error-msg">
          {translate(messages.criterionFeedbackError)}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

CriterionFeedback.defaultProps = {
  value: '',
};

CriterionFeedback.propTypes = {
  orderNum: PropTypes.number.isRequired,
  isGrading: PropTypes.bool.isRequired,
  // redux
  config: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  value: PropTypes.string,
  isInvalid: PropTypes.bool.isRequired,
};

export const mapStateToProps = (state, { orderNum }) => ({
  config: selectors.app.rubric.criterionFeedbackConfig(state, { orderNum }),
  value: selectors.grading.selected.criterionFeedback(state, { orderNum }),
  isInvalid: selectors.grading.validation.criterionFeedbackIsInvalid(state, { orderNum }),
});

export const mapDispatchToProps = {
  setValue: actions.grading.setCriterionFeedback,
};

export default connect(mapStateToProps, mapDispatchToProps)(CriterionFeedback);
