import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  fileInfo: {
    id: 'ora-grading.InfoPopover.fileInfo',
    defaultMessage: 'File info',
    description: 'Popover trigger button text for file preview card',
  },
  retryButton: {
    id: 'ora-grading.ResponseDisplay.FileRenderer.retryButton',
    defaultMessage: 'Retry',
    description: 'Retry button for error in file renderer',
  },
  fileNotFoundError: {
    id: 'ora-grading.ResponseDisplay.FileRenderer.fileNotFound',
    defaultMessage: 'File not found',
    description: 'File not found error message',
  },
  unknownError: {
    id: 'ora-grading.ResponseDisplay.FileRenderer.unknownError',
    defaultMessage: 'Unknown errors',
    description: 'Unknown errors message',
  },
});

export default messages;
