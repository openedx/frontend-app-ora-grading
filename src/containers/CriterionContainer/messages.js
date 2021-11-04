import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  addComments: {
    id: 'ora-grading.CriterionFeedback.addCommentsLabel',
    defaultMessage: 'Add comments',
    description: 'label for editable feedback field',
  },
  comments: {
    id: 'ora-grading.CriterionFeedback.commentsLabel',
    defaultMessage: 'Comments',
    description: 'label for read-only feedback field',
  },
  optionPoints: {
    id: 'ora-grading.RadioCriterion.optionPoints',
    defaultMessage: '{points} points',
    description: 'criterion option point value display',
  },
});

export default messages;
