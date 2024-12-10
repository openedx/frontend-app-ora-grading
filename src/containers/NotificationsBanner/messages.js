/* eslint-disable quotes */
import { defineMessages } from '@edx/frontend-platform/i18n';
import { StrictDict } from 'utils';

const messages = defineMessages({
  infoMessage: {
    id: 'ora-grading.NotificationsBanner.Message',
    defaultMessage: 'You can now enable notifications for ORA assignments that require staff grading, from the ',
    description: 'user info message that user can enable notifications for ORA assignments',
  },
  notificationsBannerPreferencesCenterMessage: {
    id: 'ora-grading.NotificationsBanner.linkMessage',
    defaultMessage: 'preferences center.',
    description: 'placeholder for the preferences center link',
  },
});

export default StrictDict(messages);
