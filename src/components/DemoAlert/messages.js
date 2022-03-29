import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  warningMessage: {
    id: 'ora-grading.demoAlert.warningMessage',
    defaultMessage: 'Grade submission is disabled in the Demo mode of the new ORA Staff Grader.',
    description: 'Submit Grade button text after successful submission',
  },
  confirm: {
    id: 'ora-grading.demoAlert.confirm',
    defaultMessage: 'Confirm',
    description: 'Confirm button text',
  },
  title: {
    id: 'ora-grading.demoAlert.title',
    defaultMessage: 'Demo submit prevented',
    description: 'Title of alert modal after submit was prevented because in demo mode',
  },
});

export default messages;
