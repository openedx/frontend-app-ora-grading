import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  startGrading: {
    id: 'ora-grading.ReviewActions.StartGradingButton.startGrading',
    defaultMessage: 'Start grading',
    description: 'Review pane button text to start grading',
  },
  overrideGrade: {
    id: 'ora-grading.ReviewActions.StartGradingButton.overrideGrade',
    defaultMessage: 'Override grade',
    description: 'Review pane button text to start grading an already graded submission',
  },
  stopGrading: {
    id: 'ora-grading.ReviewActions.StartGradingButton.stopGrading',
    defaultMessage: 'Stop grading this response',
    description: 'Review pane button text to stop grading',
  },
});

export default messages;
