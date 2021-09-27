import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Form,
} from '@edx/paragon';

/**
 * <GradingCriterion />
 */
export const GradingCriterion = ({
  config,
  data,
}) => (
  <>
    <Form.RadioSet
      name="colors"
      value={data.selectedOption}
    >
      { config.options.map(option => (
        <Form.Radio
          className="criteria-option"
          key={option.name}
          value={option.name}
          description={`${option.points} points`}
        >
          {option.label}
        </Form.Radio>
      )) }
    </Form.RadioSet>
  </>
);

GradingCriterion.defaultProps = {};
GradingCriterion.propTypes = {
  config: PropTypes.shape({
    prompt: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({
      explanation: PropTypes.string,
      feedback: PropTypes.string,
      label: PropTypes.string,
      name: PropTypes.string,
      points: PropTypes.number,
    })),
  }).isRequired,
  data: PropTypes.shape({
    selectedOption: PropTypes.string,
    feedback: PropTypes.string,
  }).isRequired,
};

export const mapStateToProps = () => ({
});

export const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(GradingCriterion);
