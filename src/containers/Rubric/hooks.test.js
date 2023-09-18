import { useSelector } from 'react-redux';

import { keyStore } from 'utils';
import { selectors, thunkActions } from 'data/redux';
import { RequestKeys } from 'data/constants/requests';

import { MockUseState } from 'testUtils';
import * as hooks from './hooks';

jest.mock('data/redux', () => ({
  selectors: {
    app: {
      rubric: { criteriaIndices: (args) => ({ criteriaIndices: args }) },
    },
    grading: {
      selected: { isGrading: (args) => ({ isGrading: args }) },
    },
    requests: {
      isCompleted: (...args) => ({ isCompleted: args }),
      isPending: (...args) => ({ isPending: args }),
    },
  },
  thunkActions: {
    grading: {
      submitGrade: (args) => ({ submitGrade: args }),
    },
  },
}));

const state = new MockUseState(hooks);
const hookKeys = keyStore(hooks);
const testState = { my: 'test-state' };
const dispatch = jest.fn();
let hook;

describe('Rubric hooks', () => {
  beforeEach(jest.clearAllMocks);
  describe('state hooks', () => {
    state.testGetter(state.keys.showDemoAlert);
  });
  describe('non-state hooks', () => {
    beforeEach(state.mock);
    afterEach(state.restore);
    describe('redux values', () => {
      beforeEach(() => { hook = hooks.reduxValues(); });
      test('loads gradeIsPending from isPending requests selector on submitGrade request', () => {
        expect(hook.gradeIsPending.useSelector(testState)).toEqual(
          selectors.requests.isPending(testState, { requestKey: RequestKeys.submitGrade }),
        );
      });
      test('loads criteriaIndices from rubric selector', () => {
        expect(hook.criteriaIndices).toEqual(useSelector(selectors.app.rubric.criteriaIndices));
      });
      test('loads isCompleted from requests selector on submitGrade request', () => {
        expect(hook.isCompleted.useSelector(testState)).toEqual(
          selectors.requests.isCompleted(testState, { requestKey: RequestKeys.submitGrade }),
        );
      });
      test('loads isEnabled from app selector', () => {
        expect(hook.isEnabled).toEqual(useSelector(selectors.app.isEnabled));
      });
      test('loads isGrading from grading selector for selected submission', () => {
        expect(hook.isGrading).toEqual(useSelector(selectors.grading.selected.isGrading));
      });
      test('loads lockIsPending from isPending requests selector on setLock request', () => {
        expect(hook.lockIsPending.useSelector(testState)).toEqual(
          selectors.requests.isPending(testState, { requestKey: RequestKeys.setLock }),
        );
      });
    });
    describe('rendererHooks', () => {
      const reduxValues = {
        criteriaIndices: [0, 1, 2, 3, 4],
        isGrading: false,
        isCompleted: false,
        gradeIsPending: false,
        lockIsPending: false,
        isEnabled: true,
      };

      const mockHook = (values) => {
        jest.spyOn(hooks, hookKeys.reduxValues).mockReturnValueOnce({
          ...reduxValues,
          ...values,
        });
        hook = hooks.rendererHooks({ dispatch });
      };
      describe('criteria', () => {
        it('maps criteria indices from redux to an object with isGrading value', () => {
          const testIsGrading = 'test-is-grading';
          mockHook({ isGrading: testIsGrading });
          expect(hook.criteria).toEqual(reduxValues.criteriaIndices.map(index => ({
            isGrading: testIsGrading,
            orderNum: index,
            key: index,
          })));
        });
      });
      it('shows footer is grading or completed', () => {
        mockHook({});
        expect(hook.showFooter).toEqual(false);
        mockHook({ isGrading: true });
        expect(hook.showFooter).toEqual(true);
        mockHook({ isCompleted: true });
        expect(hook.showFooter).toEqual(true);
      });
      describe('buttonProps', () => {
        describe('onClick', () => {
          it('shows demo alert if app is not enabled', () => {
            mockHook({ isEnabled: false });
            hook.buttonProps.onClick();
            expect(state.setState.showDemoAlert).toHaveBeenCalledWith(true);
          });
          it('submits grade if app is enabled', () => {
            mockHook({});
            hook.buttonProps.onClick();
            expect(dispatch).toHaveBeenCalledWith(thunkActions.grading.submitGrade());
          });
        });
      });
      describe('demoAlertProps', () => {
        test('open linked to showDemoAlert state', () => {
          mockHook({});
          expect(hook.demoAlertProps.isOpen).toEqual(state.stateVals.showDemoAlert);
          expect(hook.demoAlertProps.isOpen).toEqual(false);
          state.mockVal(state.keys.showDemoAlert, true);
          mockHook({});
          expect(hook.demoAlertProps.isOpen).toEqual(true);
        });
        test('on close, hides demo alert', () => {
          mockHook({});
          hook.demoAlertProps.onClose();
          expect(state.setState.showDemoAlert).toHaveBeenCalledWith(false);
        });
      });
    });
  });
});
