import { createSelector } from 'reselect';

import { feedbackRequirement } from 'data/services/lms/constants';
import appSelectors from '../../app/selectors';

import selected from './selected';
import * as module from './validation';

export const validation = {};

validation.show = createSelector(
  [selected.gradingData],
  (gradingData) => gradingData?.showValidation || false,
);

validation.overallFeedback = createSelector(
  [selected.gradingData, appSelectors.rubric.config],
  (gradingData, rubricConfig) => !(
    rubricConfig.feedback === feedbackRequirement.required
    && gradingData?.overallFeedback === ''
  ),
);
validation.overallFeedbackIsInvalid = createSelector(
  [module.validation.show, module.validation.overallFeedback],
  (show, overallFeedback) => (show && !overallFeedback),
);

validation.criteria = createSelector(
  [selected.gradingData, appSelectors.rubric.config],
  (gradingData, rubricConfig) => rubricConfig.criteria.map((criterion, index) => ({
    feedback: !(
      criterion.feedback === feedbackRequirement.required
      && gradingData.criteria[index].feedback === ''
    ),
    selectedOption: rubricConfig.criteria[index].options.length === 0 || gradingData.criteria[index].selectedOption !== '',
  })),
);

validation.criterion = (state, { orderNum }) => module.validation.criteria(state)[orderNum];

validation.criterionFeedback = (state, { orderNum }) => (
  module.validation.criterion(state, { orderNum }).feedback
);
validation.criterionFeedbackIsInvalid = (state, { orderNum }) => (
  module.validation.show(state)
  && !module.validation.criterionFeedback(state, { orderNum })
);

validation.criterionSelectedOption = (state, { orderNum }) => (
  module.validation.criterion(state, { orderNum }).selectedOption
);
validation.criterionSelectedOptionIsInvalid = (state, { orderNum }) => (
  module.validation.show(state)
  && !module.validation.criterionSelectedOption(state, { orderNum })
);

validation.isValidForSubmit = createSelector(
  [module.validation.overallFeedback, module.validation.criteria],
  (overallFeedback, criteria) => (
    !!overallFeedback
    && criteria.every(({ feedback, selectedOption }) => feedback && selectedOption)
  ),
);

export default validation;
