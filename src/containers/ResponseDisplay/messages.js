import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  tableNameHeader: {
    id: 'ora-grading.ResponseDisplay.SubmissionFiles.tableNameHeader',
    defaultMessage: 'Name',
    description: 'Table header file name',
  },
  tableExtensionHeader: {
    id: 'ora-grading.ResponseDisplay.SubmissionFiles.tableExtensionHeader',
    defaultMessage: 'File Extension',
    description: 'Table header file extension',
  },
  tablePopoverHeader: {
    id: 'ora-grading.ResponseDisplay.SubmissionFiles.tablePopoverHeader',
    defaultMessage: 'File Metadata',
    description: 'Table header for popover file metadata',
  },
  downloadFiles: {
    id: 'ora-grading.ResponseDisplay.SubmissionFiles.downloadFiles',
    defaultMessage: 'Download files',
    description: 'Download files inactive state label',
  },
  downloading: {
    id: 'ora-grading.ResponseDisplay.SubmissionFiles.downloading',
    defaultMessage: 'Downloading',
    description: 'Download files pending state label',
  },
  downloaded: {
    id: 'ora-grading.ResponseDisplay.SubmissionFiles.downloaded',
    defaultMessage: 'Downloaded!',
    description: 'Download files completed state label',
  },
  retryDownload: {
    id: 'ora-grading.ResponseDisplay.SubmissionFiles.retryDownload',
    defaultMessage: 'Retry download',
    description: 'Download files failed state label',
  },
  submissionFiles: {
    id: 'ora-grading.ResponseDisplay.SubmissionFiles.submissionFile',
    defaultMessage: 'Submission Files',
    description: 'Total submission files',
  },
  exceedFileSize: {
    id: 'ora-grading.ResponseDisplay.SubmissionFiles.fileSizeExceed',
    defaultMessage: 'Exceeded the allow download size',
    description: 'Exceed the allow download size error message',
  },
});

export default messages;
