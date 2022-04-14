/* eslint-disable quotes */
import { defineMessages } from '@edx/frontend-platform/i18n';
import { StrictDict } from 'utils';

const messages = defineMessages({
  loadErrorHeading: {
    id: 'ora-grading.ReviewModal.loadErrorHeading',
    defaultMessage: 'Error loading submissions',
    description: 'Submission response load failure alert header',
  },
  loadErrorMessage: {
    id: 'ora-grading.ReviewModal.loadErrorMessage1',
    defaultMessage: 'An error occurred while loading this submission.  Try reloading this submission.',
    description: 'Submission response load failure alert message',
  },
  reloadSubmission: {
    id: 'ora-grading.ReviewModal.reloadSubmission',
    defaultMessage: 'Reload submission',
    description: 'Reload button text in case of network failure',
  },
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
  errorLockContestedHeading: {
    id: 'ora-grading.ReviewModal.errorLockContestedHeading',
    defaultMessage: 'The lock owned by another user',
    description: 'Error lock by someone else',
  },
  errorLockContested: {
    id: 'ora-grading.ReviewModal.errorLockContested',
    defaultMessage: 'The lock owned by another user',
    description: 'Error lock by someone else',
  },
  errorLockBadRequestHeading: {
    id: 'ora-grading.ReviewModal.errorLockBadRequestHeading',
    defaultMessage: 'Invalid request. Please check your input.',
    description: 'Error lock request for missing params',
  },
  errorLockBadRequest: {
    id: 'ora-grading.ReviewModal.errorLockBadRequest',
    defaultMessage: 'Invalid request. Please check your input.',
    description: 'Error lock request for missing params',
  },
  downloadFailedHeading: {
    id: 'ora-grading.ReviewModal.errorDownloadFailed',
    defaultMessage: `Couldn't download files`,
  },
  downloadFailedContent: {
    id: 'ora-grading.ReviewModal.errorDownloadFailedContent',
    defaultMessage: `We're sorry, something went wrong when we tried to download these files.  Please try again.`,
    description: 'Failed download error content',
  },
  retryDownload: {
    id: 'ora-grading.ReviewModal.errorRetryDownload',
    defaultMessage: 'Retry download',
    description: 'Failed download retry button text',
  },
  failedFiles: {
    id: 'ora-grading.ReviewModal.errorDownloadFailedFiles',
    defaultMessage: 'Failed files:',
    description: 'List header for file download failure alert',
  },
});

export default StrictDict(messages);
