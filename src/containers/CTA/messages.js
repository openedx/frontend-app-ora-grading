/* eslint-disable quotes */
import { defineMessages } from '@edx/frontend-platform/i18n';
import { StrictDict } from 'utils';

const messages = defineMessages({
  ctaFeedbackMessage: {
    id: 'ora-grading.CTA.feedbackMessage',
    defaultMessage: 'Thanks for using the new ORA staff grading experience. We\'d love to hear your feedback',
    description: 'Thank user for using ora and ask for feed back',
  },
  ctaLinkMessage: {
    id: 'ora-grading.CTA.linkMessage',
    defaultMessage: 'here',
    description: 'placeholder for the feedback anchor link',
  },
});

export default StrictDict(messages);
