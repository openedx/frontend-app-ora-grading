import { StrictDict } from 'utils';

export const gradingStatuses = StrictDict({
  ungraded: 'ungraded',
  graded: 'graded',
  locked: 'locked',
  inProgress: 'in-progress',
});

export const gradingStatusDisplay = StrictDict({
  [gradingStatuses.ungraded]: 'Ungraded',
  [gradingStatuses.locked]: 'Grading In Progress',
  [gradingStatuses.graded]: 'Grading Complete',
  [gradingStatuses.inProgress]: 'Locked by you',
});
