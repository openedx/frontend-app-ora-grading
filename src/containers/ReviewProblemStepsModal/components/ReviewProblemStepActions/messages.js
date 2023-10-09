import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  pointsDisplay: {
    id: 'ora-grading.ReviewActions.pointsDisplay',
    defaultMessage: 'Score: {pointsEarned}/{pointsPossible}',
    description: 'Review pane action bar score display',
  },
  hideRubric: {
    id: 'ora-grading.ReviewActions.hideRubric',
    defaultMessage: 'Hide Rubric',
    description: 'Review pane action bar Hide Rubric button text',
  },
  showRubric: {
    id: 'ora-grading.ReviewActions.showRubric',
    defaultMessage: 'Show Rubric',
    description: 'Review pane action bar Show Rubric button text',
  },
});

export default messages;
