import { lockStatuses } from 'data/services/lms/constants';

import { StrictDict } from 'utils';
import * as submissionsSelectors from '../../submissions/selectors';
import * as appSelectors from '../../app/selectors';
import { simpleSelectors } from './base';
import * as selectors from './selected';

jest.mock('reselect', () => ({
  createSelector: jest.fn((preSelectors, cb) => ({ preSelectors, cb })),
}));

const submissionUUIDs = [
  'submissionUUID1',
  'submissionUUID2',
  'submissionUUID3',
  'submissionUUID4',
];

const testValue = 'some test data';

const selectorKeys = StrictDict(
  Object.keys(selectors).reduce(
    (obj, key) => ({ ...obj, [key]: key }),
    {},
  ),
);

describe('gradingStatusTransform', () => {
  it('returns gradeStatus is unlocked', () => {
    expect(selectors.gradingStatusTransform({
      gradeStatus: testValue,
      lockStatus: lockStatuses.unlocked,
    })).toEqual(testValue);
  });
});

describe('selected submission grading selectors unit tests', () => {
  const testReselect = ({
    selector,
    preSelectors,
    args,
    expected,
  }) => {
    expect(selector.preSelectors).toEqual(preSelectors);
    expect(selector.cb(...args)).toEqual(expected);
  };
  const selectedKeys = StrictDict(
    Object.keys(selectors.selected).reduce(
      (obj, key) => ({ ...obj, [key]: key }),
      {},
    ),
  );
  describe('selected.submissionUUID selector', () => {
    it('returns the UUID of the selected submission', () => {
      const submissionUUID = submissionUUIDs[2];
      const activeIndex = 'test index';
      const selected = { [activeIndex]: 'test submission id' };
      const submissions = {
        [selected[activeIndex]]: { submissionUUID },
      };
      testReselect({
        selector: selectors.selected.submissionUUID,
        preSelectors: [
          simpleSelectors.selection,
          submissionsSelectors.simpleSelectors.allSubmissions,
          simpleSelectors.activeIndex,
        ],
        args: [selected, submissions, activeIndex],
        expected: submissionUUID,
      });
    });
  });
  describe('selected.gradeStatus selector', () => {
    it('returns the grade status of current item', () => {
      testReselect({
        selector: selectors.selected.gradeStatus,
        preSelectors: [simpleSelectors.current],
        args: [{ gradeStatus: testValue }],
        expected: testValue,
      });
    });
  });
  describe('selected.lockStatus selector', () => {
    it('returns the lock status of selected item', () => {
      testReselect({
        selector: selectors.selected.lockStatus,
        preSelectors: [simpleSelectors.current],
        args: [{ lockStatus: testValue }],
        expected: testValue,
      });
    });
  });
  describe('selected.response selector', () => {
    it('returns the response for the selected item', () => {
      testReselect({
        selector: selectors.selected.response,
        preSelectors: [simpleSelectors.current],
        args: [{ response: testValue }],
        expected: testValue,
      });
    });
  });
  describe('selected.gradingStatus selector', () => {
    it('returns the grading status for the selected item', () => {
      const transform = ({ gradeStatus, lockStatus }) => ({
        gradingStatusTransform: { gradeStatus, lockStatus },
      });
      jest.spyOn(
        selectors,
        selectorKeys.gradingStatusTransform,
      ).mockImplementationOnce(transform);
      const gradeStatus = 'gradeSTATUS';
      const lockStatus = 'LOCKstatus';
      testReselect({
        selector: selectors.selected.gradingStatus,
        preSelectors: [
          selectors.selected.gradeStatus,
          selectors.selected.lockStatus,
        ],
        args: [gradeStatus, lockStatus],
        expected: transform({ gradeStatus, lockStatus }),
      });
    });
  });
  describe('selected.isGrading selector', () => {
    const { isGrading } = selectors.selected;
    it('is a reselect selector based on gradingStatus', () => {
      expect(isGrading.preSelectors).toEqual([selectors.selected.gradingStatus]);
    });
    it('returns false if grading is not in progress', () => {
      expect(isGrading.cb(lockStatuses.locked)).toEqual(false);
      expect(isGrading.cb(lockStatuses.unlocked)).toEqual(false);
    });
    it('returns true if grading is in progress', () => {
      expect(isGrading.cb(lockStatuses.inProgress)).toEqual(true);
    });
  });
  describe('selected.staticData selector', () => {
    const submissionUUID = submissionUUIDs[1];
    const staticData = {
      static1: `some static data ${submissionUUID}`,
      static2: `other static data ${submissionUUID}`,
    };
    const submission = {
      grade: `grade ${submissionUUID}`,
      gradeStatus: `gradeStatus ${submissionUUID}`,
      ...staticData,
    };
    it('returns the static data for the selected item', () => {
      testReselect({
        selector: selectors.selected.staticData,
        preSelectors: [
          selectors.selected.submissionUUID,
          submissionsSelectors.simpleSelectors.allSubmissions,
        ],
        args: [submissionUUID, { [submissionUUID]: submission }],
        expected: staticData,
      });
    });
  });
  describe('selected.username selector', () => {
    it('returns the username associated with the selected item', () => {
      testReselect({
        selector: selectors.selected.username,
        preSelectors: [selectors.selected.staticData],
        args: [{ username: testValue }],
        expected: testValue,
      });
    });
  });
  describe('selected.teamName selector', () => {
    it('returns the team name associated with the selected item', () => {
      testReselect({
        selector: selectors.selected.teamName,
        preSelectors: [selectors.selected.staticData],
        args: [{ teamName: testValue }],
        expected: testValue,
      });
    });
  });
  describe('selected.userDisplay selector', () => {
    const { userDisplay } = selectors.selected;
    const username = 'USERname';
    const teamName = 'teamNAME';
    it('is a reselect selector based on the username, teamName, and whether the ORA is individual', () => {
      expect(userDisplay.preSelectors).toEqual([
        appSelectors.ora.isIndividual,
        selectors.selected.username,
        selectors.selected.teamName,
      ]);
    });
    it('returns the username if is an individual ora', () => {
      expect(userDisplay.cb(true, username, teamName)).toEqual(username);
    });
    it('returns the username if is not an individual ora', () => {
      expect(userDisplay.cb(false, username, teamName)).toEqual(teamName);
    });
  });
  describe('selected.gradeData selector', () => {
    it('returns the grade data associated with the selected item', () => {
      const submissionUUID = submissionUUIDs[0];
      const gradeData = { my: 'gradeData' };
      testReselect({
        selector: selectors.selected.gradeData,
        preSelectors: [selectors.selected.submissionUUID, simpleSelectors.gradeData],
        args: [submissionUUID, { [submissionUUID]: gradeData }],
        expected: gradeData,
      });
    });
  });
  describe('selected.gradingData selector', () => {
    it('returns the grading data associated with the selected item', () => {
      const submissionUUID = submissionUUIDs[0];
      const gradingData = { my: 'gradingData' };
      testReselect({
        selector: selectors.selected.gradingData,
        preSelectors: [selectors.selected.submissionUUID, simpleSelectors.gradingData],
        args: [submissionUUID, { [submissionUUID]: gradingData }],
        expected: gradingData,
      });
    });
  });
  describe('selected.criteriaGradeData selector', () => {
    const local = { criteria: 'criteria1' };
    const remote = { criteria: 'criteria2' };
    const { preSelectors, cb } = selectors.selected.criteriaGradeData;
    it('has the correct pre-selectors', () => {
      expect(preSelectors).toEqual([
        selectors.selected.isGrading,
        selectors.selected.gradeData,
        selectors.selected.gradingData,
      ]);
    });
    describe('grading', () => {
      it('returns local gradeData, defaulting to empty string', () => {
        expect(cb(true, remote, local)).toEqual(local.criteria);
        expect(cb(true, remote, null)).toEqual([]);
      });
    });
    describe('not grading', () => {
      it('returns remote gradeData, defaulting to empty string', () => {
        expect(cb(false, remote, local)).toEqual(remote.criteria);
        expect(cb(false, null, local)).toEqual([]);
      });
    });
  });

  describe('selected.score selector', () => {
    const { score } = selectors.selected;
    it('has the correct pre-selectors', () => {
      expect(score.preSelectors).toEqual([selectors.selected.gradeData]);
    });
    it('returns the score associated with the selected item', () => {
      expect(score.cb({ score: testValue })).toEqual(testValue);
    });
    it('returns an empty object if no score associated with the selected item', () => {
      expect(score.cb({ score: {} })).toEqual({});
      expect(score.cb({ score: null })).toEqual({});
    });
  });

  describe('selected.overallFeedback selector', () => {
    const localValue = 'localVALUE';
    const remoteValue = 'remoteVALUE';
    const local = { overallFeedback: localValue };
    const remote = { overallFeedback: remoteValue };
    const { cb, preSelectors } = selectors.selected.overallFeedback;
    it('has the correct pre-selectors', () => {
      expect(preSelectors).toEqual([
        selectors.selected.isGrading,
        selectors.selected.gradeData,
        selectors.selected.gradingData,
      ]);
    });
    describe('if isGrading', () => {
      it('returns local overallFeedback, defaulting to empty string', () => {
        expect(cb(true, remote, local)).toEqual(localValue);
        expect(cb(true, remote, null)).toEqual('');
      });
    });
    describe('if not isGrading', () => {
      it('returns remote overallFeedback, defaulting to empty string', () => {
        expect(cb(false, remote, local)).toEqual(remoteValue);
        expect(cb(false, null, local)).toEqual('');
      });
    });
  });

  describe('selected.criterionGradeData selector', () => {
    const orderNum = 'testOrderNum1';
    const testState = { [orderNum]: { state: 'some state' } };
    let oldSelector;
    beforeEach(() => {
      oldSelector = selectors.selected.criteriaGradeData;
    });
    afterEach(() => {
      selectors.selected.criteriaGradeData = oldSelector;
    });
    it('returns the grade data for a given criterion of the current selections', () => {
      selectors.selected.criteriaGradeData = (state) => ({ [orderNum]: state });
      expect(
        selectors.selected.criterionGradeData(testState, { orderNum }),
      ).toEqual(testState);
    });
    it('returns an empty object if grade data for a given criterion does not exist', () => {
      selectors.selected.criteriaGradeData = () => null;
      expect(
        selectors.selected.criterionGradeData(testState, { orderNum }),
      ).toEqual({});
    });
  });

  describe('selected.criterionSelectedOption selector', () => {
    const orderNum = 'testOrderNum1';
    const testState = { [orderNum]: { selectedOption: 'test selection' } };
    const selector = selectors.selected.criterionSelectedOption;
    const mockGradeData = () => jest.spyOn(selectors.selected, selectedKeys.criterionGradeData);
    it('returns the selected option for a given criterion of the current selections', () => {
      mockGradeData().mockImplementationOnce(
        (state, args) => ({ selectedOption: { state, args } }),
      );
      expect(selector(testState, { orderNum })).toEqual({
        state: testState,
        args: { orderNum },
      });
    });
    it('returns an empty object if grade data for a given criterion is not selected', () => {
      mockGradeData().mockReturnValueOnce(null);
      expect(selector(testState, { orderNum })).toEqual('');
    });
  });
  describe('selected.criterionFeedback selector', () => {
    const orderNum = 'testOrderNum1';
    const testState = { [orderNum]: { feedback: 'test feedback' } };
    const selector = selectors.selected.criterionFeedback;
    const mockGradeData = () => jest.spyOn(selectors.selected, selectedKeys.criterionGradeData);
    it('returns the feedback for a given criterion of the current selections', () => {
      mockGradeData().mockImplementationOnce(
        (state, args) => ({ feedback: { state, args } }),
      );
      expect(selector(testState, { orderNum })).toEqual({
        state: testState,
        args: { orderNum },
      });
    });
    it('returns an empty object if feedback for a given criterion does not exist', () => {
      mockGradeData().mockReturnValueOnce(null);
      expect(selector(testState, { orderNum })).toEqual('');
    });
  });
});
