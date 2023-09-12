import { StrictDict } from 'utils';
import { locationId } from 'data/constants/app';
import { paramKeys } from './constants';
import urls from './urls';
import {
  client,
  get,
  post,
  stringifyUrl,
} from './utils';

/*********************************************************************************
 * GET Actions
 *********************************************************************************/

/**
 * get('/api/initialize', { oraLocation })
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
const initializeApp = () => get(
  stringifyUrl(urls.oraInitializeUrl(), {
    [paramKeys.oraLocation]: locationId(),
  }),
).then(response => response.data);

/**
 * get('/api/submission', { oraLocation, submissionUUID })
 * @return {
 *   submission: {
 *     gradeData,
 *     gradeStatus,
 *     response: { files: [{}], text: <html> },
 *   },
 * }
 */
const fetchSubmission = (submissionUUID) => get(
  stringifyUrl(urls.fetchSubmissionUrl(), {
    [paramKeys.oraLocation]: locationId(),
    [paramKeys.submissionUUID]: submissionUUID,
  }),
).then(response => response.data);

/**
 * get('/api/submission/files', { oraLocation, submissionUUID })
 * @return {
 *     response: { files: [{}], text: <html> },
 * }
 */
const fetchSubmissionFiles = (submissionUUID) => get(
  stringifyUrl(urls.fetchSubmissionFilesUrl(), {
    [paramKeys.oraLocation]: locationId(),
    [paramKeys.submissionUUID]: submissionUUID,
  }),
).then(response => response.data);

/**
 * fetches the current grade, gradeStatus, and rubricResponse data for the given submission
 * get('/api/submissionStatus', { oraLocation, submissionUUID })
 *   @return {obj} submissionStatus object
 *   {
 *     gradeData,
 *     gradeStatus,
 *     lockStatus,
 *   }
 */
const fetchSubmissionStatus = (submissionUUID) => get(
  stringifyUrl(urls.fetchSubmissionStatusUrl(), {
    [paramKeys.oraLocation]: locationId(),
    [paramKeys.submissionUUID]: submissionUUID,
  }),
).then(response => response.data);

/**
 * post('api/lock', { oraLocation, submissionUUID });
 * @param {string} submissionUUID
 */
const lockSubmission = (submissionUUID) => post(
  stringifyUrl(urls.fetchSubmissionLockUrl(), {
    [paramKeys.oraLocation]: locationId(),
    [paramKeys.submissionUUID]: submissionUUID,
  }),
).then(response => response.data);

/**
 * unlockSubmission(submissionUUID)
 * @param {string} submissionUUID
 */
const unlockSubmission = (submissionUUID) => client().delete(
  stringifyUrl(urls.fetchSubmissionLockUrl(), {
    [paramKeys.oraLocation]: locationId(),
    [paramKeys.submissionUUID]: submissionUUID,
  }),
).then(response => response.data);

/**
 * batchUnlockSubmissions(submissionUUIDs)
 * @param {string[]} submissionUUIDs - list of submission uuids
 */
const batchUnlockSubmissions = (submissionUUIDs) => post(
  stringifyUrl(
    urls.batchUnlockSubmissionsUrl(),
    { [paramKeys.oraLocation]: locationId() },
  ),
  { submissionUUIDs },
).then(response => response.data);

/*
 * post('api/updateGrade', { submissionUUID, gradeData })
 * @param {object} gradeData - full grading submission data
 */
const updateGrade = (submissionUUID, gradeData) => post(
  stringifyUrl(urls.updateSubmissionGradeUrl(), {
    [paramKeys.oraLocation]: locationId(),
    [paramKeys.submissionUUID]: submissionUUID,
  }),
  gradeData,
).then(response => response.data);

export default StrictDict({
  initializeApp,
  fetchSubmission,
  fetchSubmissionFiles,
  fetchSubmissionStatus,
  lockSubmission,
  updateGrade,
  unlockSubmission,
  batchUnlockSubmissions,
});
