import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Form } from '@edx/paragon';
import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from '@edx/frontend-platform/i18n';

import { feedbackRequirement } from 'data/services/lms/constants';
import { actions, selectors } from 'data/redux';
import InfoPopover from 'components/InfoPopover';

import messages from './messages';

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

  get inputLabel() {
    return this.props.intl.formatMessage(
      this.props.isGrading ? messages.addComments : messages.comments,
    );
  }

  render() {
    const {
      isGrading, value, feedbackPrompt, config, isInvalid,
    } = this.props;

    if (config === feedbackRequirement.disabled) {
      return null;
    }
    return (
      <Form.Group>
        <Form.Label className="criteria-label">
          <span className="criteria-title">
            <FormattedMessage {...messages.overallComments} />
          </span>
          <InfoPopover>
            <div>{feedbackPrompt}</div>
          </InfoPopover>
        </Form.Label>
        <Form.Control
          as="textarea"
          className="rubric-feedback feedback-input"
          floatingLabel={this.inputLabel}
          value={value}
          onChange={this.onChange}
          disabled={!isGrading}
        />
        {isInvalid && (
          <Form.Control.Feedback type="invalid" className="feedback-error-msg">
            <FormattedMessage {...messages.overallFeedbackError} />
          </Form.Control.Feedback>
        )}
      </Form.Group>
    );
  }
}

RubricFeedback.defaultProps = {
  value: { grading: '', review: '' },
};

RubricFeedback.propTypes = {
  // injected
  intl: intlShape.isRequired,
  // redux
  config: PropTypes.string.isRequired,
  isGrading: PropTypes.bool.isRequired,
  setValue: PropTypes.func.isRequired,
  value: PropTypes.string,
  isInvalid: PropTypes.bool.isRequired,
  feedbackPrompt: PropTypes.string.isRequired,
};

export const mapStateToProps = (state) => ({
  isGrading: selectors.grading.selected.isGrading(state),
  value: selectors.grading.selected.overallFeedback(state),
  isInvalid: selectors.grading.validation.overallFeedbackIsInvalid(state),
  config: selectors.app.rubric.feedbackConfig(state),
  feedbackPrompt: selectors.app.rubric.feedbackPrompt(state),
});

export const mapDispatchToProps = {
  setValue: actions.grading.setRubricFeedback,
};

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(RubricFeedback),
);
