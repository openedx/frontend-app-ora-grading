import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Form,
  Icon,
  IconButton,
} from '@edx/paragon';
import { InfoOutline } from '@edx/paragon/icons';

import selectors from 'data/selectors';

import GradingCriterion from './GradingCriterion';
import ReviewCriterion from './ReviewCriterion';

/**
 * <CriterionContainer />
 */
export const CriterionContainer = ({
  config,
  data,
  isGrading,
}) => (
  <Form.Group>
    <Form.Label className="criteria-label">
      <div className="criteria-title">
        <h4>{config.prompt}</h4>
      </div>
      <IconButton
        className="criteria-help-icon"
        src={InfoOutline}
        alt="criterion info"
        iconAs={Icon}
      />
    </Form.Label>
    {
      isGrading
        ? <GradingCriterion {...{ data, config, isGrading }} />
        : <ReviewCriterion {...{ data, config, isGrading }} />
    }
  </Form.Group>
);

CriterionContainer.defaultProps = {
  data: {},
};

CriterionContainer.propTypes = {
  isGrading: PropTypes.bool.isRequired,
  // redux
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
  }),
};

export const mapStateToProps = (state, { orderNum }) => ({
  config: selectors.app.criterionConfig(state, { orderNum }),
  data: selectors.grading.criterionGradeData(state, { orderNum }),
});

export const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(CriterionContainer);
