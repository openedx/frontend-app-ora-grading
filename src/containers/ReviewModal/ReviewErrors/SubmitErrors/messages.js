/* eslint-disable quotes */
import { defineMessages } from '@edx/frontend-platform/i18n';
import { StrictDict } from 'utils';

const messages = defineMessages({
  gradeNotSubmittedHeading: {
    id: 'ora-grading.ReviewModal.gradeNotSubmitted.heading',
    defaultMessage: 'Grade not submitted',
    description: 'Grade submission network error heading',
  },
  gradeNotSubmittedContent: {
    id: 'ora-grading.ReviewModal.gradeNotSubmitted.Content',
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
  errorSubmittingGradeHeading: {
    id: 'ora-grading.ReviewModal.errorSubmittingGrade.Heading',
    defaultMessage: 'Error submitting grade',
    description: 'Error Submitting Grade heading text',
  },
  errorSubmittingGradeContent: {
    id: 'ora-grading.ReviewModal.errorSubmittingGrade.Content',
    defaultMessage: 'It looks like someone else got here first!  Your grade submission has been rejected',
    description: 'Error Submitting Grade content',
  },
});

export default StrictDict(messages);
