import { createSelector } from 'reselect';

import { feedbackRequirement } from 'data/services/lms/constants';

import { StrictDict } from 'utils';

import * as module from './app';

export const simpleSelectors = {
  showReview: state => state.app.showReview,
  showRubric: state => state.app.showRubric,
  isGrading: state => state.app.isGrading,
  courseMetadata: state => state.app.courseMetadata,
  oraName: state => state.app.oraMetadata.name,
  oraPrompt: state => state.app.oraMetadata.prompt,
  oraTypes: state => state.app.oraMetadata.type,
  rubricConfig: state => state.app.oraMetadata.rubricConfig,
};

export const criteria = createSelector(
  [module.simpleSelectors.rubricConfig],
  (config) => config.criteria,
);

export const criterionConfig = (state, { orderNum }) => module.criteria(state)[orderNum];

export const rubricCriteriaIndices = createSelector(
  [module.criteria],
  (rubricCriteria) => rubricCriteria.map(({ orderNum }) => orderNum),
);

const shouldIncludeFeedback = (feedback) => ([
  feedbackRequirement.required,
  feedbackRequirement.optional,
]).includes(feedback);

export const emptyGrade = (state) => {
  const { rubricConfig } = state.app.oraMetadata;
  console.log({ rubricConfig });
  if (rubricConfig === undefined) {
    return null;
  }
  const gradeData = {};
  if (shouldIncludeFeedback(rubricConfig.feedback)) {
    gradeData.overallFeedback = '';
  }
  gradeData.criteria = rubricConfig.criteria.map(criterion => {
    const entry = {
      orderNum: criterion.orderNum,
      name: criterion.name,
      selectedOption: null,
    };
    if (shouldIncludeFeedback(criterion.feedback)) {
      entry.feedback = '';
    }
    return entry;
  });
  return gradeData;
};

export default StrictDict({
  ...simpleSelectors,
  criterionConfig,
  emptyGrade,
  rubricCriteriaIndices,
});
