import { useFeedbackList } from './hooks'; // Import your hook

jest.mock('./hooks');

describe('useFeedbackList hook', () => {
  it('Should returns correctly data', async () => {
    const hookMock = {
      isLoadingFeedbackList: true,
      feedbackList: [],
      feedbackListError: null,
      feedbackListType: 'received',
      setFeedbackListType: jest.fn(),
    };
    useFeedbackList.mockReturnValue(hookMock);
    const hookReturn = useFeedbackList('sampleUUID');
    expect(hookMock).toBe(hookReturn);
  });

  it('Should call setFeedbackListType correctly', async () => {
    const hookMock = {
      isLoadingFeedbackList: true,
      feedbackList: [],
      feedbackListError: null,
      feedbackListType: 'received',
      setFeedbackListType: jest.fn(),
    };

    useFeedbackList.mockReturnValue(hookMock);
    const hookReturn = useFeedbackList('sampleUUID');
    hookReturn.setFeedbackListType();
    expect(hookMock).toBe(hookReturn);
    expect(hookMock.setFeedbackListType).toBeCalled();
  });
});
