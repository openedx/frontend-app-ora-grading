import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { StatefulButton, Card, Spinner } from '@edx/paragon';
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

  submitGradeHandler() {
    this.props.submitGrade();
  }

  render() {
    const { isGrading, isPending, criteriaIndices } = this.props;
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
        {isGrading && (
          <div className="grading-rubric-footer">
            <StatefulButton
              onClick={this.submitGradeHandler}
              state={isPending ? ButtonStates.pending : ButtonStates.default}
              disabledStates={[ButtonStates.pending]}
              labels={{
                [ButtonStates.default]: <FormattedMessage {...messages.submitGrade} />,
                [ButtonStates.pending]: <FormattedMessage {...messages.submittingGrade} />,
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
  isGrading: PropTypes.bool.isRequired,
  isPending: PropTypes.bool.isRequired,
  criteriaIndices: PropTypes.arrayOf(PropTypes.number),
  submitGrade: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
  isGrading: selectors.grading.selected.isGrading(state),
  isPending: selectors.requests.isPending(state, { requestKey: RequestKeys.submitGrade }),
  criteriaIndices: selectors.app.rubric.criteriaIndices(state),
});

export const mapDispatchToProps = {
  submitGrade: thunkActions.grading.submitGrade,
};

export default connect(mapStateToProps, mapDispatchToProps)(Rubric);
