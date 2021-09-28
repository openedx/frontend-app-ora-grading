import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Form } from '@edx/paragon';

import { feedbackRequirement } from 'data/services/lms/constants';
import actions from 'data/actions';
import selectors from 'data/selectors';

/**
 * <CriterionFeedback />
 */
export class CriterionFeedback extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.props.setValue({ value: event.target.value, orderNum: this.props.orderNum });
  }

  render() {
    if (this.props.config === feedbackRequirement.disabled) {
      return null;
    }
    return this.props.isGrading
      ? (
        <Form.Control
          as="input"
          className="criterion-feedback feedback-input"
          floatingLabel="Add comments"
          value={this.props.value}
          onChange={this.onChange}
        />
      )
      : (
        <Form.Text className="feedback-text">{this.props.value}</Form.Text>
      );
  }
}

CriterionFeedback.defaultProps = {
  value: '',
};

CriterionFeedback.propTypes = {
  orderNum: PropTypes.number.isRequired,
  // redux
  config: PropTypes.string.isRequired,
  isGrading: PropTypes.bool.isRequired,
  setValue: PropTypes.func.isRequired,
  value: PropTypes.string,
};

export const mapStateToProps = (state, { orderNum }) => ({
  isGrading: selectors.app.isGrading(state),
  config: selectors.app.rubricCriterionFeedbackConfig(state, { orderNum }),
  value: selectors.grading.selected.criterionFeedback(state, { orderNum }),
});

export const mapDispatchToProps = {
  setValue: actions.grading.setCriterionFeedback,
};

export default connect(mapStateToProps, mapDispatchToProps)(CriterionFeedback);
