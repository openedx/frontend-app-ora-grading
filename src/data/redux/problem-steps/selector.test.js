import { simpleSelectors } from './selectors';

describe('simpleSelectors', () => {
  it('should select reviewModalOpen from the state', () => {
    const initialState = {
      problemSteps: {
        reviewModalOpen: true,
      },
    };

    const store = {
      getState: () => initialState,
    };

    const selectedReviewModalOpen = simpleSelectors.reviewModalOpen(store.getState());
    expect(selectedReviewModalOpen).toEqual(true);
  });
});
