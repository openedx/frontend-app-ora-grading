import { StrictDict } from 'utils';
import { ErrorStatuses, RequestKeys } from 'data/constants/requests';
import { gradeStatuses, lockStatuses } from 'data/services/lms/constants';
import { actions } from 'data/redux';

export const errorData = (status, data = '') => ({
  response: {
    status,
    data,
  },
});

export const networkErrorData = errorData(ErrorStatuses.badRequest);

const gradeData = {
  overallFeedback: 'was okay',
  criteria: [{ feedback: 'did alright', name: 'firstCriterion', selectedOption: 'good' }],
};

export const genTestUtils = ({ dispatch }) => {
  const mockStart = (requestKey) => () => {
    dispatch(actions.requests.startRequest(requestKey));
  };

  const mockError = (requestKey, status, data) => () => {
    dispatch(actions.requests.failRequest({
      requestKey,
      error: errorData(status, data),
    }));
  };

  const mockNetworkError = (requestKey) => (
    mockError(requestKey, ErrorStatuses.badRequest)
  );

  return {
    init: StrictDict({
      start: mockStart(RequestKeys.initialize),
      networkError: mockNetworkError(RequestKeys.initialize),
    }),
    fetch: StrictDict({
      start: mockStart(RequestKeys.fetchSubmission),
      mockError: mockError(RequestKeys.fetchSubmission, ErrorStatuses.badRequest),
    }),
    submitGrade: StrictDict({
      start: mockStart(RequestKeys.submitGrade),
      success: () => {
        dispatch(actions.requests.completeRequest({
          requestKey: RequestKeys.submitGrade,
          response: {
            gradeStatus: gradeStatuses.graded,
            lockStatus: lockStatuses.unlocked,
            gradeData,
          },
        }));
      },
      networkError: mockError(RequestKeys.submitGrade, ErrorStatuses.badRequest),
      rejectedError: mockError(
        RequestKeys.submitGrade,
        ErrorStatuses.conflict,
        {
          submissionStatus: {
            gradeStatus: gradeStatuses.ungraded,
            lockStatus: lockStatuses.locked,
            gradeData,
          },
        },
      ),
    }),
    setLock: StrictDict({
      start: mockStart(RequestKeys.setLock),
      success: () => {
        dispatch(actions.requests.completeRequest({
          requestKey: RequestKeys.setLock,
          response: {
            lockStatus: lockStatuses.inProgress,
          },
        }));
      },
      badRequestError: mockError(RequestKeys.setLock, ErrorStatuses.badRequest),
      contestedLockError: mockError(RequestKeys.setLock, ErrorStatuses.forbidden, {
        lockStatus: lockStatuses.locked,
      }),
    }),
  };
};

export default genTestUtils;
