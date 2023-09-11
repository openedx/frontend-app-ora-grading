import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  gradeSubmitted: {
    id: 'ora-grading.Rubric.gradeSubmitted',
    defaultMessage: 'Grade Submitted',
    description: 'Submit Grade button text after successful submission',
  },
  rubric: {
    id: 'ora-grading.Rubric.rubric',
    defaultMessage: 'Rubric',
    description: 'Rubric interface label',
  },
  submitGrade: {
    id: 'ora-grading.Rubric.submitGrade',
    defaultMessage: 'Submit grade',
    description: 'Submit Grade button text',
  },
  submittingGrade: {
    id: 'ora-grading.Rubric.submittingGrade',
    defaultMessage: 'Submitting grade',
    description: 'Submit Grade button text while submitting',
  },
  overallComments: {
    id: 'ora-grading.Rubric.overallComments',
    defaultMessage: 'Overall comments',
    description: 'Rubric overall comments label',
  },
  addComments: {
    id: 'ora-grading.Rubric.addComments',
    defaultMessage: 'Add comments (Optional)',
    description: 'Rubric comments input label',
  },
  comments: {
    id: 'ora-grading.Rubric.comments',
    defaultMessage: 'Comments (Optional)',
    description: 'Rubric comments display label',
  },
  overallFeedbackError: {
    id: 'ora-grading.RubricFeedback.error',
    defaultMessage: 'The overall feedback is required',
    description: 'Error message when feedback input is required',
  },
});

export default messages;
