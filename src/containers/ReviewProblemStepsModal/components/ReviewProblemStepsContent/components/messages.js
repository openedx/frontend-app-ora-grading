import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  overrideConfirmTitle: {
    id: 'ora-grading.ReviewActions.overrideConfirmTitle',
    defaultMessage: 'Are you sure you want to override this grade?',
    description: 'ORA Grading override confirm modal title',
  },
  overrideConfirmWarning: {
    id: 'ora-grading.ReviewActions.overrideConfirmWarning',
    defaultMessage: 'This cannot be undone.  The learner may have already received their grade.',
    description: 'ORA Grading override confirm modal warning/content text',
  },
  overrideConfirmContinue: {
    id: 'ora-grading.ReviewActions.overrideConfirmContinue',
    defaultMessage: 'Continue grade override',
    description: 'ORA Grading override confirm modal confirm button',
  },
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
  confirmStopOverrideTitle: {
    id: 'ora-grading.ReviewActions.StopGradingConfirmModal.override.title',
    defaultMessage: 'Are you sure you want to stop grade override?',
    description: 'ORA stop overriding grade confirm modal title',
  },
  confirmStopGradingTitle: {
    id: 'ora-grading.ReviewActions.StopGradingConfirmModal.title',
    defaultMessage: 'Are you sure you want to stop grading this response?',
    description: 'ORA stop grading confirm modal title',
  },
  confirmStopWarning: {
    id: 'ora-grading.ReviewActions.StopGradingConfirmModal.warning',
    defaultMessage: 'Your progress will be lost.',
    description: 'ORA stop grading confirm modal warning/content text',
  },
  confirmStopOverrideAction: {
    id: 'ora-grading.ReviewActions.StopGradingConfirmModal.override.confirmText',
    defaultMessage: 'Stop grade override',
    description: 'ORA stop overriding grade confirm modal confirm text',
  },
  confirmStopGradingAction: {
    id: 'ora-grading.ReviewActions.StopGradingConfirmModal.confirmText',
    defaultMessage: 'Cancel grading',
    description: 'ORA stop grading confirm modal confirm text',
  },
  goBack: {
    id: 'ora-grading.ReviewActions.goBack',
    defaultMessage: 'Go back',
    description: 'Confirm modal cancel button text',
  },
  loadPrevious: {
    id: 'ora-grading.ReviewActions.loadPrevious',
    defaultMessage: 'Load previous submission',
    description: 'Alt text for submission navigation (to previous submission) button',
  },
  loadNext: {
    id: 'ora-grading.ReviewActions.loadNext',
    defaultMessage: 'Load next submission',
    description: 'Alt text for submission navigation (to next submission) button',
  },
  navigationLabel: {
    id: 'ora-grading.ReviewActions.navigationLabel',
    defaultMessage: '{current} of {total}',
    description: 'Submission navigation location label',
  },
});

export default messages;
