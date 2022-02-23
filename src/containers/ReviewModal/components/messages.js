import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  closeReviewConfirmTitle: {
    id: 'ora-grading.ReviewModal.closeReviewConfirm.title',
    defaultMessage: 'Are you sure you want to close this modal?',
    description: 'Prompt confirmation for closing modal',
  },
  closeReviewConfirmWarning: {
    id: 'ora-grading.ReviewModal.closeReviewConfirmWarning',
    defaultMessage: 'This cannot be undone. This will discard unsaved work and stop this grading process.',
    description: 'Confirm discard on unsaved work and close the modal',
  },
  goBack: {
    id: 'ora-grading.ReviewModal.goBack',
    defaultMessage: 'Go back',
    description: 'Cancel closing the modal button text',
  },
  confirmCloseModalAction: {
    id: 'ora-grading.ReviewModal.CloseReviewConfirmModal.confirmText',
    defaultMessage: 'Close Modal',
    description: 'Confirm closing the modal button text',
  },
});

export default messages;
