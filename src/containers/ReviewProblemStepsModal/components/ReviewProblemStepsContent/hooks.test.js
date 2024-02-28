import { renderHook, act } from '@testing-library/react-hooks';
import api from 'data/services/lms/api';
import { useFeedbackList } from './hooks';

jest.mock('data/services/lms/api', () => ({
  getFeedbackFromList: jest.fn(),
  getFeedbackToList: jest.fn(),
}));

describe('ReviewProblemStepsContent hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('useFeedbackList', () => {
    const mockAssessments = [
      {
        assessmentId: 1,
        assessmentDate: '2024-01-01',
        scorerEmail: 'email@example.com',
        scorerName: 'John Doe',
        scorerUsername: 'johndoe123',
        feedback: 'Great work!',
        problemStep: 'Step 1',
        assessmentScores: [
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
        assessmentId: 1,
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
      api.getFeedbackFromList.mockResolvedValue(mockResponse);

      const { result, waitForNextUpdate } = renderHook(() => useFeedbackList('some-uuid'));

      act(() => result.current.setFeedbackListType('received'));

      await act(async () => {
        result.current.getFeedbackListApi();
        await waitForNextUpdate();
      });

      expect(api.getFeedbackFromList).toHaveBeenCalledWith('some-uuid');
      expect(result.current.isLoadingFeedbackList).toBe(false);
      expect(result.current.feedbackList).toEqual(expectedFormattedAssessments);
      expect(result.current.feedbackListError).toBeNull();
    });

    test('successful API call getFeedbackFromList', async () => {
      const mockResponse = { assessments: mockAssessments };
      api.getFeedbackFromList.mockResolvedValue(mockResponse);

      const { result, waitForNextUpdate } = renderHook(() => useFeedbackList('some-uuid'));

      act(() => {
        result.current.getFeedbackListApi();
      });

      expect(api.getFeedbackFromList).toHaveBeenCalledWith('some-uuid');
      expect(result.current.isLoadingFeedbackList).toBe(true);
      expect(result.current.feedbackList).toEqual([]);
      expect(result.current.feedbackListError).toBeNull();

      await act(async () => {
        result.current.getFeedbackListApi();
        await waitForNextUpdate();
      });

      expect(api.getFeedbackFromList).toHaveBeenCalledWith('some-uuid');
      expect(result.current.isLoadingFeedbackList).toBe(false);
      expect(result.current.feedbackList).toEqual(expectedFormattedAssessments);
      expect(result.current.feedbackListError).toBeNull();
    });

    test('successful API call getFeedbackToList', async () => {
      const mockResponse = { assessments: mockAssessments };
      api.getFeedbackToList.mockResolvedValue(mockResponse);

      const { result, waitForNextUpdate } = renderHook(() => useFeedbackList('some-uuid'));

      act(() => {
        result.current.getFeedbackListApi();
      });

      expect(api.getFeedbackToList).toHaveBeenCalledWith('some-uuid');
      expect(result.current.isLoadingFeedbackList).toBe(true);
      expect(result.current.feedbackList).toEqual([]);
      expect(result.current.feedbackListError).toBeNull();

      await act(async () => {
        result.current.getFeedbackListApi();
        await waitForNextUpdate();
      });

      expect(api.getFeedbackToList).toHaveBeenCalledWith('some-uuid');
      expect(result.current.isLoadingFeedbackList).toBe(false);
      expect(result.current.feedbackList).toEqual(expectedFormattedAssessments);
      expect(result.current.feedbackListError).toBeNull();
    });

    test('fail API call getFeedbackFromList', async () => {
      const mockError = new Error('Error fetching data');
      api.getFeedbackFromList.mockRejectedValue(mockError);

      const { result, waitForNextUpdate } = renderHook(() => useFeedbackList('some-uuid'));

      act(() => {
        result.current.getFeedbackListApi();
      });

      expect(api.getFeedbackFromList).toHaveBeenCalledWith('some-uuid');
      expect(result.current.isLoadingFeedbackList).toBe(true);
      expect(result.current.feedbackListError).toBeNull();

      await act(async () => {
        result.current.getFeedbackListApi();
        await waitForNextUpdate();
      });

      expect(api.getFeedbackFromList).toHaveBeenCalledWith('some-uuid');
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

      expect(api.getFeedbackFromList).not.toHaveBeenCalled();
      expect(api.getFeedbackToList).not.toHaveBeenCalled();
      expect(result.current.feedbackList).toEqual([]);
      expect(result.current.feedbackListError).toBeNull();
    });
  });
});
