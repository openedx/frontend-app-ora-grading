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
 * get('/api/initialize')
 * @return {
 *   oraMetadata: { name, prompt },
 *   submissions: {
 *     [learnerId]: {
 *       id: <submissionId>, (not currently used)
 *       username,
 *       learnerId,
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
 * get('/api/submission', { learnerId })
 * @return {
 *   submision: {
 *     grade,
 *     learnerId,
 *     response: { files: [], text: <html> },
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
const fetchSubmission = mockSuccess((learnerId) => ({
  submission: fakeData.mockSubmission(learnerId),
}));

/* I assume this is the "Start Grading" call, even for if a
 * submission is already graded and we are attempting re-lock.
 * Assuming the check for if allowed would happen locally first.
 * post('api/lockSubmission', { learnerId });
 */
const lockSubmission = mockSuccess((learnerId) => {
  console.log({ lockSubmission: { learnerId } });
});

/*
 * Assuming we do not care who has locked it or why, as there
 * is no design around communicating that info
 * post('api/lockSubmission', { learnerId });
 */
const lockSubmissionFail = mockFailure((learnerId) => {
  console.log({ lockSubmissionFail: learnerId });
});

/*
 * post('api/updateGrade', { learnerId, gradeData })
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
const updateGrade = mockSuccess((learnerId, gradeData) => {
  console.log({ updateGrade: { learnerId, gradeData } });
});

export default StrictDict({
  initializeApp,
  fetchSubmission,
  lockSubmission,
  lockSubmissionFail,
  updateGrade,
});
