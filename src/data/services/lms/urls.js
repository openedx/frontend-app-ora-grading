import { StrictDict } from 'utils';
import { getConfig } from '@edx/frontend-platform';

const baseUrl = () => getConfig().LMS_BASE_URL;

const api = () => `${baseUrl()}/api/`;
const baseEsgUrl = () => `${api()}ora_staff_grader/`;

const oraInitializeUrl = () => `${baseEsgUrl()}initialize`;
const fetchSubmissionUrl = () => `${baseEsgUrl()}submission`;
const fetchSubmissionFilesUrl = () => `${baseEsgUrl()}submission/files`;
const fetchSubmissionStatusUrl = () => `${baseEsgUrl()}submission/status`;
const fetchSubmissionLockUrl = () => `${baseEsgUrl()}submission/lock`;
const batchUnlockSubmissionsUrl = () => `${baseEsgUrl()}submission/batch/unlock`;
const updateSubmissionGradeUrl = () => `${baseEsgUrl()}submission/grade`;

const course = (courseId) => `${baseUrl()}/courses/${courseId}`;

const openResponse = (courseId) => (
  `${course(courseId)}/instructor#view-open_response_assessment`
);
const ora = (courseId, locationId) => `${course(courseId)}/jump_to/${locationId}`;

export default StrictDict({
  api,
  oraInitializeUrl,
  fetchSubmissionUrl,
  fetchSubmissionFilesUrl,
  fetchSubmissionStatusUrl,
  fetchSubmissionLockUrl,
  batchUnlockSubmissionsUrl,
  updateSubmissionGradeUrl,
  baseUrl,
  course,
  openResponse,
  ora,
});
