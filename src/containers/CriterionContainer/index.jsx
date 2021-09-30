import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Form } from '@edx/paragon';

import actions from 'data/actions';
import selectors from 'data/selectors';

import GradingCriterion from './GradingCriterion';
import ReviewCriterion from './ReviewCriterion';
import CriterionFeedback from './CriterionFeedback';
import OptionInfoPopover from './OptionInfoPopover';

/**
 * <CriterionContainer />
 */
export class CriterionContainer extends React.Component {
  constructor(props) {
    super(props);
    this.handleFeedbackUpdate = this.handleFeedbackUpdate.bind(this);
  }

  handleFeedbackUpdate(event) {
    this.props.setFeedback({ orderNum: this.props.orderNum, value: event.target.value });
  }

  render() {
    const {
      config,
      isGrading,
      orderNum,
    } = this.props;
    return (
      <Form.Group>
        <Form.Label className="criteria-label">
          <span className="criteria-title">
            {config.prompt}
          </span>
          <OptionInfoPopover options={config.options} />
        </Form.Label>
        <div className="rubric-criteria">
          {
            isGrading
              ? <GradingCriterion orderNum={orderNum} />
              : <ReviewCriterion orderNum={orderNum} />
          }
        </div>
        <CriterionFeedback orderNum={orderNum} />
      </Form.Group>
    );
  }
}

CriterionContainer.defaultProps = {
};

CriterionContainer.propTypes = {
  isGrading: PropTypes.bool.isRequired,
  orderNum: PropTypes.number.isRequired,
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
  setFeedback: PropTypes.func.isRequired,
};

export const mapStateToProps = (state, { orderNum }) => ({
  config: selectors.app.rubricCriterionConfig(state, { orderNum }),
});

export const mapDispatchToProps = {
  setFeedback: actions.grading.setCriterionFeedback,
};

export default connect(mapStateToProps, mapDispatchToProps)(CriterionContainer);
