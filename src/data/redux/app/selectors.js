import { createSelector } from 'reselect';

import { feedbackRequirement } from 'data/services/lms/constants';

import { StrictDict } from 'utils';

import * as module from './selectors';

export const appSelector = (state) => state.app;

const mkSimpleSelector = (cb) => createSelector([module.appSelector], cb);

// top-level app data selectors
export const simpleSelectors = {
  showReview: mkSimpleSelector(app => app.showReview),
  showRubric: mkSimpleSelector(app => app.showRubric),
  isGrading: mkSimpleSelector(app => app.isGrading),
  courseMetadata: mkSimpleSelector(app => app.courseMetadata),
  oraMetadata: mkSimpleSelector(app => app.oraMetadata),
};

export const courseId = (
  createSelector([module.simpleSelectors.courseMetadata], (data) => data.courseId)
);

const oraMetadataSelector = (cb) => createSelector([module.simpleSelectors.oraMetadata], cb);
// ORA metadata selectors
export const ora = {
  /**
   * Returns the ORA name
   * @return {string} - ORA name
   */
  name: oraMetadataSelector(data => data.name),
  /**
   * Returns the ORA Prompt
   * @return {string} - ORA prompt
   */
  prompt: oraMetadataSelector(data => data.prompt),
  /**
   * Returns the ORA type
   * @return {string} - ORA type (team vs individual)
   */
  type: oraMetadataSelector(data => data.type),
};

/**
 * Container for rubric config selectors
 */
export const rubric = {};
/**
 * Returns the full top-level rubric config from the ora metadata
 * @return {object} - rubric config object
 */
rubric.config = oraMetadataSelector(data => data.rubricConfig);

/**
 * Returns a momoized selector depending on the rubric config with the given callback
 * @param {func} cb - callback taking the rubric config as an arg, and returning a value
 * @return {func} - a memoized selector that calls cb with the rubric config
 */
const rubricConfigSelector = (cb) => createSelector([module.rubric.config], cb);

/**
 * Returns true iff the rubric object has loaded.
 * @return {bool} - has a rubric config been loaded?
 */
rubric.hasConfig = rubricConfigSelector(config => config !== undefined);
/**
 * Returns the rubric-level feedback config string
 * @return {string} - rubric-level feedback config string
 */
rubric.feedbackConfig = rubricConfigSelector(config => config.feedback);

/**
 * Return the criteria feedbase prompt
 * @return {string} - criteria feedback prompt
 */
rubric.feedbackPrompt = rubricConfigSelector(config => config.feedbackPrompt);

/**
 * Returns a list of rubric criterion config objects for the ORA
 * @return {obj[]} - array of criterion config objects
 */
rubric.criteria = rubricConfigSelector(config => config.criteria);

/**
 * Returns the config object for the rubric criterion at the given index (orderNum)
 * @param {number} orderNum - rubric criterion index
 * @return {obj} - criterion config object
 */
rubric.criterionConfig = (state, { orderNum }) => module.rubric.criteria(state)[orderNum];

/**
 * Returns the feeback configuration string for tor the criterion at the given index
 * (orderNum).
 * @param {number} orderNum - rubric criterion index
 * @return {string} - criterion feedback config string
 */
rubric.criterionFeedbackConfig = (state, { orderNum }) => (
  module.rubric.criterionConfig(state, { orderNum }).feedback
);

/**
 * Returns a list of rubric criteria indices for iterating over
 * @return {number[]} - list of rubric criteria indices
 */
rubric.criteriaIndices = createSelector(
  [module.rubric.criteria],
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
  [module.rubric.hasConfig, module.rubric.criteria, module.rubric.feedbackConfig],
  (hasConfig, criteria, feedbackConfig) => {
    if (!hasConfig) {
      return null;
    }
    const gradeData = {};
    if (shouldIncludeFeedback(feedbackConfig)) {
      gradeData.overallFeedback = '';
    }
    gradeData.criteria = criteria.map(criterion => {
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
  courseId,
  ora,
  rubric: StrictDict(rubric),
  emptyGrade,
});
