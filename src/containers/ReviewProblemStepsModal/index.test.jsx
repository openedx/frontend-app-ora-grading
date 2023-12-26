import { useSelector } from 'react-redux';
import { shallow } from 'enzyme';
import { keyStore } from 'utils';
import { MockUseState, formatMessage } from 'testUtils';
import { selectors, thunkActions } from 'data/redux';
import { RequestKeys } from 'data/constants/requests';

import * as hooks from './hooks';
import { ReviewProblemStepsModal } from '.';

const state = new MockUseState(hooks);

jest.useFakeTimers('modern');
jest.mock('data/redux', () => ({
  selectors: {
    grading: {
      hasGradingProgress: (args) => ({ hasGradingProgress: args }),
      selected: {
        response: (...args) => ({ selectedResponse: args }),
      },
    },
    requests: {
      isCompleted: (...args) => ({ isCompleted: args }),
      errorStatus: (...args) => ({ errorStatus: args }),
    },
    submissions: {
      allSubmissions: (...args) => ({ allSubmissions: args }),
    },
    problemSteps: {
      reviewModalOpen: (...args) => ({ reviewModalOpen: args }),
    },
  },
  actions: {
    app: {
      setShowReview: jest.fn(),
    },
    problemSteps: {
      setOpenReviewModal: jest.fn(),
    },
    grading: {
      setCriterionOption: jest.fn(),
    },
  },
  thunkActions: {
    app: {
      initialize: jest.fn(),
      cancelReview: jest.fn(),
    },
    grading: {
      cancelGrading: jest.fn(),
      setCriterionOption: jest.fn(),
    },
  },
}));

const requestKey = RequestKeys.fetchSubmission;
const hookKeys = keyStore(hooks);

const testState = { my: 'test-state' };
const intl = { formatMessage };
const dispatch = jest.fn();

jest.mock('./components/ReviewProblemStepsContent');
jest.mock('containers/DemoWarning');

