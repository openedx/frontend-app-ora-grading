import { StrictDict } from 'utils';
import { configuration } from 'config';

const baseUrl = `${configuration.LMS_BASE_URL}`;

const api = `${baseUrl}/api/`;
const course = (courseId) => `${baseUrl}/courses/${courseId}`;

const openResponse = (courseId) => (
  `${course(courseId)}/instructor#view-open_response_assessment`
);
const ora = (courseId, locationId) => `${course(courseId)}/jump_to/${locationId}`;

export default StrictDict({
  api,
  baseUrl,
  course,
  openResponse,
  ora,
});
