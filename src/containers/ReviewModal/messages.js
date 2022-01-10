import { defineMessages } from '@edx/frontend-platform/i18n';
import { StrictDict } from 'utils';

const messages = defineMessages({
  reloadSubmission: {
    id: 'ora-grading.ReviewModal.reloadSubmission',
    defaultMessage: 'Reload submission',
    description: 'Reload button text in case of network failure',
  },
  loadingResponse: {
    id: 'ora-grading.ReviewModal.loadingResponse',
    defaultMessage: 'Loading response',
    description: 'loading text for submission response review screen',
  },
  gradeNotSubmittedHeading: {
    id: 'ora-grading.ReviewModal.gradeNotSubmitted.heading',
    defaultMessage: 'Grade not submitted',
    description: 'Grade submission network error heading',
  },
  gradeNotSubmittedContent: {
    id: 'ora-grading.ReviewModal.gradeNotSubmitted.heading',
    defaultMessage: "We're sorry, something went wrong when we tried to submit this grade.  Please try again.",
    description: 'Grade submission network error message',
  },
  resubmitGrade: {
    id: 'ora-grading.ReviewModal.resubmitGrade',
    defaultMessage: 'Resubmit grate',
    description: 'Resubmit grade button after network failure',
  },
  dismiss: {
    id: 'ora-grading.ReviewModal.dismiss',
    defaultMessage: 'Dismiss',
    description: 'Dismiss error action button text',
  },
});

export default StrictDict(messages);
