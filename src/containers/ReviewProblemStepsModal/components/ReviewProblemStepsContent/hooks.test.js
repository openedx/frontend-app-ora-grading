import { renderHook, act } from '@testing-library/react-hooks';
import api from 'data/services/lms/api';
import { useFeedbackList } from './hooks';

jest.mock('data/services/lms/api', () => ({
  getFeedbackList: jest.fn(),
}));

describe('ReviewProblemStepsContent hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('useFeedbackList', () => {
    const mockAssessments = [
      {
        idAssessment: 1,
        assesmentDate: '2024-01-01',
        scorerEmail: 'email@example.com',
        scorerName: 'John Doe',
        scorerUsername: 'johndoe123',
        feedback: 'Great work!',
        problemStep: 'Step 1',
        assesmentScores: [
          {
            criterionName: 'Criterion 1',
            scoreEarned: 8,
            scoreType: 'Good',
          },
        ],
      },
    ];

    const expectedFormattedAssessments = [
      {
        idAssessment: 1,
        reviewerName: 'John Doe',
        userName: 'johndoe123',
        email: 'email@example.com',
        assessmentDate: '2024-01-01',
        assessmentScores: [
          {
            id: expect.any(String),
            type: 'Criterion 1',
            quality: 'Good',
            rate: 8,
          },
        ],
        feedback: 'Great work!',
        problemStep: 'Step 1',
      },
    ];

    test('initial state', () => {
      const { result } = renderHook(() => useFeedbackList('some-uuid'));

      expect(result.current.isLoadingFeedbackList).toBe(false);
      expect(result.current.feedbackList).toEqual([]);
      expect(result.current.feedbackListError).toBeNull();
      expect(result.current.feedbackListType).toBe('received');
    });

    test('should change feedbackListType', async () => {
      const mockResponse = { assessments: mockAssessments };
      api.getFeedbackList.mockResolvedValue(mockResponse);

      const { result, waitForNextUpdate } = renderHook(() => useFeedbackList('some-uuid'));

      act(() => result.current.setFeedbackListType('given'));

      await act(async () => {
        result.current.getFeedbackListApi();
        await waitForNextUpdate();
      });

      expect(api.getFeedbackList).toHaveBeenCalledWith('some-uuid', 'given');
      expect(result.current.isLoadingFeedbackList).toBe(false);
      expect(result.current.feedbackList).toEqual(expectedFormattedAssessments);
      expect(result.current.feedbackListError).toBeNull();
    });

    test('successful API call', async () => {
      const mockResponse = { assessments: mockAssessments };
      api.getFeedbackList.mockResolvedValue(mockResponse);

      const { result, waitForNextUpdate } = renderHook(() => useFeedbackList('some-uuid'));

      act(() => {
        result.current.getFeedbackListApi();
      });

      expect(api.getFeedbackList).toHaveBeenCalledWith('some-uuid', 'received');
      expect(result.current.isLoadingFeedbackList).toBe(true);
      expect(result.current.feedbackList).toEqual([]);
      expect(result.current.feedbackListError).toBeNull();

      await act(async () => {
        result.current.getFeedbackListApi();
        await waitForNextUpdate();
      });

      expect(api.getFeedbackList).toHaveBeenCalledWith('some-uuid', 'received');
      expect(result.current.isLoadingFeedbackList).toBe(false);
      expect(result.current.feedbackList).toEqual(expectedFormattedAssessments);
      expect(result.current.feedbackListError).toBeNull();
    });

    test('fail API call', async () => {
      const mockError = new Error('Error fetching data');
      api.getFeedbackList.mockRejectedValue(mockError);

      const { result, waitForNextUpdate } = renderHook(() => useFeedbackList('some-uuid'));

      act(() => {
        result.current.getFeedbackListApi();
      });

      expect(api.getFeedbackList).toHaveBeenCalledWith('some-uuid', 'received');
      expect(result.current.isLoadingFeedbackList).toBe(true);
      expect(result.current.feedbackListError).toBeNull();

      await act(async () => {
        result.current.getFeedbackListApi();
        await waitForNextUpdate();
      });

      expect(api.getFeedbackList).toHaveBeenCalledWith('some-uuid', 'received');
      expect(result.current.isLoadingFeedbackList).toBe(false);
      expect(result.current.feedbackListError).toBe('Error fetching data');
    });

    test('does not make API call if submissionUUID is null', async () => {
      const { result, waitFor } = renderHook(() => useFeedbackList(null));

      act(() => {
        result.current.getFeedbackListApi();
      });

      await waitFor(() => {
        expect(result.current.isLoadingFeedbackList).toBe(false);
      }, { timeout: 500 });

      expect(api.getFeedbackList).not.toHaveBeenCalled();
      expect(result.current.feedbackList).toEqual([]);
      expect(result.current.feedbackListError).toBeNull();
    });
  });
});
