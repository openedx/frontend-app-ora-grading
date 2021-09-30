import { StrictDict } from 'utils';
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
 *   oraMetadata: { name, prompt, type ('individual' vs 'team')  },
 *   courseMetadata: { courseOrg, courseName, courseNumber, courseId },
 *   submissions: {
 *     [submissionId]: {
 *       id: <submissionId>, (not currently used)
 *       username
 *       submissionId
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
 * get('/api/submission', { submissionId })
 * @return {
 *   submision: {
 *     gradeData,
 *     gradeStatus,
 *     response: { files: [{}], text: <html> },
 *   },
 * }
 */
const fetchSubmission = mockSuccess((submissionId) => (
  fakeData.mockSubmission(submissionId)
));

/**
 * fetches the current grade, gradeStatus, and rubricResponse data for the given submission
 * get('/api/submissionStatus', { submissionId })
 *   @return {obj} submissionStatus object
 *   {
 *     grade: { pointsEarned: 0, pointsPossible: 0 },
 *     gradeStatus,
 *     rubricResponses: {
 *       rubricComment: '',
 *       criteria: [
 *         { grade, comments },
 *       ],
 *     },
 *   }
 */
const fetchSubmissionStatus = mockSuccess((submissionId) => (
  fakeData.mockSubmissionStatus(submissionId)
));

/**
 * Fetches only the learner response for a given submission. Used for pre-fetching response
 * for neighboring submissions in the queue.
 */
export const fetchSubmissionResponse = mockSuccess((submissionId) => ({
  response: fakeData.mockSubmission(submissionId).response,
}));

/* I assume this is the "Start Grading" call, even for if a
 * submission is already graded and we are attempting re-lock.
 * Assuming the check for if allowed would happen locally first.
 * post('api/lock', { ora_location, submissionId });
 * @param {bool} value - new lock value
 * @param {string} submissionId
 */
const lockSubmission = mockSuccess(() => ({
  response: true,
}));

/*
 * Assuming we do not care who has locked it or why, as there
 * is no design around communicating that info
 * post('api/lock', { submissionId });
 * @param {bool} value - new lock value
 * @param {string} submissionId
 */
const lockSubmissionFail = mockFailure(() => ({
  error: 'that did not work',
}));

/*
 * post('api/updateGrade', { submissionId, gradeData })
 * @param {object} gradeData - full grading submission data
 * {
 *   rubricComments: '', (optional)
 *   criteria: [
 *     {
 *       comments: '', (optional)
 *       grade: '',
 *     },
 *     ...
 *   ],
 * }
 */
const updateGrade = mockSuccess((submissionId, gradeData) => {
  console.log({ updateGrade: { submissionId, gradeData } });
});

export default StrictDict({
  initializeApp,
  fetchSubmission,
  fetchSubmissionResponse,
  fetchSubmissionStatus,
  lockSubmission,
  lockSubmissionFail,
  updateGrade,
});
