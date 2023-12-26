import { actions, reducer, initialState } from './reducer';

describe('problemSteps reducer', () => {
  it('should return the initial state', () => {
    const state = reducer(undefined, {});
    expect(state).toEqual(initialState);
  });

  it('should handle setOpenReviewModal correctly', () => {
    const newState = reducer(initialState, actions.setOpenReviewModal(true));

    expect(newState.reviewModalOpen).toEqual(true);
    expect(newState.someOtherProperty).toEqual(initialState.someOtherProperty);
  });

  it('should handle setOpenReviewModal with false correctly', () => {
    const stateWithOpenModal = { ...initialState, reviewModalOpen: true };
    const newState = reducer(stateWithOpenModal, actions.setOpenReviewModal(false));

    // Check if reviewModalOpen is set to false
    expect(newState.reviewModalOpen).toEqual(false);
    expect(newState.someOtherProperty).toEqual(stateWithOpenModal.someOtherProperty);
  });

  it('should handle setSelectedSubmissionId correctly', () => {
    const newSubmissionId = 'newSubmissionId';

    const newState = reducer(initialState, actions.setSelectedSubmissionId(newSubmissionId));

    expect(newState.selectedSubmissionId).toEqual(newSubmissionId);
    expect(newState.reviewModalOpen).toEqual(initialState.reviewModalOpen);
  });
});
