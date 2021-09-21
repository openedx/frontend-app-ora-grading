import { StrictDict } from 'utils';

export const simpleSelectors = {
  showReview: state => state.app.showReview,
  showRubric: state => state.app.showRubric,
  grading: state => state.app.grading,
  courseMetadata: state => state.app.courseMetadata,
  oraName: state => state.app.oraMetadata.name,
  oraPrompt: state => state.app.oraMetadata.prompt,
  oraTypes: state => state.app.oraMetadata.type,
};

export default StrictDict({
  ...simpleSelectors,
});
