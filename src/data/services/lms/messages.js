import { defineMessages } from '@edx/frontend-platform/i18n';
import { gradingStatuses } from './constants';

const messages = defineMessages({
  ungraded: {
    id: 'ora-grading.lms-api.gradingStatusDisplay.ungraded',
    defaultMessage: 'Ungraded',
    description: 'Grading status label for ungraded submission',
  },
  locked: {
    id: 'ora-grading.lms-api.gradingStatusDisplay.locked',
    defaultMessage: 'Currently being graded by someone else',
    description: 'Grading status label for locked submission',
  },
  graded: {
    id: 'ora-grading.lms-api.gradingStatusDisplay.graded',
    defaultMessage: 'Grading Completed',
    description: 'Grading status label for graded submission',
  },
  inProgress: {
    id: 'ora-grading.lms-api.gradingStatusDisplay.inProgress',
    defaultMessage: 'You are currently grading this response',
    description: 'Grading status label for in-progress submission',
  },
});

// re-keying the messages to ensure that the api can link to them even if the passed
// status keys change.
export default {
  [gradingStatuses.ungraded]: messages.ungraded,
  [gradingStatuses.locked]: messages.locked,
  [gradingStatuses.graded]: messages.graded,
  [gradingStatuses.inProgress]: messages.inProgress,
};