describe('ReviewProblemStepsModal hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('state hooks', () => {
    state.testGetter(state.keys.showConfirmCloseReviewGrade);
  });
  describe('redux values', () => {
    const values = hooks.reduxValues();
    const reduxKeys = keyStore(values);
    const testSelector = (key, selector) => {
      expect(values[key]).toEqual(useSelector(selector));
    };
    const testRequestSelector = (key, selector) => {
      expect(values[key].useSelector(testState)).toEqual(
        selector(testState, { requestKey }),
      );
    };
    test('errorStatus loads the error status of the fetchSubmission request', () => {
      testRequestSelector(reduxKeys.errorStatus, selectors.requests.errorStatus);
    });
    test('hasGradingProgress loads grading.hasGradingProgress', () => {
      testSelector(reduxKeys.hasGradingProgress, selectors.grading.hasGradingProgress);
    });

    test('isLoaded loads if fetchSubmission is complete', () => {
      testRequestSelector(reduxKeys.isLoaded, selectors.requests.isCompleted);
    });
    test('isModalOpen loads problemSteps.setOpenReviewModal', () => {
      testSelector(reduxKeys.isModalOpen, selectors.problemSteps.reviewModalOpen);
    });
    test('hasGradingProgress loads grading.hasGradingProgress', () => {
      testSelector(reduxKeys.hasGradingProgress, selectors.grading.hasGradingProgress);
    });
  });
  describe('non-state hooks', () => {
    beforeEach(state.mock);
    afterEach(state.restore);
    const reduxValues = {
      errorStatus: null,
      hasGradingProgress: false,
      isLoaded: false,
      isModalOpen: false,
    };
    const mockRedux = (newVals) => {
      jest.spyOn(hooks, hookKeys.reduxValues).mockReturnValueOnce({
        ...reduxValues,
        ...newVals,
      });
    };
    const loadHook = (newVals) => {
      mockRedux(newVals);
      return hooks.rendererHooks({ dispatch, intl });
    };
    describe('rendererHooks - returned object:', () => {
      let hook;
      describe('onClose', () => {
        test('sets showConfirmCloseReviewGrade to true if hasGradingProgress', () => {
          hook = loadHook({ hasGradingProgress: true });
          hook.onClose();
          expect(state.setState.showConfirmCloseReviewGrade).toHaveBeenCalledWith(true);
        });
        test('cancels review if there is no grading progress', () => {
          hook = loadHook({});
          hook.onClose();
          expect(dispatch).toHaveBeenCalledWith(thunkActions.app.cancelReview());
        });
      });
      test('isLoading returns true iff is not loaded, or if there is an error status', () => {
        hook = loadHook({});
        expect(hook.isLoading).toEqual(true);
        hook = loadHook({ errorStatus: 'some-status' });
        expect(hook.isLoading).toEqual(false);
        hook = loadHook({ isLoaded: true });
        expect(hook.isLoading).toEqual(false);
      });
      test('isModalOpen is loaded from redux value, defaulted to false', () => {
        expect(loadHook({}).isModalOpen).toEqual(false);
        expect(loadHook({ isModalOpen: true }).isModalOpen).toEqual(true);
      });
      describe('closeConfirmModalProps', () => {
        test('loads isOpen from showConfirmCloseReviewGrade state', () => {
          expect(loadHook({}).closeConfirmModalProps.isOpen).toEqual(false);
          expect(state.stateVals.showConfirmCloseReviewGrade).toEqual(false);
          state.mockVal(state.keys.showConfirmCloseReviewGrade, true);
          expect(loadHook({}).closeConfirmModalProps.isOpen).toEqual(true);
        });
        test('onCancel - sets showConfirmCloseReviewGrade to false', () => {
          loadHook({}).closeConfirmModalProps.onCancel();
          expect(state.setState.showConfirmCloseReviewGrade).toHaveBeenCalledWith(false);
        });
        test('onConfirm - sets showConfirmCloseReviewGrade to false and cancels review', () => {
          loadHook({}).closeConfirmModalProps.onConfirm();
          expect(state.setState.showConfirmCloseReviewGrade).toHaveBeenCalledWith(false);
          expect(dispatch).toHaveBeenCalledWith(thunkActions.app.cancelReview());
        });
      });
    });
  });

  describe('<ReviewProblemStepsModal />', () => {
    const generateMockedValues = ({
      stateMock, submissionUUID, response, errorStatus, isModalOpen, isLoading,
    }) => ({
      state: stateMock,
      submissionUUID,
      response,
      errorStatus,
      submissions: {},
      currentSubmission: { submissionUUID, response },
      isLoading,
      isModalOpen,
    });

    const renderHooks = ({
      stateMock, submissionUUID, response, errorStatus, isModalOpen, isLoading,
    }) => {
      jest.spyOn(hooks, 'rendererHooks').mockReturnValue(
        generateMockedValues({
          stateMock,
          submissionUUID,
          response,
          errorStatus,
          isModalOpen,
          isLoading,
        }),
      );
    };

    const stateMock = {
      showConfirmCloseReviewGrade: jest.fn(),
    };

    const mockedSubmissionUUID = 'mockedUUID';
    const mockedResponse = [];
    const mockedErrorStatus = undefined;

    test('renders ReviewProblemStepsContent when isModalOpen is true and has submissionUUID', () => {
      renderHooks({
        submissionUUID: mockedSubmissionUUID,
        response: mockedResponse,
        errorStatus: mockedErrorStatus,
        submissions: { [mockedSubmissionUUID]: { score: null } },
        currentSubmission: { submissionUUID: mockedSubmissionUUID, response: mockedResponse },
        isModalOpen: true,
        stateMock,
      });

      const wrapper = shallow(
        <ReviewProblemStepsModal
          intl={intl}
        />,
      );

      expect(wrapper.find('[data-testid="review-step-problems-content"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="close-review-modal"]').exists()).toBe(true);
    });

    test('should not render ReviewProblemStepsContent when isModalOpen is false and has submissionUUID', () => {
      renderHooks({
        submissionUUID: mockedSubmissionUUID,
        response: mockedResponse,
        errorStatus: mockedErrorStatus,
        submissions: { [mockedSubmissionUUID]: { score: null } },
        currentSubmission: { submissionUUID: mockedSubmissionUUID, response: mockedResponse },
        isModalOpen: false,
        stateMock,
      });

      const wrapper = shallow(
        <ReviewProblemStepsModal
          intl={intl}
        />,
      );

      expect(wrapper.find('[data-testid="review-step-problems-content"]').exists()).toBe(false);
      expect(wrapper.find('[data-testid="close-review-modal"]').exists()).toBe(true);
    });

    test('should render LoadingMessage when isLoading is true', () => {
      renderHooks({
        submissionUUID: mockedSubmissionUUID,
        response: mockedResponse,
        errorStatus: mockedErrorStatus,
        submissions: { [mockedSubmissionUUID]: { score: null } },
        currentSubmission: { submissionUUID: mockedSubmissionUUID, response: mockedResponse },
        isModalOpen: false,
        stateMock,
        isLoading: true,
      });

      const wrapper = shallow(
        <ReviewProblemStepsModal
          intl={intl}
        />,
      );

      expect(wrapper.find('[data-testid="loading-message"]').exists()).toBe(true);
    });

    test('should not render LoadingMessage when isLoading is false', () => {
      renderHooks({
        submissionUUID: mockedSubmissionUUID,
        response: mockedResponse,
        errorStatus: mockedErrorStatus,
        submissions: { [mockedSubmissionUUID]: { score: null } },
        currentSubmission: { submissionUUID: mockedSubmissionUUID, response: mockedResponse },
        isModalOpen: false,
        stateMock,
        isLoading: false,
      });

      const wrapper = shallow(
        <ReviewProblemStepsModal
          intl={intl}
        />,
      );

      expect(wrapper.find('[data-testid="loading-message"]').exists()).toBe(false);
    });
  });
});
