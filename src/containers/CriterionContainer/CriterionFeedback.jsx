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
    this.props.setValue({
      value: event.target.value,
      orderNum: this.props.orderNum,
    });
  }

  render() {
    const { config, isGrading, value, gradeStatus } = this.props;
    if (
      config === feedbackRequirement.disabled ||
      (!isGrading && gradeStatus === 'ungraded')
    ) {
      return null;
    }
    return (
      <Form.Control
        as="input"
        className="criterion-feedback feedback-input"
        floatingLabel={isGrading ? 'Add comments' : 'Comments'}
        value={value}
        onChange={this.onChange}
        disabled={!isGrading}
      />
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
  gradeStatus: PropTypes.oneOf(['graded', 'ungraded']).isRequired,
};

export const mapStateToProps = (state, { orderNum }) => ({
  isGrading: selectors.app.isGrading(state),
  config: selectors.app.rubric.criterionFeedbackConfig(state, { orderNum }),
  value: selectors.grading.selected.criterionFeedback(state, { orderNum }),
  gradeStatus: selectors.grading.selected.gradeStatus(state),
});

export const mapDispatchToProps = {
  setValue: actions.grading.setCriterionFeedback,
};

export default connect(mapStateToProps, mapDispatchToProps)(CriterionFeedback);
