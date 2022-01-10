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
    description: 'Try to refetch the file',
  },
  fileNotFoundError: {
    id: 'ora-grading.ResponseDisplay.FileRenderer.fileNotFound',
    defaultMessage: 'File not found',
    description: 'File not found',
  },
  unknownError: {
    id: 'ora-grading.ResponseDisplay.FileRenderer.unknownError',
    defaultMessage: 'Unknown errors',
    description: 'Unknown errors',
  },
});

export default messages;
