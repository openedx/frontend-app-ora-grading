import { useSelector } from 'react-redux';

import { keyStore } from 'utils';
import { MockUseState, formatMessage } from 'testUtils';
import { selectors, thunkActions } from 'data/redux';
import { RequestKeys } from 'data/constants/requests';

import * as hooks from './hooks';

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
  },
  thunkActions: {
    app: {
      initialize: jest.fn(),
      cancelReview: jest.fn(),
    },
    grading: {
      cancelGrading: jest.fn(),
    },
  },
}));

const requestKey = RequestKeys.fetchSubmission;
const hookKeys = keyStore(hooks);

const testState = { my: 'test-state' };
const intl = { formatMessage };
const dispatch = jest.fn();
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
        it('sets showConfirmCloseReviewGrade to true if hasGradingProgress', () => {
          hook = loadHook({ hasGradingProgress: true });
          hook.onClose();
          expect(state.setState.showConfirmCloseReviewGrade).toHaveBeenCalledWith(true);
        });
        it('cancels review if there is no grading progress', () => {
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
});
