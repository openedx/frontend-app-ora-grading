import { StrictDict } from 'utils';
import { gradeStatuses, lockStatuses } from './constants';
import fakeData from './fakeData';

// import urls from './urls';
// import { pageSize, paramKeys } from './constants';
// import messages from './messages';
// import * as utils from './utils';
// const { get, post, stringifyUrl } = utils;

/*********************************************************************************
 * GET Actions
 *********************************************************************************/

const mockSuccess = (returnValFn) => (...args) => (
  new Promise((resolve) => resolve(returnValFn(...args)))
);

const mockFailure = (returnValFn) => (...args) => (
  new Promise((resolve, reject) => reject(returnValFn(...args)))
);

/**
 * get('/api/initialize', { ora_location, course_id? })
 * @return {
 *   oraMetadata: { name, prompt, type ('individual' vs 'team'), rubricConfig, fileUploadResponseConfig },
 *   courseMetadata: { courseOrg, courseName, courseNumber, courseId },
 *   submissions: {
 *     [submissionUUID]: {
 *       id: <submissionUUID>, (not currently used)
 *       username
 *       submissionUUID
 *       dateSubmitted (timestamp)
 *       gradeStatus (['ungraded', 'graded', 'locked', 'locked_by_you'?])
 *       grade: { pointsEarned, pointsPossible }
 *     },
 *     ...
 *   },
 * }
 */
const initializeApp = mockSuccess(() => ({
  oraMetadata: fakeData.oraMetadata,
  courseMetadata: fakeData.courseMetadata,
  submissions: fakeData.submissions,
}));

/**
 * get('/api/submission', { submissionUUID })
 * @return {
 *   submision: {
 *     gradeData,
 *     gradeStatus,
 *     response: { files: [{}], text: <html> },
 *   },
 * }
 */
const fetchSubmission = mockSuccess((submissionUUID) => {
  console.log({ fetchSubmission: { submissionUUID } });
  return fakeData.mockSubmission(submissionUUID);
});

/**
 * fetches the current grade, gradeStatus, and rubricResponse data for the given submission
 * get('/api/submissionStatus', { submissionUUID })
 *   @return {obj} submissionStatus object
 *   {
 *     gradeData,
 *     gradeStatus,
 *     lockStatus,
 *   }
 */
const fetchSubmissionStatus = mockSuccess((submissionUUID) => (
  fakeData.mockSubmissionStatus(submissionUUID)
));

/**
 * Fetches only the learner response for a given submission. Used for pre-fetching response
 * for neighboring submissions in the queue.
 */
export const fetchSubmissionResponse = mockSuccess((submissionUUID) => ({
  response: fakeData.mockSubmission(submissionUUID).response,
}));

/* I assume this is the "Start Grading" call, even for if a
 * submission is already graded and we are attempting re-lock.
 * Assuming the check for if allowed would happen locally first.
 * post('api/lock', { ora_location, submissionUUID });
 * @param {bool} value - new lock value
 * @param {string} submissionUUID
 */
const lockSubmission = mockSuccess(({ submissionUUID, value }) => ({
  ...fakeData.mockSubmissionStatus(submissionUUID),
  lockStatus: value ? lockStatuses.inProgress : lockStatuses.unlocked,
}));

/*
 * Assuming we do not care who has locked it or why, as there
 * is no design around communicating that info
 * post('api/lock', { submissionUUID });
 * @param {bool} value - new lock value
 * @param {string} submissionUUID
 */
const lockSubmissionFail = mockFailure(() => ({
  error: 'that did not work',
}));

/*
 * post('api/updateGrade', { submissionUUID, gradeData })
 * @param {object} gradeData - full grading submission data
 */
const updateGrade = mockSuccess((submissionUUID, gradeData) => ({
  gradeData,
  gradeStatus: gradeStatuses.graded,
  lockStatus: lockStatuses.unlocked,
}));

export default StrictDict({
  initializeApp,
  fetchSubmission,
  fetchSubmissionResponse,
  fetchSubmissionStatus,
  lockSubmission,
  lockSubmissionFail,
  updateGrade,
});
