import { createSelector } from 'reselect';

import { feedbackRequirement } from 'data/services/lms/constants';

import { StrictDict } from 'utils';

export const simpleSelectors = {
  showReview: state => state.app.showReview,
  showRubric: state => state.app.showRubric,
  grading: state => state.app.grading,
  courseMetadata: state => state.app.courseMetadata,
  courseId: state => state.app.courseMetadata.courseId,
  oraName: state => state.app.oraMetadata.name,
  oraPrompt: state => state.app.oraMetadata.prompt,
  oraTypes: state => state.app.oraMetadata.type,
  rubricConfig: state => state.app.oraMetadata.rubricConfig,
};

const shouldIncludeFeedback = (feedback) => ([
  feedbackRequirement.required,
  feedbackRequirement.optional,
]).includes(feedback);

export const emptyGrade = (state) => {
  const { rubricConfig } = state.app.oraMetadata;
  console.log({ rubricConfig });
  if (rubricConfig === undefined) {
    return null;
  }
  const gradeData = {};
  if (shouldIncludeFeedback(rubricConfig.feedback)) {
    gradeData.overallFeedback = '';
  }
  gradeData.criteria = rubricConfig.criteria.map(criterion => {
    const entry = {
      orderNum: criterion.orderNum,
      name: criterion.name,
      selectedOption: null,
    };
    if (shouldIncludeFeedback(criterion.feedback)) {
      entry.feedback = '';
    }
    return entry;
  });
  return gradeData;
};

export default StrictDict({
  ...simpleSelectors,
  emptyGrade,
});
