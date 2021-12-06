import { StrictDict } from 'utils';
import { configuration } from 'config';

const baseUrl = `${configuration.LMS_BASE_URL}`;

const api = `${baseUrl}/api/`;
const baseEsgUrl = `${api}ora_staff_grader/mock/`;

const oraInitializeUrl = `${baseEsgUrl}initialize`;
const fetchSubmissionUrl = `${baseEsgUrl}submission`;
const fetchSubmissionStatusUrl = `${baseEsgUrl}submission/status`;
const fetchSubmissionLockUrl = `${baseEsgUrl}submission/lock`;
const updateSubmissionGradeUrl = `${baseEsgUrl}submission/grade`;

const course = (courseId) => `${baseUrl}/courses/${courseId}`;

const openResponse = (courseId) => (
  `${course(courseId)}/instructor#view-open_response_assessment`
);
const ora = (courseId, locationId) => `${course(courseId)}/jump_to/${locationId}`;

export default StrictDict({
  api,
  oraInitializeUrl,
  fetchSubmissionUrl,
  fetchSubmissionStatusUrl,
  fetchSubmissionLockUrl,
  updateSubmissionGradeUrl,
  baseUrl,
  course,
  openResponse,
  ora,
});
