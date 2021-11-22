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

export const feedbackRequirement = StrictDict({
  disabled: 'disabled',
  required: 'required',
  optional: 'optional',
});

export const fileUploadResponseOptions = StrictDict({
  required: 'required',
  optional: 'optional',
  none: 'none',
});
