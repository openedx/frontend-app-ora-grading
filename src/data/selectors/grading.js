import { createSelector } from 'reselect';

import { StrictDict } from 'utils';
import submissionsSelectors from './submissions';
import * as module from './grading';

export const simpleSelectors = {
  selected: state => state.grading.selected,
  activeIndex: state => state.grading.activeIndex,
  current: state => state.grading.current,
};

/**
 * returns the length of the list of selected submissions
 * @return {number} selected submission list length
 */
export const selectionLength = createSelector(
  [module.simpleSelectors.selected],
  (selected) => selected.length,
);

/**
 * returns the selected submission id
 * @return {string} selected submission id
 */
export const selectedSubmissionId = createSelector(
  [module.simpleSelectors.selected, module.simpleSelectors.activeIndex],
  (selected, index) => selected[index],
);

/**
 * returns static data from the active selected submission
 * @return {obj} - staticData
 *  { submissionId, username, teamName, dateSubmitted }
 */
export const selectedStaticData = createSelector(
  [module.selectedSubmissionId, submissionsSelectors.allSubmissions],
  (submissionId, allSubmissions) => {
    const submission = allSubmissions[submissionId];
    const { grade, gradeStatus, ...staticData } = submission;
    return staticData;
  },
);

/**
 * Returns the username for the selected submission
 * @return {string} username
 */
export const selectedUsername = createSelector(
  [module.selectedStaticData],
  (staticData) => staticData.username,
);

/**
 * Returns the grade status for the selected submission
 * @return {string} grade status
 */
export const selectedGradeStatus = createSelector(
  [module.simpleSelectors.current],
  (current) => current.gradeStatus,
);

/**
 * Returns the grade data for the selected submission
 * @return {obj} grade data
 *  { score, overallFeedback, criteria }
 */
export const selectedGradeData = createSelector(
  [module.simpleSelectors.current],
  (current) => current.gradeData,
);

/**
 * Returns the response data for the selected submission
 * @return {obj} response
 *   { text, files: [] }
 */
export const selectedResponse = createSelector(
  [module.simpleSelectors.current],
  (current) => current.response,
);

/**
 * Returns list of criterion grade data for the current selection
 * @return {obj[]} criterion grade data entries
 */
export const criteriaGradeData = createSelector(
  [module.selectedGradeData],
  (data) => (data ? data.criteria : []),
);

/**
 * Returns the grade data for the given criterion of the current
 * selection
 * @param {number} orderNum - criterion orderNum (and index)
 * @return {obj} - Grade Data associated with the criterion
 */
export const criterionGradeData = (state, { orderNum }) => (
  module.criteriaGradeData(state)[orderNum]
);

export const selected = StrictDict({
  submissionId: module.selectedSubmissionId,
  staticData: module.selectedStaticData,
  username: module.selectedUsername,
  gradeStatus: module.selectedGradeStatus,
  gradeData: module.selectedGradeData,
  response: module.selectedResponse,
});

/*
 * Returns true iff there exists a selection previous to the current selection
 * in the queue.
 * @return {bool} has previous submission?
 */
export const hasPrevSubmission = createSelector(
  [simpleSelectors.activeIndex],
  (activeIndex) => activeIndex > 0,
);

/**
 * Returns true iff there exists a selection after the current selection
 * in the queue.
 * @return {bool} has next submission?
 */
export const hasNextSubmission = createSelector(
  [simpleSelectors.selected, simpleSelectors.activeIndex],
  (list, activeIndex) => activeIndex < list.length - 1,
);

/**
 * Returns the submissionId for the previous submission in the selection queu
 * @return {string} previous submission id (null if there isn't one)
 */
export const prevSubmissionId = createSelector(
  [simpleSelectors.selected, simpleSelectors.activeIndex],
  (list, activeIndex) => {
    if (activeIndex > 0) {
      return list[activeIndex - 1];
    }
    return null;
  },
);

/**
 * Returns the submissionId for the next submission in the selection queu
 * @return {string} next submission id (null if there isn't one)
 */
export const nextSubmissionId = createSelector(
  [simpleSelectors.selected, simpleSelectors.activeIndex],
  (list, activeIndex) => {
    if (activeIndex < list.length - 1) {
      return list[activeIndex + 1];
    }
    return null;
  },
);

export default StrictDict({
  ...simpleSelectors,
  selectedSubmissionId,
  hasPrevSubmission,
  hasNextSubmission,
  nextSubmissionId,
  prevSubmissionId,
  selected,
  selectedResponse,
  selectionLength,
  criterionGradeData,
});
