import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Form } from '@edx/paragon';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import { feedbackRequirement } from 'data/services/lms/constants';
import actions from 'data/actions';
import selectors from 'data/selectors';
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
      isGrading,
      value,
      feedbackPrompt,
      config,
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
          as="input"
          className="rubric-feedback feedback-input"
          floatingLabel={this.inputLabel}
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
  // injected
  intl: intlShape.isRequired,
  // redux
  config: PropTypes.string.isRequired,
  isGrading: PropTypes.bool.isRequired,
  setValue: PropTypes.func.isRequired,
  value: PropTypes.string,
  feedbackPrompt: PropTypes.string.isRequired,
};

export const mapStateToProps = (state) => ({
  isGrading: selectors.app.isGrading(state),
  value: selectors.grading.selected.overallFeedback(state),
  config: selectors.app.rubric.feedbackConfig(state),
  feedbackPrompt: selectors.app.rubric.feedbackPrompt(state),
});

export const mapDispatchToProps = {
  setValue: actions.grading.setRubricFeedback,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(RubricFeedback));
