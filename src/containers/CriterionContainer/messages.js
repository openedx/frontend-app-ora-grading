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
  optional: {
    id: 'ora-grading.CriterionFeedback.optional',
    defaultMessage: '(Optional)',
    description: 'additional label for optional feedback field',
  },
  optionPoints: {
    id: 'ora-grading.RadioCriterion.optionPoints',
    defaultMessage: '{points} points',
    description: 'criterion option point value display',
  },
  rubricSelectedError: {
    id: 'ora-grading.RadioCriterion.rubricSelectedError',
    defaultMessage: 'Rubric selection is required',
    description: 'Error message when rubric radio did not get selected',
  },
  criterionFeedbackError: {
    id: 'ora-grading.CriterionFeedback.criterionFeedbackError',
    defaultMessage: 'The feedback is required',
    description: 'Error message when feedback is required',
  },
});

export default messages;
