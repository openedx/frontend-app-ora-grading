import { useSelector } from 'react-redux';

import { keyStore } from 'utils';
import { MockUseState, formatMessage } from 'testUtils';
import { selectors, thunkActions } from 'data/redux';
import { RequestKeys } from 'data/constants/requests';
import messages from './messages';

import * as hooks from './hooks';

const state = new MockUseState(hooks);

jest.useFakeTimers('modern');
jest.mock('data/redux', () => ({
  selectors: {
    app: {
      isEnabled: (args) => ({ isEnabled: args }),
      ora: { name: (...args) => ({ oraName: args }) },
      showReview: (...args) => ({ showReview: args }),
    },
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
  },
  actions: {
    app: {
      setShowReview: jest.fn(),
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
describe('ReviewModal hooks', () => {
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
    test('isEnabled loads app.isEnabled', () => {
      testSelector(reduxKeys.isEnabled, selectors.app.isEnabled);
    });
    test('isLoaded loads if fetchSubmission is complete', () => {
      testRequestSelector(reduxKeys.isLoaded, selectors.requests.isCompleted);
    });
    test('isOpen loads app.showReview', () => {
      testSelector(reduxKeys.isOpen, selectors.app.showReview);
    });
    test('oraName loads app.ora.name', () => {
      testSelector(reduxKeys.oraName, selectors.app.ora.name);
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
      isEnabled: false,
      isLoaded: false,
      isOpen: false,
      oraName: 'ora-NAAAAMME',
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
      test('title is ora name, with appended demo title message if isEnabled', () => {
        hook = loadHook({});
        expect(hook.title).toEqual(reduxValues.oraName);
        hook = loadHook({ isEnabled: true });
        expect(hook.title).toEqual(
          [reduxValues.oraName, formatMessage(messages.demoTitleMessage)].join(' - '),
        );
      });
      test('isOpen is loaded from redux value, defaulted to false', () => {
        expect(loadHook({}).isOpen).toEqual(false);
        expect(loadHook({ isOpen: true }).isOpen).toEqual(true);
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
