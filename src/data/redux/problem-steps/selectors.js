import { StrictDict } from 'utils';

export const simpleSelectors = {
  reviewModalOpen: state => state.problemSteps.reviewModalOpen,
};

export default StrictDict({
  ...simpleSelectors,
});
