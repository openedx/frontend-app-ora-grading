import { StrictDict } from 'utils';

export const RequestStates = StrictDict({
  inactive: 'inactive',
  pending: 'pending',
  completed: 'completed',
  failed: 'failed',
});

export const RequestKeys = StrictDict({
  initialize: 'initialize',
  fetchSubmission: 'fetchSubmission',
  fetchSubmissionStatus: 'fetchSubmissionStatus',
  setLock: 'setLock',
  prefetchNext: 'prefetchNext',
  prefetchPrev: 'prefetchPrev',
  submitGrade: 'submitGrade',
});
