import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Card, StatefulButton } from '@edx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import { StrictDict } from 'utils';
import { selectors, thunkActions } from 'data/redux';
import { RequestKeys } from 'data/constants/requests';

import CriterionContainer from 'containers/CriterionContainer';
import RubricFeedback from './RubricFeedback';
import messages from './messages';

import './Rubric.scss';

const ButtonStates = StrictDict({
  default: 'default',
  pending: 'pending',
  complete: 'complete',
  error: 'error',
});

/**
 * <Rubric />
 */
export class Rubric extends React.Component {
  constructor(props) {
    super(props);

    this.submitGradeHandler = this.submitGradeHandler.bind(this);
  }

  get submitButtonState() {
    if (this.props.gradeIsPending || this.props.lockIsPending) {
      return ButtonStates.pending;
    }
    if (this.props.isCompleted) {
      return ButtonStates.complete;
    }
    return ButtonStates.default;
  }

  submitGradeHandler() {
    this.props.submitGrade();
  }

  render() {
    const { isGrading, criteriaIndices } = this.props;
    return (
      <Card className="grading-rubric-card">
        <Card.Body className="grading-rubric-body">
          <h3><FormattedMessage {...messages.rubric} /></h3>
          <hr className="m-2.5" />
          {criteriaIndices.map((index) => (
            <CriterionContainer
              isGrading={isGrading}
              key={index}
              orderNum={index}
            />
          ))}
          <hr />
          <RubricFeedback />
        </Card.Body>
        {(isGrading || this.props.isCompleted) && (
          <div className="grading-rubric-footer">
            <StatefulButton
              onClick={this.submitGradeHandler}
              state={this.submitButtonState}
              disabledStates={[ButtonStates.pending, ButtonStates.complete]}
              labels={{
                [ButtonStates.default]: <FormattedMessage {...messages.submitGrade} />,
                [ButtonStates.pending]: <FormattedMessage {...messages.submittingGrade} />,
                [ButtonStates.complete]: <FormattedMessage {...messages.gradeSubmitted} />,
              }}
            />
          </div>
        )}
      </Card>
    );
  }
}
Rubric.defaultProps = {
  criteriaIndices: [],
};
Rubric.propTypes = {
  isCompleted: PropTypes.bool.isRequired,
  isGrading: PropTypes.bool.isRequired,
  gradeIsPending: PropTypes.bool.isRequired,
  lockIsPending: PropTypes.bool.isRequired,
  criteriaIndices: PropTypes.arrayOf(PropTypes.number),
  submitGrade: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
  isCompleted: selectors.requests.isCompleted(state, { requestKey: RequestKeys.submitGrade }),
  isGrading: selectors.grading.selected.isGrading(state),
  gradeIsPending: selectors.requests.isPending(state, { requestKey: RequestKeys.submitGrade }),
  lockIsPending: selectors.requests.isPending(state, { requestKey: RequestKeys.setLock }),
  criteriaIndices: selectors.app.rubric.criteriaIndices(state),
});

export const mapDispatchToProps = {
  submitGrade: thunkActions.grading.submitGrade,
};

export default connect(mapStateToProps, mapDispatchToProps)(Rubric);
