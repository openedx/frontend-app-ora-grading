import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Form } from '@edx/paragon';

import actions from 'data/actions';
import selectors from 'data/selectors';

/**
 * <GradingCriterion />
 */
export class GradingCriterion extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.props.setCriterionOption({
      orderNum: this.props.orderNum,
      value: event.target.value,
    });
  }

  render() {
    const { config, data } = this.props;
    return (
      <>
        <Form.RadioSet
          name={config.name}
          value={data.selectedOption || ''}
        >
          { config.options.map(option => (
            <Form.Radio
              className="criteria-option"
              key={option.name}
              value={option.name}
              description={`${option.points} points`}
              onChange={this.onChange}
            >
              {option.label}
            </Form.Radio>
          )) }
        </Form.RadioSet>
      </>
    );
  }
}

GradingCriterion.defaultProps = {
  data: {
    selectedOption: '',
    feedback: '',
  },
};

GradingCriterion.propTypes = {
  orderNum: PropTypes.number.isRequired,
  // redux
  config: PropTypes.shape({
    prompt: PropTypes.string,
    name: PropTypes.string,
    feedback: PropTypes.string,
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
  }),
  setCriterionOption: PropTypes.func.isRequired,
};

export const mapStateToProps = (state, { orderNum }) => ({
  config: selectors.app.rubricCriterionConfig(state, { orderNum }),
  data: selectors.grading.selected.criterionGradeData(state, { orderNum }),
});

export const mapDispatchToProps = {
  setCriterionOption: actions.grading.setCriterionOption,
};

export default connect(mapStateToProps, mapDispatchToProps)(GradingCriterion);
