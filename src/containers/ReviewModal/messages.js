import { defineMessages } from '@edx/frontend-platform/i18n';
import { StrictDict } from 'utils';

const messages = defineMessages({
  loadingResponse: {
    id: 'ora-grading.ReviewModal.loadingResponse',
    defaultMessage: 'Loading response',
    description: 'loading text for submission response review screen',
  },
});

export default StrictDict(messages);
