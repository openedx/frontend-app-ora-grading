import { createSelector } from 'reselect';

import { StrictDict } from 'utils';
import { lockStatuses } from 'data/services/lms/constants';
import submissionsSelectors from './submissions';
import * as module from './grading';

export const simpleSelectors = {
  selected: state => state.grading.selected,
  activeIndex: state => state.grading.activeIndex,
  current: state => state.grading.current,
  gradeData: state => state.grading.gradeData,
};

/**
 * returns the length of the list of selected submissions
 * @return {number} selected submission list length
 */
export const selectionLength = createSelector(
  [module.simpleSelectors.selected],
  (selected) => selected.length,
);

/**************************************************
 * Selected Submission Selectors
 **************************************************/
export const selected = {};

/**
 * returns the selected submission id
 * Note: Not loaded from current as this is what sets that value in the
 *   (current) bucket
 * @return {string} selected submission id
 */
selected.submissionId = createSelector(
  [module.simpleSelectors.selected, submissionsSelectors.allSubmissions],
  (selectedIds, submissions) => submissions[selectedIds[0]].submissionId,
);

/**
 * Returns the grade status for the selected submission
 * @return {string} grade status
 */
selected.gradeStatus = createSelector(
  [module.simpleSelectors.current],
  (current) => current.gradeStatus,
);

/**
 * Returns the lock status for the selected submission
 * @return {string} lock status
 */
selected.lockStatus = createSelector(
  [module.simpleSelectors.current],
  (current) => current.lockStatus,
);

/**
 * Returns the response data for the selected submission
 * @return {obj} response
 *   { text, files: [] }
 */
selected.response = createSelector(
  [module.simpleSelectors.current],
  (current) => current.response,
);

/**
 * Returns the "grading" status for the selected submission,
 * which is a combination of the grade and lock statuses.
 * @return {string} grading status
 */
selected.gradingStatus = createSelector(
  [module.selected.gradeStatus, module.selected.lockStatus],
  (gradeStatus, lockStatus) => (lockStatus === lockStatuses.unlocked ? gradeStatus : lockStatus),
);

/***********************************
 * Selected Submission - Statuc Data
 ***********************************/

/**
 * returns static data from the active selected submission
 * @return {obj} - staticData
 *  { submissionId, username, teamName, dateSubmitted }
 */
selected.staticData = createSelector(
  [module.selected.submissionId, submissionsSelectors.allSubmissions],
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
selected.username = createSelector(
  [module.selected.staticData],
  (staticData) => staticData.username,
);

/***********************************
 * Selected Submission - Grade Data
 ***********************************/

/**
 * Returns the grade data for the selected submission
 * @return {obj} grade data
 *  { score, overallFeedback, criteria }
 */
selected.gradeData = createSelector(
  [module.selected.submissionId, module.simpleSelectors.gradeData],
  (submissionId, gradeData) => gradeData[submissionId],
);

/**
 * Returns list of criterion grade data for the current selection
 * @return {obj[]} criterion grade data entries
 */
selected.criteriaGradeData = createSelector(
  [module.selected.gradeData],
  (data) => (data ? data.criteria : []),
);

/**
 * Returns the rubric-level feedback for the selected submission
 * @return {string} selected submission's associated rubric-level feedback
 */
selected.overallFeedback = createSelector(
  [module.selected.gradeData],
  (data) => (data ? data.overallFeedback : ''),
);

/**
 * Returns the grade data for the given criterion of the current
 * selection
 * @param {number} orderNum - criterion orderNum (and index)
 * @return {obj} - Grade Data associated with the criterion
 */
selected.criterionGradeData = (state, { orderNum }) => {
  const data = module.selected.criteriaGradeData(state);
  return data ? data[orderNum] : {};
};

/**
 * Returns the critierion-level feedback for the selected submission, given the
 * orderNum of the criterion.
 * @param {number} orderNum - criterion index
 * @return {string} - criterion-level feedback response for the given criterion.
 */
selected.criterionFeedback = (state, { orderNum }) => {
  const data = module.selected.criterionGradeData(state, { orderNum });
  return data ? data.feedback : '';
};

/*************************************************
 * Next/Previous Submission Selectors
 *************************************************/
const next = {
  /**
   * Returns true iff there exists a selection after the current selection
   * in the queue.
   * @return {bool} has next submission?
   */
  doesExist: createSelector(
    [simpleSelectors.selected, simpleSelectors.activeIndex],
    (list, activeIndex) => activeIndex < list.length - 1,
  ),
  /**
   * Returns the submissionId for the next submission in the selection queu
   * @return {string} next submission id (null if there isn't one)
   */
  submissionId: createSelector(
    [simpleSelectors.selected, simpleSelectors.activeIndex],
    (list, activeIndex) => {
      if (activeIndex < list.length - 1) {
        return list[activeIndex + 1];
      }
      return null;
    },
  ),
};
const prev = {
  /*
   * Returns true iff there exists a selection previous to the current selection
   * in the queue.
   * @return {bool} has previous submission?
   */
  doesExist: createSelector(
    [simpleSelectors.activeIndex],
    (activeIndex) => activeIndex > 0,
  ),
  /**
   * Returns the submissionId for the previous submission in the selection queu
   * @return {string} previous submission id (null if there isn't one)
   */
  submissionId: createSelector(
    [simpleSelectors.selected, simpleSelectors.activeIndex],
    (list, activeIndex) => {
      if (activeIndex > 0) {
        return list[activeIndex - 1];
      }
      return null;
    },
  ),
};

export default StrictDict({
  ...simpleSelectors,
  next: StrictDict(next),
  prev: StrictDict(prev),
  selected: StrictDict(selected),
  selectionLength,
});
