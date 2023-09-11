import { useDispatch, useSelector } from 'react-redux';

import { keyStore } from 'utils';
import { formatMessage } from 'testUtils';
import { actions, selectors, thunkActions } from 'data/redux';
import { RequestKeys, ErrorStatuses } from 'data/constants/requests';
import messages from './messages';
import * as hooks from './hooks';

jest.mock('data/redux', () => ({
  selectors: {
    requests: {
      errorStatus: (...args) => ({ errorStatus: args }),
    },
  },
  actions: {
    requests: {
      clearRequest: (args) => ({ clearRequest: args }),
    },
  },
  thunkActions: {
    grading: {
      submitGrade: jest.fn((args) => ({ submitGrade: args })),
    },
  },
}));

const hookKeys = keyStore(hooks);
const dispatch = useDispatch();
const intl = { formatMessage };
const testState = { my: 'test-state' };
const requestKey = RequestKeys.submitGrade;
let errorStatus;
let hook;

describe('Review Modal Submit Error hooks', () => {
  beforeEach(jest.clearAllMocks);
  describe('badRequestError', () => {
    beforeEach(() => { hook = hooks.badRequestError({ dispatch }); });
    it('returns messages from gradeNotSubmitted error messages', () => {
      expect(hook.headingMessage).toEqual(messages.gradeNotSubmittedHeading);
      expect(hook.contentMessage).toEqual(messages.gradeNotSubmittedContent);
    });
    test('onClick, dispatches thunkAction to submit grade', () => {
      hook.confirm.onClick();
      expect(dispatch).toHaveBeenCalledWith(thunkActions.grading.submitGrade());
    });
    it('provides a confirm resubmitGrade message', () => {
      expect(hook.confirm.message).toEqual(messages.resubmitGrade);
    });
  });
  describe('conflictError', () => {
    beforeEach(() => { hook = hooks.conflictError({ dispatch }); });
    it('returns messages from errorSubmittingGrade error messages', () => {
      expect(hook.headingMessage).toEqual(messages.errorSubmittingGradeHeading);
      expect(hook.contentMessage).toEqual(messages.errorSubmittingGradeContent);
    });
    it('does not provide an onClick event', () => {
      expect(hook.onClick).toEqual(undefined);
    });
  });
  test('defaultError returns badRequestError', () => {
    expect(hooks.defaultError).toEqual(hooks.badRequestError);
  });
  describe('errorProps', () => {
    const mockedError = (args) => ({ mockedError: args });
    const mockError = (hookKey) => {
      jest.spyOn(hooks, hookKey).mockImplementationOnce(mockedError);
    };
    test('on bad request, returns badRequestError', () => {
      mockError(hookKeys.badRequestError);
      expect(
        hooks.errorProps({ dispatch, errorStatus: ErrorStatuses.badRequest }),
      ).toEqual(mockedError({ dispatch }));
    });
    test('on conflict, returns conflictError', () => {
      mockError(hookKeys.conflictError);
      expect(
        hooks.errorProps({ dispatch, errorStatus: ErrorStatuses.conflict }),
      ).toEqual(mockedError({ dispatch }));
    });
    test('on unhandled error type, returns defaultError', () => {
      mockError(hookKeys.defaultError);
      expect(
        hooks.errorProps({ dispatch, errorStatus: 'fake-status' }),
      ).toEqual(mockedError({ dispatch }));
    });
  });
  describe('errorStatusSelector', () => {
    it('returns the errorStatus of the submitGrade request', () => {
      expect(hooks.errorStatusSelector(testState)).toEqual(
        selectors.requests.errorStatus(testState, { requestKey }),
      );
    });
  });
  describe('rendererHooks', () => {
    it('calls useSelector once on errorStatusSelector', () => {
      hooks.rendererHooks({ dispatch, intl });
      expect(useSelector.mock.calls).toEqual([[hooks.errorStatusSelector]]);
    });
    it('returns only a false show value if errorStatus is empty', () => {
      useSelector.mockReturnValueOnce(false);
      expect(hooks.rendererHooks({ dispatch, intl })).toEqual({ show: false });
    });
    describe('with valid error status', () => {
      errorStatus = 'test-status';
      const mockErrorProps = (args) => ({
        confirm: { confirm: args },
        headingMessage: { headingMessage: args },
        contentMessage: { contentMessage: args },
      });
      const mockProps = mockErrorProps({ dispatch, errorStatus });
      beforeEach(() => {
        useSelector.mockReturnValueOnce(errorStatus);
        jest.spyOn(hooks, hookKeys.errorProps).mockImplementationOnce(mockErrorProps);
        hook = hooks.rendererHooks({ dispatch, intl });
      });
      describe('reviewActions', () => {
        describe('cancel', () => {
          test('onClick, dispatches action to clear submit grade action', () => {
            hook.reviewActions.cancel.onClick();
            expect(dispatch).toHaveBeenCalledWith(actions.requests.clearRequest({ requestKey }));
          });
          test('provides dismiss message', () => {
            expect(hook.reviewActions.cancel.message).toEqual(messages.dismiss);
          });
        });
        test('confirm forwards confirm action from errorProps', () => {
          expect(hook.reviewActions.confirm).toEqual(mockProps.confirm);
        });
      });
      test('loads headingMessage from errorProps', () => {
        expect(hook.headingMessage).toEqual(mockProps.headingMessage);
      });
      test('formats contentMessage from errorProps', () => {
        expect(hook.content).toEqual(formatMessage(mockProps.contentMessage));
      });
    });
  });
});
