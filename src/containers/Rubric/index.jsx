import React from 'react';
import { useDispatch } from 'react-redux';

import { Card, StatefulButton } from '@edx/paragon';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import DemoAlert from 'components/DemoAlert';
import CriterionContainer from 'containers/CriterionContainer';
import RubricFeedback from './RubricFeedback';

import * as hooks from './hooks';
import messages from './messages';

import './Rubric.scss';

const { ButtonStates } = hooks;

/**
 * <Rubric />
 */
export const Rubric = ({ intl }) => {
  const dispatch = useDispatch();
  const {
    criteria,
    showFooter,
    buttonProps,
    demoAlertProps,
  } = hooks.rendererHooks({ dispatch });
  return (
    <>
      <Card className="grading-rubric-card">
        <Card.Section className="grading-rubric-body">
          <h3>{intl.formatMessage(messages.rubric)}</h3>
          <hr className="m-2.5" />
          {criteria.map(props => <CriterionContainer {...props} />)}
          <hr />
          <RubricFeedback />
        </Card.Section>
        {showFooter && (
          <div className="grading-rubric-footer">
            <StatefulButton
              {...buttonProps}
              labels={{
                [ButtonStates.default]: intl.formatMessage(messages.submitGrade),
                [ButtonStates.pending]: intl.formatMessage(messages.submittingGrade),
                [ButtonStates.complete]: intl.formatMessage(messages.gradeSubmitted),
              }}
            />
          </div>
        )}
      </Card>
      <DemoAlert {...demoAlertProps} />
    </>
  );
};
Rubric.propTypes = {
  // injected
  intl: intlShape.isRequired,
};

export default injectIntl(Rubric);
