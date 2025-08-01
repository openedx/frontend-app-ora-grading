import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Form } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import { actions, selectors } from 'data/redux';
import messages from './messages';

/**
 * <RadioCriterion />
 */
export const RadioCriterion = ({
  orderNum,
  isGrading,
  config,
  data,
  setCriterionOption,
  isInvalid,
}) => {
  const intl = useIntl();

  const onChange = (event) => {
    setCriterionOption({
      orderNum,
      value: event.target.value,
    });
  };

  return (
    <Form.RadioSet name={config.name} value={data}>
      {config.options.map((option) => (
        <Form.Radio
          className="criteria-option align-items-center"
          key={option.name}
          value={option.name}
          description={intl.formatMessage(messages.optionPoints, { points: option.points })}
          onChange={onChange}
          disabled={!isGrading}
          style={{ flexShrink: 0 }}
        >
          {option.label}
        </Form.Radio>
      ))}
      {isInvalid && (
      <Form.Control.Feedback type="invalid" className="feedback-error-msg">
        {intl.formatMessage(messages.rubricSelectedError)}
      </Form.Control.Feedback>
      )}
    </Form.RadioSet>
  );
};

RadioCriterion.defaultProps = {
  data: {
    grading: '',
    review: '',
  },
};

RadioCriterion.propTypes = {
  orderNum: PropTypes.number.isRequired,
  isGrading: PropTypes.bool.isRequired,
  // redux
  config: PropTypes.shape({
    prompt: PropTypes.string,
    name: PropTypes.string,
    feedback: PropTypes.string,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        explanation: PropTypes.string,
        feedback: PropTypes.string,
        label: PropTypes.string,
        name: PropTypes.string,
        points: PropTypes.number,
      }),
    ),
  }).isRequired,
  data: PropTypes.string,
  setCriterionOption: PropTypes.func.isRequired,
  isInvalid: PropTypes.bool.isRequired,
};

export const mapStateToProps = (state, { orderNum }) => ({
  config: selectors.app.rubric.criterionConfig(state, { orderNum }),
  data: selectors.grading.selected.criterionSelectedOption(state, { orderNum }),
  isInvalid: selectors.grading.validation.criterionSelectedOptionIsInvalid(state, { orderNum }),
});

export const mapDispatchToProps = {
  setCriterionOption: actions.grading.setCriterionOption,
};

export default connect(mapStateToProps, mapDispatchToProps)(RadioCriterion);
