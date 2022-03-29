import { defineMessages } from '@edx/frontend-platform/i18n';
import { StrictDict } from 'utils';

const messages = defineMessages({
  loadingResponse: {
    id: 'ora-grading.ReviewModal.loadingResponse',
    defaultMessage: 'Loading response',
    description: 'loading text for submission response review screen',
  },
  demoTitleMessage: {
    id: 'ora-grading.ReviewModal.demoTitleMessage',
    defaultMessage: 'Grading Demo',
    description: 'message added to modal title, indicating grading demo',
  },
});

export default StrictDict(messages);
