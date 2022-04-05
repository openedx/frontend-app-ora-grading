/* eslint-disable quotes */
import { defineMessages } from '@edx/frontend-platform/i18n';
import { StrictDict } from 'utils';

const messages = defineMessages({
  demoModeHeading: {
    id: 'ora-grading.ReviewModal.demoHeading',
    defaultMessage: 'Demo Mode',
    description: 'Demo mode heading',
  },
  demoModeMessage: {
    id: 'ora-grading.ReviewModal.demoMessage',
    defaultMessage: 'You are using the Demo Mode of the new Enhanced ORA Staff Grader interface.  You will be unable to submit grades until you activate the feature.',
    description: 'Demo mode message',
  },
});

export default StrictDict(messages);
