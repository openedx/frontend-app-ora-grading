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
 *   submissions: {
 *     [submissionId]: {
 *       id: <submissionId>, (not currently used)
 *       username,
 *       submissionId,
 *       dateSubmitted, (timestamp)
 *       status, ['ungraded', 'graded', 'locked', 'locked_by_you'?]
 *       grade, (number)
 *     },
 *     ...
 *   },
 * }
 */
const initializeApp = mockSuccess(() => ({
  oraMetadata: fakeData.oraMetadata,
  submissions: fakeData.submissions,
}));

/**
 * get('/api/submission', { submissionId })
 * @return {
 *   submision: {
 *     grade,
 *     submissionId,
 *     response: { files: [], text: <html> },
 *     status,
 *     rubric: {
 *       name,
 *       comments (optional),
 *       criteria: [
 *         {
 *           name,
 *           description,
 *           points,
 *           grade,
 *           comments,
 *         }
 *       ],
 *     },
 *   },
 * }
 */
const fetchSubmission = mockSuccess((submissionId) => ({
  submission: fakeData.mockSubmission(submissionId),
}));

/**
 * get('/api/submissionStatus', { submissionId })
 *   submission: {
 *     grade,
 *     status,
 *     rubricResponses: {
 *       rubricComment: '',
 *       criteria: [
 *         { grade, comments },
 *       ],
 *     },
 *   },
 */
const fetchSubmissionStatus = mockSuccess((submissionId) => ({
  submissionData: fakeData.mockSubmission(submissionId),
}));

/* I assume this is the "Start Grading" call, even for if a
 * submission is already graded and we are attempting re-lock.
 * Assuming the check for if allowed would happen locally first.
 * post('api/lock', { ora_location, submissionId });
 * @param {bool} value - new lock value
 * @param {string} submissionId
 */
const lockSubmission = mockSuccess(({ value, submissionId }) => {
  console.log({ lockSubmission: { value, submissionId } });
});

/*
 * Assuming we do not care who has locked it or why, as there
 * is no design around communicating that info
 * post('api/lock', { submissionId });
 * @param {bool} value - new lock value
 * @param {string} submissionId
 */
const lockSubmissionFail = mockFailure(({ value, submissionId }) => {
  console.log({ lockSubmissionFail: { value, submissionId } });
});

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
  fetchSubmissionStatus,
  lockSubmission,
  lockSubmissionFail,
  updateGrade,
});
