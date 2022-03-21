import ids from './ids';
import { gradeStatuses, lockStatuses } from '../constants';

/**
 * Response entries, with identifier.
 * {
 *   id: {string}
 *   submissionUUID: {string}
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

const createSubmission = (score, gradeStatus, lockStatus) => {
  const index = lastIndex;
  lastIndex += 1;
  const submissionUUID = ids.submissionUUID(index);
  const gradeData = score === null ? null : {
    score,
    overallFeedback: 'was okay',
    criteria: [{
      name: 'firstCriterion',
      feedback: 'did alright',
      selectedOption: 'good',
    }],
  };
  submissions[submissionUUID] = {
    submissionUUID,
    username: ids.username(index),
    // teamName: '',
    dateSubmitted: new Date(date0 + (day * index)).toLocaleTimeString(),
    score,
    gradeData,
    gradeStatus,
    lockStatus,
  };
};

for (let i = 0; i < 10; i++) {
  createSubmission(null, gradeStatuses.ungraded, lockStatuses.unlocked);
  createSubmission(
    { pointsEarned: 70 + i, pointsPossible: 100 },
    gradeStatuses.graded,
    lockStatuses.locked,
  );
  createSubmission(
    { pointsEarned: 80 + i, pointsPossible: 100 },
    gradeStatuses.graded,
    lockStatuses.unlocked,
  );
  createSubmission(
    null,
    gradeStatuses.ungraded,
    lockStatuses.inProgress,
  );
  createSubmission(
    { pointsEarned: 90 + i, pointsPossible: 100 },
    gradeStatuses.graded,
    lockStatuses.inProgress,
  );
}

export default submissions;
