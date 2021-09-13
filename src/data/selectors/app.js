import { StrictDict } from 'utils';

export const simpleSelectors = {
  showReview: state => state.app.showReview,
  grading: state => state.app.grading,
  oraName: state => state.app.oraMetadata.name,
  oraPrompt: state => state.app.oraMetadata.prompt,
};

export default StrictDict({
  ...simpleSelectors,
});
