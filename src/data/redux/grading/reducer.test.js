import { keyStore } from 'utils';
import { lockStatuses } from 'data/services/lms/constants';

import * as module from './reducer';

const {
  initialState,

  updateGradingData,
  updateCriterion,

  reducer,
  actions,
} = module;

const moduleKeys = keyStore(module);

describe('app reducer', () => {
  describe('initialState', () => {
    test('empty selection list', () => {
      expect(initialState.selection).toEqual([]);
    });
    test('empty gradeData object', () => {
      expect(initialState.gradeData).toEqual({});
    });
    test('empty gradingData object', () => {
      expect(initialState.gradingData).toEqual({});
    });
    test('null activeIndex', () => {
      expect(initialState.activeIndex).toEqual(null);
    });
    test('empty current object', () => {
      expect(initialState.current).toEqual({});
    });
    test('null prev pointer', () => {
      expect(initialState.prev).toEqual(null);
    });
    test('null next pointer', () => {
      expect(initialState.next).toEqual(null);
    });
  });

  const submissionUUID = 'test-submission-uuid';
  const orderNum = 1;
  const criterion = { unique: 'criterion-data' };
  const criteria = [{ some: 'test-data' }, criterion, { other: 'fake-data' }];
  const baseGradingData = { fakeID: { some: 'test-data' } };
  const gradingData = { unique: 'submission-grading-data', criteria };
  const lockStatus = 'test-lock-status';
  const gradeStatus = 'test-grade-status';
  const testState = {
    current: { submissionUUID },
    gradingData: { ...baseGradingData, [submissionUUID]: gradingData },
    gradeData: { ...baseGradingData, [submissionUUID]: gradingData },
    activeIndex: 12,
  };
  const testValue = 'my-test-value';
  const testData = { unique: 'test-data' };
  describe('helpers', () => {
    describe('updateGradingData', () => {
      it('returns new state with new grading data for current submission added to model', () => {
        expect(updateGradingData(testState, testData)).toEqual({
          ...testState,
          gradingData: {
            ...baseGradingData,
            [submissionUUID]: { ...gradingData, ...testData },
          },
        });
        expect(
          updateGradingData({ ...testState, gradingData: baseGradingData }, testData),
        ).toEqual({
          ...testState,
          gradingData: {
            ...baseGradingData,
            [submissionUUID]: testData,
          },
        });
      });
    });
    describe('updateCriterion', () => {
      it('overlays the given data on a given criterion field', () => {
        const mocks = {
          updateGradingData: (...args) => ({ updateGradingData: args }),
        };
        jest.spyOn(module, moduleKeys.updateGradingData)
          .mockImplementationOnce(mocks.updateGradingData);
        expect(updateCriterion(testState, orderNum, testData)).toEqual(
          mocks.updateGradingData(testState, {
            ...gradingData,
            criteria: [criteria[0], { ...criterion, ...testData }, criteria[2]],
          }),
        );
      });
    });
  });
  describe('reducers', () => {
    it('returns initial state', () => {
      expect(reducer(undefined, {})).toEqual(initialState);
    });
    describe('action handlers', () => {
      describe('loadSubmission', () => {
        it('loads payload to current and overlays current grade data', () => {
          const payload = { submissionUUID, gradeData: testData };
          expect(reducer(testState, actions.loadSubmission(payload))).toEqual({
            ...testState,
            current: payload,
            gradeData: {
              ...testState.gradeData,
              [submissionUUID]: testData,
            },
          });
        });
      });
      describe('loadNext', () => {
        it('clears current and increments activeIndex', () => {
          expect(reducer(testState, actions.loadNext())).toEqual({
            ...testState,
            current: {},
            activeIndex: testState.activeIndex + 1,
          });
        });
      });
      describe('loadPrev', () => {
        it('clears current and decrements activeIndex', () => {
          expect(reducer(testState, actions.loadPrev())).toEqual({
            ...testState,
            current: {},
            activeIndex: testState.activeIndex - 1,
          });
        });
      });
      describe('updateSelection', () => {
        it('loads selection from payload and sets activeIndex to 0', () => {
          expect(reducer(testState, actions.updateSelection(testData))).toEqual({
            ...testState,
            selection: testData,
            activeIndex: 0,
          });
        });
      });
      describe('startGrading', () => {
        describe('resulting state', () => {
          const action = actions.startGrading({ lockStatus, gradeData: testData });
          test('loads current lockStatus from payload', () => {
            expect(reducer(testState, action).current).toEqual({
              ...testState.current,
              lockStatus,
            });
          });
          test('loads selected gradeData from payload', () => {
            expect(reducer(testState, action).gradeData).toEqual({
              ...testState.gradeData,
              [submissionUUID]: testData,
            });
          });
          test('loads gradingData w/ showValidation: false, overlaying on existing data', () => {
            expect(reducer(testState, action).gradingData).toEqual({
              ...testState.gradingData,
              [submissionUUID]: {
                showValidation: false,
                ...testData,
                ...gradingData,
              },
            });
            expect(reducer({ ...testState, gradingData: {} }, action).gradingData).toEqual({
              [submissionUUID]: { showValidation: false, ...testData },
            });
          });
        });
      });
      describe('failSetLock', () => {
        it('loads lockStatus from payload', () => {
          expect(reducer(testState, actions.failSetLock({ lockStatus: testValue }))).toEqual({
            ...testState,
            current: { ...testState.current, lockStatus: testValue },
          });
        });
      });
      describe('gradingData updaters', () => {
        const mocks = {
          updateGradingData: args => ({ updateGradingData: args }),
        };
        beforeEach(() => {
          jest.spyOn(module, moduleKeys.updateGradingData)
            .mockImplementationOnce(mocks.updateGradingData);
        });
        describe('setRubricFeedback', () => {
          it('loads overallFeedback from payload', () => {
            expect(reducer(testState, actions.setRubricFeedback(testValue))).toEqual(
              mocks.updateGradingData(testState, { overallFeedback: testValue }),
            );
          });
        });
        describe('setShowValidation', () => {
          it('loads showValidation from payload', () => {
            expect(reducer(testState, actions.setShowValidation(testValue))).toEqual(
              mocks.updateGradingData(testState, { showValidation: testValue }),
            );
          });
        });
      });
      describe('criterion updaters', () => {
        const mocks = {
          updateCriterion: args => ({ updateCriterion: args }),
        };
        beforeEach(() => {
          jest.spyOn(module, moduleKeys.updateCriterion)
            .mockImplementationOnce(mocks.updateCriterion);
        });
        const args = { orderNum, value: testValue };
        describe('setCriterionOption', () => {
          it('loads selectedOption by orderNum', () => {
            expect(reducer(testState, actions.setCriterionOption(testState, args))).toEqual(
              mocks.updateCriterion(testState, orderNum, { selectedOption: testValue }),
            );
          });
        });
        describe('setCriterionFeedback', () => {
          it('loads feedback by orderNum', () => {
            expect(reducer(testState, actions.setCriterionFeedback(testState, args))).toEqual(
              mocks.updateCriterion(testState, orderNum, { feedback: testValue }),
            );
          });
        });
      });
      describe('completeGrading', () => {
        describe('resulting state', () => {
          const payload = { gradeData: testData, lockStatus, gradeStatus };
          let output;
          beforeAll(() => {
            output = reducer(testState, actions.completeGrading(payload));
          });
          test('gradeData: loads gradeData from payload', () => {
            expect(output.gradeData).toEqual({
              ...testState.gradeData,
              [submissionUUID]: testData,
            });
          });
          test('gradingData: deletes current data', () => {
            expect(output.gradingData).toEqual(baseGradingData);
          });
          test('current: loads gradeStatus and lockStatus from payload', () => {
            expect(output.current).toEqual({
              ...testState.current,
              lockStatus,
              gradeStatus,
            });
          });
        });
      });
      describe('stopGrading', () => {
        let output;
        const args = { submissionStatus: { gradeData: testData, lockStatus, gradeStatus } };
        describe('resulting state', () => {
          test('gradingData: deletes current data', () => {
            output = reducer(testState, actions.stopGrading());
            expect(output.gradingData).toEqual(baseGradingData);
          });
          test('gradeData: appends payload.submissionStatus.gradeData if passed', () => {
            output = reducer(testState, actions.stopGrading());
            expect(output.gradeData).toEqual(testState.gradeData);
            output = reducer(testState, actions.stopGrading(args));
            expect(output.gradeData).toEqual({
              ...testState.gradeData,
              [submissionUUID]: testData,
            });
          });
          describe('current: loads lockStatus and gradeStatus', () => {
            test('defaults to state.current.gradeStatus and unlocked', () => {
              output = reducer(testState, actions.stopGrading());
              expect(output.current).toEqual({
                ...testState.current,
                lockStatus: lockStatuses.unlocked,
              });
            });
            test('loads from payload is passed', () => {
              output = reducer(testState, actions.stopGrading(args));
              expect(output.current).toEqual({ ...testState.current, lockStatus, gradeStatus });
            });
          });
        });
      });
    });
  });
});
