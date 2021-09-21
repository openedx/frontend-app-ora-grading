import ids from './ids';
import { gradingStatuses as statuses } from '../constants';

/**
 * Response entries, with identifier.
 * {
 *   id: {string}
 *   submissionId: {string}
 *   username: {string} (optional)
 *   dateSubmitted: {number}
 *   grade: {
 *     pointsPossible: {number}
 *     pointsEarned: {number}
 *   }
 *   gradeStatus: {string}
 * }
 */

const date0 = 1631215154955;
const day = 86400000;

const submissions = {};
let lastIndex = 0;

const createSubmission = (score, gradeStatus) => {
  const index = lastIndex;
  lastIndex += 1;
  const submissionId = ids.submissionId(index);
  const gradeData = score === null ? null : {
    score,
    overallFeedback: 'was okay',
    criteria: [{
      name: 'firstCriterion',
      feedback: 'did alright',
      selectedOption: 'good'
    }],
  };
  submissions[submissionId] = {
    submissionId,
    username: ids.username(index),
    // teamName: '',
    dateSubmitted: date0 + (day * index),
    score,
    gradeData,
    gradeStatus,
  };
};

for (let i = 0; i < 20; i++) {
  createSubmission(null, statuses.ungraded);
  createSubmission(
    { pointsEarned: 70 + i, pointsPossible: 100 },
    statuses.locked,
  );
  createSubmission(
    { pointsEarned: 80 + i, pointsPossible: 100 },
    statuses.graded,
  );
  createSubmission(
    null,
    statuses.inProgress,
  );
}

export default submissions;
