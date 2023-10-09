import { useSelector } from 'react-redux';

import { formatMessage, MockUseState } from 'testUtils';
import { RequestKeys } from 'data/constants/requests';
import { gradingStatuses } from 'data/services/lms/constants';
import { selectors, thunkActions } from 'data/redux';
import { keyStore } from 'utils';
import * as hooks from './hooks';

jest.mock('react-redux', () => ({
  useSelector: args => ({ useSelector: args }),
}));

jest.mock('data/redux', () => ({
  selectors: {
    grading: {
      selected: {
        gradeStatus: jest.fn((...args) => ({ gradeStatus: args })),
        gradingStatus: jest.fn((...args) => ({ gradingStatus: args })),
      },
    },
    requests: {
      isPending: jest.fn((...args) => ({ isPending: args })),
    },
  },
  thunkActions: {
    grading: {
      startGrading: jest.fn((...args) => ({ startGrading: args })),
      cancelGrading: jest.fn((...args) => ({ cancelGrading: args })),
    },
  },
}));

const state = new MockUseState(hooks);
const hookKeys = keyStore(hooks);

let hook;
const testValue = 'my-test-value';

const dispatch = jest.fn();
const intl = { formatMessage };
describe('Start Grading Button hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('state hooks', () => {
    state.testGetter(state.keys.showConfirmStopGrading);
    state.testGetter(state.keys.showConfirmOverrideGrade);
  });
  describe('redux values', () => {
    const testState = { my: 'test-state' };
    beforeEach(() => {
      hook = hooks.reduxValues();
    });
    test('gradeStatus drawn from selected grade status', () => {
      expect(hook.gradeStatus).toEqual(
        useSelector(selectors.grading.selected.gradeStatus),
      );
    });
    test('gradingStatus drawn from selected grading status', () => {
      expect(hook.gradingStatus).toEqual(
        useSelector(selectors.grading.selected.gradingStatus),
      );
    });
    test('gradeIsPending drawn from requests.isPending on submitGrade request', () => {
      expect(hook.gradeIsPending.useSelector(testState)).toEqual(
        selectors.requests.isPending(testState, { requestKey: RequestKeys.submitGrade }),
      );
    });
    test('lockIsPending drawn from requests.isPending on setLock request', () => {
      expect(hook.lockIsPending.useSelector(testState)).toEqual(
        selectors.requests.isPending(testState, { requestKey: RequestKeys.setLock }),
      );
    });
  });
  describe('non-state hooks', () => {
    beforeEach(state.mock);
    afterEach(state.restore);
    describe('buttonArgs', () => {
      const props = {
        intl,
        dispatch,
        overrideGradeState: { setShow: jest.fn() },
        stopGradingState: { setShow: jest.fn() },
        gradingStatus: gradingStatuses.ungraded,
        isPending: false,
      };
      describe('returned args', () => {
        const testStatusConfig = (status) => {
          describe(`status config for ${status} submissions`, () => {
            beforeEach(() => {
              selectors.grading.selected.gradingStatus.mockReturnValue(status);
              hook = hooks.buttonArgs({ ...props, gradingStatus: status });
            });
            it('loads configured iconAfter', () => {
              expect(hook.iconAfter).toEqual(hooks.buttonConfig[status].iconAfter);
            });
            it('loads and formats label from config', () => {
              expect(hook.children).toEqual(formatMessage(hooks.buttonConfig[status].label));
            });
            describe('onClick', () => {
              if (status === gradingStatuses.inProgress) {
                it('shows the confirm stop-grading modal', () => {
                  hook.onClick();
                  expect(props.stopGradingState.setShow).toHaveBeenCalledWith(true);
                });
              } else if (status === gradingStatuses.graded) {
                it('shows the confirm stop-grading modal', () => {
                  hook.onClick();
                  expect(props.overrideGradeState.setShow).toHaveBeenCalledWith(true);
                });
              } else {
                it('dispatches the startGrading thunkAction', () => {
                  hook.onClick();
                  expect(props.dispatch).toHaveBeenCalledWith(thunkActions.grading.startGrading());
                });
              }
            });
          });
        };
        testStatusConfig(gradingStatuses.ungraded);
        testStatusConfig(gradingStatuses.graded);
        testStatusConfig(gradingStatuses.inProgress);
      });
    });
    describe('overrideGradeArgs', () => {
      const props = { show: 'test-show', setShow: jest.fn() };
      beforeEach(() => {
        hook = hooks.overrideGradeArgs({ dispatch, overrideGradeState: props });
      });
      test('isOpen returns the override grade show state', () => {
        expect(hook.isOpen).toEqual(props.show);
      });
      test('onCancel: sets override grade show state to false', () => {
        hook.onCancel();
        expect(props.setShow).toHaveBeenCalledWith(false);
      });
      describe('onConfirm', () => {
        test('sets override grade show state to false and starts grading', () => {
          hook.onConfirm();
          expect(props.setShow).toHaveBeenCalledWith(false);
          expect(dispatch).toHaveBeenCalledWith(thunkActions.grading.startGrading());
        });
      });
    });
    describe('stopGradingArgs', () => {
      const props = { show: 'test-show', setShow: jest.fn() };
      beforeEach(() => {
        hook = hooks.stopGradingArgs({
          dispatch,
          isGraded: testValue,
          stopGradingState: props,
        });
      });
      test('isOpen returns the stop grading show state', () => {
        expect(hook.isOpen).toEqual(props.show);
      });
      test('onCancel: sets stop grading show state to false', () => {
        hook.onCancel();
        expect(props.setShow).toHaveBeenCalledWith(false);
      });
      describe('onConfirm', () => {
        test('sets stop grading show state to false and cancels grading', () => {
          hook.onConfirm();
          expect(props.setShow).toHaveBeenCalledWith(false);
          expect(dispatch).toHaveBeenCalledWith(thunkActions.grading.cancelGrading());
        });
      });
      test('isOverride is set to isGraded arg', () => {
        expect(hook.isOverride).toEqual(testValue);
      });
    });
    describe('button component hooks', () => {
      const reduxValues = {
        gradeStatus: 'redux-values.gradeStatus',
        gradingStatus: 'redux-values.gradingStatus',
        gradeIsPending: false,
        lockIsPending: false,
      };
      const mocks = {
        buttonArgs: jest.fn(args => ({ buttonArgs: args })),
        overrideGradeArgs: jest.fn(args => ({ overrideGradeArgs: args })),
        reduxValues: () => reduxValues,
        stopGradingArgs: jest.fn(args => ({ stopGradingArgs: args })),
      };
      let overrideGradeState;
      let stopGradingState;
      const mockHooks = (values) => {
        jest.spyOn(hooks, hookKeys.buttonArgs).mockImplementationOnce(mocks.buttonArgs);
        jest.spyOn(hooks, hookKeys.overrideGradeArgs).mockImplementationOnce(mocks.overrideGradeArgs);
        jest.spyOn(hooks, hookKeys.reduxValues).mockImplementationOnce(() => ({
          ...reduxValues,
          ...values,
        }));
        jest.spyOn(hooks, hookKeys.stopGradingArgs).mockImplementationOnce(mocks.stopGradingArgs);
      };
      beforeEach(() => {
        mockHooks(reduxValues);
        hook = hooks.buttonHooks({ dispatch, intl });
        overrideGradeState = {
          show: state.stateVals.showConfirmOverrideGrade,
          setShow: state.setState.showConfirmOverrideGrade,
        };
        stopGradingState = {
          show: state.stateVals.showConfirmStopGrading,
          setShow: state.setState.showConfirmStopGrading,
        };
      });
      describe('behavior', () => {
        it('initializes showConfirmStopGrading and showConfirmOverrideGrade to false', () => {
          expect(hooks.state.showConfirmStopGrading).toHaveBeenCalledWith(false);
          expect(hooks.state.showConfirmOverrideGrade).toHaveBeenCalledWith(false);
        });
      });
      describe('returned object', () => {
        test('hide returns true iff gradingStatus is not locked', () => {
          expect(hook.hide).toEqual(false);
          mockHooks({ gradingStatus: gradingStatuses.locked });
          hook = hooks.buttonHooks({ dispatch, intl });
          expect(hook.hide).toEqual(true);
        });
        test('returns only hide hook if locked', () => {
          mockHooks({ gradingStatus: gradingStatuses.locked });
          hook = hooks.buttonHooks({ dispatch, intl });
          expect(hook).toEqual({ hide: true });
        });
        test('overrideGradeArgs: calls local hook with dispatch and override grade state', () => {
          expect(hook.overrideGradeArgs).toEqual(mocks.overrideGradeArgs({
            dispatch,
            overrideGradeState,
          }));
        });
        describe('stopGradingArgs forwards local hook called with', () => {
          test('dispatch, stop grading state, and if submission is graded', () => {
            expect(hook.stopGradingArgs).toEqual(mocks.stopGradingArgs({
              dispatch,
              stopGradingState,
              isGraded: false,
            }));
            mockHooks({ gradeStatus: gradingStatuses.graded });
            hook = hooks.buttonHooks({ dispatch, intl });
            expect(hook.stopGradingArgs).toEqual(mocks.stopGradingArgs({
              dispatch,
              stopGradingState,
              isGraded: true,
            }));
          });
        });
        describe('buttonArgs forwards local hook called with', () => {
          test('props, local state, grading status and whether lock or grade are pending', () => {
            expect(hook.buttonArgs).toEqual(mocks.buttonArgs({
              intl,
              dispatch,
              stopGradingState,
              overrideGradeState,
              gradingStatus: reduxValues.gradingStatus,
              isPending: false,
            }));
            [
              { gradeIsPending: true },
              { lockIsPending: true },
              { gradeIsPending: true, lockIsPending: true },
            ].forEach(values => {
              mockHooks(values);
              hook = hooks.buttonHooks({ dispatch, intl });
              expect(hook.buttonArgs).toEqual(mocks.buttonArgs({
                intl,
                dispatch,
                stopGradingState,
                overrideGradeState,
                gradingStatus: reduxValues.gradingStatus,
                isPending: true,
              }));
            });
          });
        });
      });
    });
  });
});
