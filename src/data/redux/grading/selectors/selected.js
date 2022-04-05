import { createSelector } from 'reselect';

import { lockStatuses } from 'data/services/lms/constants';
import submissionsSelectors from '../../submissions/selectors';
import appSelectors from '../../app/selectors';

import * as module from './selected';
import { simpleSelectors } from './base';

export const gradingStatusTransform = ({ gradeStatus, lockStatus }) => (
  lockStatus === lockStatuses.unlocked ? gradeStatus : lockStatus
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
selected.submissionUUID = createSelector(
  [
    simpleSelectors.selection,
    submissionsSelectors.allSubmissions,
    simpleSelectors.activeIndex,
  ],
  (selectedIds, submissions, activeIndex) => submissions[selectedIds[activeIndex]].submissionUUID,
);

/**
 * Returns the grade status for the selected submission
 * @return {string} grade status
 */
selected.gradeStatus = createSelector([simpleSelectors.current], (current) => current.gradeStatus);

/**
 * Returns the lock status for the selected submission
 * @return {string} lock status
 */
selected.lockStatus = createSelector([simpleSelectors.current], (current) => current.lockStatus);

/**
 * Returns the response data for the selected submission
 * @return {obj} response
 *   { text, files: [] }
 */
selected.response = createSelector([simpleSelectors.current], (current) => current.response);

/**
 * Returns the "grading" status for the selected submission,
 * which is a combination of the grade and lock statuses.
 * @return {string} grading status
 */
selected.gradingStatus = createSelector(
  [module.selected.gradeStatus, module.selected.lockStatus],
  (gradeStatus, lockStatus) => module.gradingStatusTransform({ gradeStatus, lockStatus }),
);

selected.isGrading = createSelector(
  [module.selected.gradingStatus],
  (gradingStatus) => gradingStatus === lockStatuses.inProgress,
);

/***********************************
 * Selected Submission - Static Data
 ***********************************/

/**
 * returns static data from the active selected submission
 * @return {obj} - staticData
 *  { submissionUUID, username, teamName, dateSubmitted }
 */
selected.staticData = createSelector(
  [module.selected.submissionUUID, submissionsSelectors.allSubmissions],
  (submissionUUID, allSubmissions) => {
    const submission = allSubmissions[submissionUUID];
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

selected.teamName = createSelector(
  [module.selected.staticData],
  (staticData) => staticData.teamName,
);

selected.userDisplay = createSelector(
  [
    appSelectors.ora.isIndividual,
    module.selected.username,
    module.selected.teamName,
  ],
  (isIndividual, username, teamName) => (isIndividual ? username : teamName),
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
  [module.selected.submissionUUID, simpleSelectors.gradeData],
  (submissionUUID, gradeData) => gradeData[submissionUUID],
);

/**
 * Returns the local grading data for the selected submission
 * @return {obj} local grade data
 *  { overallFeedback, criteria }
 */
selected.gradingData = createSelector(
  [module.selected.submissionUUID, simpleSelectors.gradingData],
  (submissionUUID, gradingData) => gradingData[submissionUUID],
);

/**
 * Returns list of criterion grade data for the current selection for review
 * and grading views.
 * @return {obj} criterion grade data entries ({ review: [{}], grading: [{}] })
 */
selected.criteriaGradeData = createSelector(
  [module.selected.isGrading, module.selected.gradeData, module.selected.gradingData],
  (isGrading, remote, local) => {
    const entry = isGrading ? local : remote;
    return entry ? entry.criteria : [];
  },
);

/**
 * Returns the score object associated with the grade
 * @return {obj} score object
 */
selected.score = createSelector(
  [module.selected.gradeData],
  (data) => ((data && data.score) ? data.score : {}),
);

/**
 * Returns the rubric-level feedback for the selected submission for both review
 * and grading views.
 * @return {obj} selected submission's associated rubric-level feedback
 *   ({ review: '', grading: '' })
 */
selected.overallFeedback = createSelector(
  [module.selected.isGrading, module.selected.gradeData, module.selected.gradingData],
  (isGrading, remote, local) => {
    const entry = isGrading ? local : remote;
    return entry?.overallFeedback || '';
  },
);

/**
 * Returns the grade data for the given criterion of the current
 * selection for both review and grading views.
 * @param {number} orderNum - criterion orderNum (and index)
 * @return {obj} - Grade Data associated with the criterion
 *   ({ review: {}, grading: {} })
 */
selected.criterionGradeData = (state, { orderNum }) => {
  const entry = module.selected.criteriaGradeData(state);
  return entry ? entry[orderNum] : {};
};

/**
 * Returns the selected option for the given criterion of the current selection for
 * both review and grading views.
 * @param {number} orderNum - criterion orderNum (and index)
 * @return {obj} - selected option associated with the criterion
 *   ({ review: '', grading: '' })
 */
selected.criterionSelectedOption = (state, { orderNum }) => {
  const entry = module.selected.criterionGradeData(state, { orderNum });
  return entry?.selectedOption || '';
};

selected.criterionFeedback = (state, { orderNum }) => {
  const entry = module.selected.criterionGradeData(state, { orderNum });
  return entry?.feedback || '';
};

export default selected;
