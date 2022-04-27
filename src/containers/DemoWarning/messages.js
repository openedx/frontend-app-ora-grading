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
    defaultMessage: 'You are demoing the new ORA staff grading experience. You will be unable to submit grades until you activate the feature. This will become the default grading experience on May 9th (05/09/2022). To opt-in early, or opt-out, please contact Partner Support.',
    description: 'Demo mode message',
  },
});

export default StrictDict(messages);
