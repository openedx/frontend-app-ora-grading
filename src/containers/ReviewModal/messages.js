import { defineMessages } from '@edx/frontend-platform/i18n';

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
  loadingResponse: {
    id: 'ora-grading.ReviewModal.loadingResponse',
    defaultMessage: 'Loading response',
    description: 'loading text for submission response review screen',
  },
});

export default messages;
