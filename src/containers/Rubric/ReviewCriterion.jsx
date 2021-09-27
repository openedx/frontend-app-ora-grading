import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Form,
} from '@edx/paragon';

import selectors from 'data/selectors';

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
    >
      { config.options.map(option => (
        <Form.Radio value={option.name}>{option.label}</Form.Radio>
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
    selectedOption: PropTypes.number,
    feedback: PropTypes.string,
  }).isRequired,
};

export const mapStateToProps = (state) => ({

});

export const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(GradingCriterion);
