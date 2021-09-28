import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Form,
  FormControlFeedback,
} from '@edx/paragon';

import selectors from 'data/selectors';

/**
 * <ReviewCriterion />
 */
export const ReviewCriterion = ({
  config,
  data,
}) => (
  <div className="review-criterion">
    { config.options.map(option => (
      <div key={option.name} className="criteria-option">
        <div>
          <Form.Label className="option-label">
            {option.label}
          </Form.Label>
          <FormControlFeedback className="option-points">
            {`${option.points} points`}
          </FormControlFeedback>
        </div>
      </div>
    )) }
  </div>
);

ReviewCriterion.defaultProps = {
  data: {},
};
ReviewCriterion.propTypes = {
  // redux
  config: PropTypes.shape({
    prompt: PropTypes.string,
    feedback: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({
      explanation: PropTypes.string,
      label: PropTypes.string,
      name: PropTypes.string,
      points: PropTypes.number,
    })),
  }).isRequired,
  data: PropTypes.shape({
    selectedOption: PropTypes.string,
    feedback: PropTypes.string,
  }),
};

export const mapStateToProps = (state, { orderNum }) => ({
  config: selectors.app.rubricCriterionConfig(state, { orderNum }),
  data: selectors.grading.selected.criterionGradeData(state, { orderNum }),
});

export const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewCriterion);
