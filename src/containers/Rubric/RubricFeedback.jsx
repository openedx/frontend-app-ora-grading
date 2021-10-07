import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Form } from '@edx/paragon';

import { feedbackRequirement } from 'data/services/lms/constants';
import actions from 'data/actions';
import selectors from 'data/selectors';
import InfoPopover from 'components/InfoPopover';

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
    const { isGrading, value, feedbackPrompt, config, gradeStatus } =
      this.props;
    if (
      config === feedbackRequirement.disabled ||
      (!isGrading && gradeStatus === 'ungraded')
    ) {
      return null;
    }
    return (
      <Form.Group>
        <Form.Label className="criteria-label">
          <span className="criteria-title">Overall comments</span>
          <InfoPopover>
            <div>{feedbackPrompt}</div>
          </InfoPopover>
        </Form.Label>
        <Form.Control
          as="input"
          className="rubric-feedback feedback-input"
          floatingLabel={isGrading ? 'Add comments' : 'Comments'}
          value={value}
          onChange={this.onChange}
          disabled={!isGrading}
        />
      </Form.Group>
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
  feedbackPrompt: PropTypes.string.isRequired,
  gradeStatus: PropTypes.oneOf(['graded', 'ungraded']).isRequired,
};

export const mapStateToProps = (state) => ({
  isGrading: selectors.app.isGrading(state),
  value: selectors.grading.selected.overallFeedback(state),
<<<<<<< HEAD
  config: selectors.app.rubric.feedbackConfig(state),
=======
  config: selectors.app.rubricFeedbackConfig(state),
  feedbackPrompt: selectors.app.rubricFeedbackPrompt(state),
  gradeStatus: selectors.grading.selected.gradeStatus(state),
>>>>>>> update rubric feedback to use gradeState
});

export const mapDispatchToProps = {
  setValue: actions.grading.setRubricFeedback,
};

export default connect(mapStateToProps, mapDispatchToProps)(RubricFeedback);
