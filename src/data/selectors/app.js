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

/**
 * Returns the rubric-level feedback config string
 * @return {string} - rubric-level feedback config string
 */
export const rubricFeedbackConfig = createSelector(
  [module.simpleSelectors.rubricConfig],
  (config) => config.feedback,
);

/**
 * Returns a list of rubric criterion config objects for the ORA
 * @return {obj[]} - array of criterion config objects
 */
export const criteria = createSelector(
  [module.simpleSelectors.rubricConfig],
  (config) => config.criteria,
);

/**
 * Returns the config object for the rubric criterion at the given index (orderNum)
 * @param {number} orderNum - rubric criterion index
 * @return {obj} - criterion config object
 */
export const rubricCriterionConfig = (state, { orderNum }) => module.criteria(state)[orderNum];

/**
 * Returns the feeback configuration string for tor the criterion at the given index
 * (orderNum).
 * @param {number} orderNum - rubric criterion index
 * @return {string} - criterion feedback config string
 */
export const rubricCriterionFeedbackConfig = (state, { orderNum }) => (
  module.rubricCriterionConfig(state, { orderNum }).feedback
);

/**
 * Returns a list of rubric criteria indices for iterating over
 * @return {number[]} - list of rubric criteria indices
 */
export const rubricCriteriaIndices = createSelector(
  [module.criteria],
  (rubricCriteria) => rubricCriteria.map(({ orderNum }) => orderNum),
);

/**
 * Returns true iff the passed feedback value is required or optional
 * @return {bool} - should include feedback?
 */
const shouldIncludeFeedback = (feedback) => ([
  feedbackRequirement.required,
  feedbackRequirement.optional,
]).includes(feedback);

/**
 * Returns an empty grade data object based on the rubric config loaded in the app model.
 * @return {obj} - empty grade data object
 */
export const emptyGrade = createSelector(
  [module.simpleSelectors.rubricConfig],
  (rubricConfig) => {
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
        selectedOption: '',
      };
      if (shouldIncludeFeedback(criterion.feedback)) {
        entry.feedback = '';
      }
      return entry;
    });
    return gradeData;
  },
);

export default StrictDict({
  ...simpleSelectors,
  emptyGrade,
  rubricCriteriaIndices,
  rubricCriterionConfig,
  rubricCriterionFeedbackConfig,
  rubricFeedbackConfig,
});
