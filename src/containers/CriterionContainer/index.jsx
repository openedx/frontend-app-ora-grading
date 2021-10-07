import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Form } from '@edx/paragon';

import actions from 'data/actions';
import selectors from 'data/selectors';

import RadioCriterion from './RadioCriterion';
import CriterionFeedback from './CriterionFeedback';
import InfoPopover from '../../components/InfoPopover';

/**
 * <CriterionContainer />
 */
export class CriterionContainer extends React.Component {
  render() {
    const { config, isGrading, orderNum } = this.props;
    return (
      <Form.Group>
        <Form.Label className="criteria-label">
          <span className="criteria-title">{config.prompt}</span>
          <InfoPopover>
            {config.options.map((option) => (
              <div key={option.name} className="help-popover-option">
                <strong>{option.label}</strong>
                <br />
                {option.explanation}
              </div>
            ))}
          </InfoPopover>
        </Form.Label>
        <div className="rubric-criteria">
          <RadioCriterion orderNum={orderNum} isGrading={isGrading} />
        </div>
        <CriterionFeedback orderNum={orderNum} isGrading={isGrading} />
      </Form.Group>
    );
  }
}

CriterionContainer.defaultProps = {};

CriterionContainer.propTypes = {
  isGrading: PropTypes.bool.isRequired,
  orderNum: PropTypes.number.isRequired,
  // redux
  config: PropTypes.shape({
    prompt: PropTypes.string,
    feedback: PropTypes.string,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        explanation: PropTypes.string,
        label: PropTypes.string,
        name: PropTypes.string,
        points: PropTypes.number,
      }),
    ),
  }).isRequired,
};

export const mapStateToProps = (state, { orderNum }) => ({
  config: selectors.app.rubric.criterionConfig(state, { orderNum }),
});

export const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CriterionContainer);
