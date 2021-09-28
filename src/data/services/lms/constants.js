import { StrictDict } from 'utils';

export const lockStatuses = StrictDict({
  unlocked: 'unlocked',
  locked: 'locked',
  inProgress: 'in-progress',
});

export const gradeStatuses = StrictDict({
  ungraded: 'ungraded',
  graded: 'graded',
});

export const gradingStatuses = StrictDict({
  ungraded: gradeStatuses.ungraded,
  graded: gradeStatuses.graded,
  locked: lockStatuses.locked,
  inProgress: lockStatuses.inProgress,
});

export const gradingStatusDisplay = StrictDict({
  [gradingStatuses.ungraded]: 'Ungraded',
  [gradingStatuses.locked]: 'Currently being graded by someone else',
  [gradingStatuses.graded]: 'Grading Complete',
  [gradingStatuses.inProgress]: 'You are currently grading this response',
});

export const feedbackRequirement = StrictDict({
  disabled: 'disabled',
  required: 'required',
  optional: 'optional',
});
