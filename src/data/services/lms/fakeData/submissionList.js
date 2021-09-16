import ids from './ids';
import { gradingStatuses as statuses } from '../constants';

/**
 * Response entries, with identifier.
 * {
 *   id: {string}
 *   learnerId: {string}
 *   dateSubmitted: {number}
 *   grade: {number}
 *   status: {string}
 * }
 */

const date0 = 1631215154955;
const day = 86400000;

const submissions = {};
let lastIndex = 0;

const createSubmission = (grade, status) => {
  const index = lastIndex;
  lastIndex += 1;
  const submissionId = ids.submissionId(index);
  const learnerId = ids.learnerId(index);
  submissions[submissionId] = {
    submissionId,
    username: ids.username(index),
    learnerId,
    dateSubmitted: date0 + (day * index),
    status,
    grade,
  };
};

for (let i = 0; i < 20; i++) {
  createSubmission(null, statuses.ungraded);
  createSubmission(70 + i, statuses.locked);
  createSubmission(80 + i, statuses.graded);
}

export default submissions;
