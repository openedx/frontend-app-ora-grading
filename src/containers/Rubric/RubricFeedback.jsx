import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Form } from '@edx/paragon';

import { feedbackRequirement } from 'data/services/lms/constants';
import actions from 'data/actions';
import selectors from 'data/selectors';

/**
 * <RubricFeedback />
 */
export class RubricFeedback extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.props.setValue(event.target.value);
  }

  render() {
    if (this.props.config === feedbackRequirement.disabled) {
      return null;
    }
    return this.props.isGrading
      ? (
        <Form.Control
          as="input"
          className="rubric-feedback feedback-input"
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

RubricFeedback.defaultProps = {
  value: '',
};

RubricFeedback.propTypes = {
  // redux
  config: PropTypes.string.isRequired,
  isGrading: PropTypes.bool.isRequired,
  setValue: PropTypes.func.isRequired,
  value: PropTypes.string,
};

export const mapStateToProps = (state) => ({
  isGrading: selectors.app.isGrading(state),
  value: selectors.grading.selected.overallFeedback(state),
  config: selectors.app.rubricFeedbackConfig(state),
});

export const mapDispatchToProps = {
  setValue: actions.grading.setRubricFeedback,
};

export default connect(mapStateToProps, mapDispatchToProps)(RubricFeedback);
