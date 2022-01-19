import { createSelector } from 'reselect';

import { StrictDict } from 'utils';
import { feedbackRequirement, lockStatuses } from 'data/services/lms/constants';
import submissionsSelectors from '../submissions/selectors';
import appSelectors from '../app/selectors';
import * as module from './selectors';

// const mkSimpleSelector = (cb) => createSelector([], cb);

export const simpleSelectors = {
  selected: state => state.grading.selected,
  activeIndex: state => state.grading.activeIndex,
  current: state => state.grading.current,
  gradeData: state => state.grading.gradeData,
  gradingData: state => state.grading.gradingData,
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
selected.submissionUUID = createSelector(
  [
    module.simpleSelectors.selected,
    submissionsSelectors.allSubmissions,
    module.simpleSelectors.activeIndex,
  ],
  (selectedIds, submissions, activeIndex) => submissions[selectedIds[activeIndex]].submissionUUID,
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

export const gradingStatusTransform = ({ gradeStatus, lockStatus }) => (
  lockStatus === lockStatuses.unlocked ? gradeStatus : lockStatus
);

/**
 * Returns the "grading" status for the selected submission,
 * which is a combination of the grade and lock statuses.
 * @return {string} grading status
 */
selected.gradingStatus = createSelector(
  [module.selected.gradeStatus, module.selected.lockStatus],
  (gradeStatus, lockStatus) => gradingStatusTransform({ gradeStatus, lockStatus }),
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
  [module.selected.submissionUUID, module.simpleSelectors.gradeData],
  (submissionUUID, gradeData) => gradeData[submissionUUID],
);

/**
 * Returns the local grading data for the selected submission
 * @return {obj} local grade data
 *  { overallFeedback, criteria }
 */
selected.gradingData = createSelector(
  [module.selected.submissionUUID, module.simpleSelectors.gradingData],
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

/*************************************************
 * Next/Previous Submission Selectors
 *************************************************/
export const next = {
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
   * Returns the submissionUUID for the next submission in the selection queu
   * @return {string} next submission id (null if there isn't one)
   */
  submissionUUID: createSelector(
    [simpleSelectors.selected, simpleSelectors.activeIndex],
    (list, activeIndex) => {
      if (activeIndex < list.length - 1) {
        return list[activeIndex + 1];
      }
      return null;
    },
  ),
};
export const prev = {
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
   * Returns the submissionUUID for the previous submission in the selection queue
   * @return {string} previous submission id (null if there isn't one)
   */
  submissionUUID: createSelector(
    [simpleSelectors.selected, simpleSelectors.activeIndex],
    (list, activeIndex) => {
      if (activeIndex > 0) {
        return list[activeIndex - 1];
      }
      return null;
    },
  ),
};

export const validation = {};

validation.show = createSelector(
  [module.selected.gradingData],
  (gradingData) => gradingData?.showValidation || false,
);

validation.overallFeedback = createSelector(
  [module.selected.gradingData, appSelectors.rubric.config],
  (gradingData, rubricConfig) => !(
    rubricConfig.feedback === feedbackRequirement.required
    && gradingData?.overallFeedback === ''
  ),
);
validation.overallFeedbackIsInvalid = createSelector(
  [module.validation.show, module.validation.overallFeedback],
  (show, overallFeedback) => show && !overallFeedback,
);

validation.criteria = createSelector(
  [module.selected.gradingData, appSelectors.rubric.config],
  (gradingData, rubricConfig) => rubricConfig.criteria.map((criterion, index) => ({
    feedback: !(
      criterion.feedback === feedbackRequirement.required
      && gradingData.criteria[index].feedback === ''
    ),
    selectedOption: gradingData.criteria[index].selectedOption !== '',
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
  (overallFeedback, criteria) => overallFeedback && criteria.every(
    ({ feedback, selectedOption }) => feedback && selectedOption,
  ),
);

export default StrictDict({
  ...simpleSelectors,
  next: StrictDict(next),
  prev: StrictDict(prev),
  selected: StrictDict(selected),
  selectionLength,
  validation: StrictDict(validation),
});
